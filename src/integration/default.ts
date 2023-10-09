import {
  AnalyticsConnector,
  ApplicationContext,
} from '@amplitude/analytics-connector';
import { Poller } from '@amplitude/experiment-core';
import { NativeModules } from 'react-native';

import { ExperimentUser, ExperimentUserProvider } from '../types/user';
import { isNative } from '../util/platform';

import { ConnectorUserProvider } from './connector';

export interface ExperimentReactNativeClientModule {
  getApplicationContext(): Promise<Record<string, string>>;
}

export class DefaultUserProvider implements ExperimentUserProvider {
  public baseProvider: ExperimentUserProvider | null;
  private readonly nativeModule:
    | ExperimentReactNativeClientModule
    | undefined
    | null = NativeModules.ExperimentReactNativeClient;
  private readonly applicationContext: ApplicationContext;
  public cachedUser: ExperimentUser | undefined;
  public cachedApplicationContext: Record<string, string>;
  private readonly poller: Poller = new Poller(() => this.load(), 1000);

  constructor(baseProvider: ExperimentUserProvider = null) {
    this.baseProvider = baseProvider;
    this.applicationContext =
      AnalyticsConnector.getInstance(
        'context',
      ).applicationContextProvider.getApplicationContext();
    this.load();
    this.poller.start();
  }

  /**
   * The variant method is not async
   */
  async load(): Promise<void> {
    this.cachedUser = await this.getUser();
  }

  async getApplicationContext(): Promise<Record<string, string>> {
    if (this.cachedApplicationContext) {
      return this.cachedApplicationContext;
    } else if (isNative()) {
      this.cachedApplicationContext =
        await this.nativeModule?.getApplicationContext();
      return this.cachedApplicationContext;
    } else {
      this.cachedApplicationContext = this.applicationContext;
      return this.cachedApplicationContext;
    }
  }

  getUserSync(): ExperimentUser {
    const context = this.cachedApplicationContext;
    let user: ExperimentUser;
    if (this.baseProvider instanceof ConnectorUserProvider) {
      const connectorProvider = this.baseProvider as ConnectorUserProvider;
      user = connectorProvider.getUserSync();
    } else {
      user = this.cachedUser;
    }
    return {
      ...context,
      ...user,
    };
  }

  async getUser(): Promise<ExperimentUser> {
    const context = await this.getApplicationContext();
    const baseUser = await this.baseProvider?.getUser();
    return {
      ...context,
      ...baseUser,
    };
  }
}
