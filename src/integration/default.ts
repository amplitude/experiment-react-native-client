import { ExperimentUserProvider } from '../types/provider';
import { ExperimentUser } from '../types/user';

import { NativeModules } from 'react-native';

export interface ExperimentReactNativeClientModule {
  getApplicationContext(): Promise<Record<string, string>>;
}

export const nativeModule: ExperimentReactNativeClientModule =
  NativeModules.ExperimentReactNativeClient;

export class DefaultUserProvider implements ExperimentUserProvider {
  private readonly baseProvider: ExperimentUserProvider | null;
  private readonly nativeModule: ExperimentReactNativeClientModule =
    NativeModules.ExperimentReactNativeClient;

  constructor(baseProvider: ExperimentUserProvider = null) {
    this.baseProvider = baseProvider;
  }

  async getUser(): Promise<ExperimentUser> {
    const nativeContext = await this.nativeModule.getApplicationContext();
    const baseUser = await this.baseProvider?.getUser();
    return {
      ...nativeContext,
      ...baseUser,
    };
  }
}
