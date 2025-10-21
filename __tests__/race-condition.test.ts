import { SdkEvaluationApi } from '@amplitude/experiment-core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ExperimentClient } from '../src/experimentClient';
import { HttpClient, SimpleResponse } from '../src/types/transport';
import { ExperimentUser } from '../src/types/user';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const API_KEY = 'client-test-race-condition';

const testUser: ExperimentUser = { user_id: 'test_user' };

beforeEach(async () => {
  await AsyncStorage.clear();
});

/**
 * Mock HTTP client that allows us to control the timing of responses
 */
class DelayedHttpClient implements HttpClient {
  private readonly delayMs: number;
  private readonly response: SimpleResponse;

  constructor(delayMs: number, response: SimpleResponse) {
    this.delayMs = delayMs;
    this.response = response;
  }

  async request(): Promise<SimpleResponse> {
    await delay(this.delayMs);
    return this.response;
  }
}

/**
 * Test that demonstrates the race condition bug:
 * When two fetches are called in quick succession, if the second completes before
 * the first, the older response can overwrite the newer one.
 */
test('ExperimentClient.fetch, race condition bug - older response overwrites newer', async () => {
  // Create two different HTTP clients with different delays and responses
  // The first request will take 200ms and return 'old-value'
  const slowClient = new DelayedHttpClient(200, {
    status: 200,
    body: JSON.stringify({
      'test-flag': {
        key: 'old',
        value: 'old-value',
      },
    }),
  });

  // The second request will take 50ms and return 'new-value'
  const fastClient = new DelayedHttpClient(50, {
    status: 200,
    body: JSON.stringify({
      'test-flag': {
        key: 'new',
        value: 'new-value',
      },
    }),
  });

  // Create client with the slow HTTP client for the first request
  const client = new ExperimentClient(API_KEY, {
    httpClient: slowClient,
  });

  // Start the first fetch (will take 200ms)
  const firstFetch = client.fetch(testUser);

  // Wait a tiny bit to ensure first fetch has started
  await delay(10);

  // Swap to the fast client for the second request
  // Note: In real code, this would be a second fetch call that happens to complete faster
  // due to network conditions, server load, etc.
  (client as any).evaluationApi = new SdkEvaluationApi(
    API_KEY,
    'https://api.lab.amplitude.com',
    { request: fastClient.request.bind(fastClient) },
  );

  // Start the second fetch (will take 50ms and complete first)
  const secondFetch = client.fetch(testUser);

  // Wait for both to complete
  await Promise.all([firstFetch, secondFetch]);

  // The bug: the result should be 'new-value' from the second (most recent) fetch,
  // but instead it's 'old-value' from the first (older) fetch that completed last
  const variant = client.variant('test-flag');

  // This test will FAIL with the bug present, showing the issue
  // Expected: 'new-value' (from the second, more recent fetch)
  // Actual: 'old-value' (from the first, older fetch that completed last)
  expect(variant.value).toBe('new-value');
});

/**
 * Simpler version: Multiple rapid fetches should always use the last one initiated
 */
test('ExperimentClient.fetch, multiple rapid fetches - last initiated wins', async () => {
  class CountingHttpClient implements HttpClient {
    private readonly id: number;
    private readonly delayMs: number;

    constructor(id: number, delayMs: number) {
      this.id = id;
      this.delayMs = delayMs;
    }

    async request(): Promise<SimpleResponse> {
      await delay(this.delayMs);
      return {
        status: 200,
        body: JSON.stringify({
          'test-flag': {
            key: `response-${this.id}`,
            value: `value-${this.id}`,
          },
        }),
      };
    }
  }

  // First request: 100ms delay
  const client1 = new ExperimentClient(API_KEY, {
    httpClient: new CountingHttpClient(1, 100),
  });

  // Start first fetch
  const fetch1 = client1.fetch(testUser);

  await delay(10);

  // Second request: 50ms delay (will complete first)
  (client1 as any).evaluationApi = new SdkEvaluationApi(
    API_KEY,
    'https://api.lab.amplitude.com',
    {
      request: new CountingHttpClient(2, 50).request.bind(
        new CountingHttpClient(2, 50),
      ),
    },
  );

  const fetch2 = client1.fetch(testUser);

  // Wait for both
  await Promise.all([fetch1, fetch2]);

  // Should have value from fetch 2 (the most recent one initiated)
  const variant = client1.variant('test-flag');
  expect(variant.value).toBe('value-2');
});
