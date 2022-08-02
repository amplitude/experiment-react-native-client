import { NativeModules } from 'react-native';
import {
  ExperimentConfig,
  ExperimentUser,
  Variant,
  Variants,
  ExperimentReactNativeClientModule,
} from './types';
import { version as PACKAGE_VERSION } from './gen/version';

export {
  ExperimentConfig,
  ExperimentUser,
  Source,
  Variant,
  Variants,
} from './types';

const ExperimentReactNativeClient: ExperimentReactNativeClientModule =
  NativeModules.ExperimentReactNativeClient;

export const Experiment = {
  initialize: async (
    apiKey: string,
    config?: ExperimentConfig
  ): Promise<boolean> => {
    return ExperimentReactNativeClient.initialize(apiKey, config);
  },

  initializeWithAmplitudeAnalytics: async (
    apiKey: string,
    config?: ExperimentConfig
  ): Promise<boolean> => {
    return ExperimentReactNativeClient.initializeWithAmplitudeAnalytics(
      apiKey,
      config
    );
  },

  fetch: async (user?: ExperimentUser): Promise<boolean> => {
    if (!user?.library) {
      user = {
        library: `experiment-react-native-client/${PACKAGE_VERSION}`,
        ...user,
      };
    }
    try {
      await ExperimentReactNativeClient.fetch(user);
      return true;
    } catch (e) {
      console.info('[Experiment] Fetch failed:', e);
      return false;
    }
  },

  setUser: async (user: ExperimentUser): Promise<boolean> => {
    return ExperimentReactNativeClient.setUser(user);
  },

  variant: async (key: string, fallback?: Variant): Promise<Variant> => {
    if (fallback) {
      return ExperimentReactNativeClient.variantWithFallback(key, fallback);
    } else {
      return ExperimentReactNativeClient.variant(key);
    }
  },

  all: async (): Promise<Variants> => {
    return ExperimentReactNativeClient.all();
  },

  exposure: async (key: string): Promise<boolean> => {
    return ExperimentReactNativeClient.exposure(key);
  },

  setAmplitudeUserProvider(amplitudeInstanceName?: string): Promise<boolean> {
    return ExperimentReactNativeClient.setAmplitudeUserProvider(
      amplitudeInstanceName
    );
  },
};
