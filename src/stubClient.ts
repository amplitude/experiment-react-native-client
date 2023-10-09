/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import { Client } from './types/client';
import { Defaults } from './types/config';
import { ExperimentUser, ExperimentUserProvider } from './types/user';
import { Variant, Variants } from './types/variant';

/**
 * A stub {@link Client} implementation that does nothing for all methods
 */
export class StubExperimentClient implements Client {
  public getUser(): ExperimentUser {
    return {};
  }

  public async start(_user?: ExperimentUser): Promise<void> {
    return;
  }

  public stop(): void {}

  public setUser(_user: ExperimentUser): void {}

  public async fetch(_user: ExperimentUser): Promise<StubExperimentClient> {
    return this;
  }

  public getUserProvider(): ExperimentUserProvider {
    return null;
  }

  public setUserProvider(
    _userProvider: ExperimentUserProvider,
  ): StubExperimentClient {
    return this;
  }

  public variant(_key: string, _fallback?: string | Variant): Variant {
    return Defaults.fallbackVariant;
  }

  public all(): Variants {
    return {};
  }

  public clear(): void {}

  public exposure(_key: string): void {}
}
