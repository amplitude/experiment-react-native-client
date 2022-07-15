import { ExperimentUser, ExperimentUserProvider } from '../types/user';

import { NativeModules } from 'react-native';
import {
  AnalyticsConnector,
  ApplicationContext,
} from '@amplitude/analytics-connector';
import { isNative } from '../util/platform';

export interface ExperimentReactNativeClientModule {
  getApplicationContext(): Promise<Record<string, string>>;
}

export class DefaultUserProvider implements ExperimentUserProvider {
  private readonly baseProvider: ExperimentUserProvider | null;
  private readonly nativeModule:
    | ExperimentReactNativeClientModule
    | undefined
    | null = NativeModules.ExperimentReactNativeClient;
  private readonly applicationContext: ApplicationContext;

  constructor(baseProvider: ExperimentUserProvider = null) {
    this.baseProvider = baseProvider;
    this.applicationContext =
      AnalyticsConnector.getInstance(
        'context'
      ).applicationContextProvider.getApplicationContext();
  }

  async getUser(): Promise<ExperimentUser> {
    let context;
    if (isNative()) {
      context = await this.nativeModule?.getApplicationContext();
    } else {
      context = this.applicationContext;
    }
    const baseUser = await this.baseProvider?.getUser();
    return {
      ...context,
      ...baseUser,
    };
  }
}
