import { EventBridge, IdentityStore } from '@amplitude/analytics-connector';
import { safeGlobal } from '@amplitude/experiment-core';

import { Exposure, ExposureTrackingProvider } from '../types/exposure';
import { ExperimentUser, ExperimentUserProvider } from '../types/user';

type UserProperties = Record<
  string,
  string | number | boolean | Array<string | number | boolean>
>;

export class ConnectorUserProvider implements ExperimentUserProvider {
  private readonly identityStore: IdentityStore;
  constructor(identityStore: IdentityStore) {
    this.identityStore = identityStore;
  }

  async identityReady(ms: number): Promise<void> {
    const identity = this.identityStore.getIdentity();
    if (!identity.userId && !identity.deviceId) {
      return Promise.race([
        new Promise<void>((resolve) => {
          const listener = () => {
            resolve();
            this.identityStore.removeIdentityListener(listener);
          };
          this.identityStore.addIdentityListener(listener);
        }),
        new Promise<void>((_, reject) => {
          safeGlobal.setTimeout(
            reject,
            ms,
            'Timed out waiting for Amplitude Analytics SDK to initialize. ' +
              'You must ensure that the analytics SDK is initialized prior to calling fetch().',
          );
        }),
      ]);
    }
  }

  async getUser(): Promise<ExperimentUser> {
    return this.getUserSync();
  }

  getUserSync(): ExperimentUser {
    const identity = this.identityStore.getIdentity();
    let userProperties: UserProperties;
    try {
      userProperties = identity.userProperties as UserProperties;
    } catch {
      console.warn('[Experiment] failed to cast user properties');
    }
    return {
      user_id: identity.userId,
      device_id: identity.deviceId,
      user_properties: userProperties,
    };
  }
}

export class ConnectorExposureTrackingProvider
  implements ExposureTrackingProvider
{
  private readonly eventBridge: EventBridge;

  constructor(eventBridge: EventBridge) {
    this.eventBridge = eventBridge;
  }

  track(exposure: Exposure): void {
    this.eventBridge.logEvent({
      eventType: '$exposure',
      eventProperties: exposure,
    });
  }
}
