import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { NativeModules } from 'react-native';

/*
 * Mock AsyncStorage
 */
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

/*
 * Mock navigator to avoid undefined access in analytics-connector
 */
// @ts-ignore
global['navigator'] = { product: 'ReactNative' };

/*
 * Mock Native Module
 */
NativeModules.ExperimentReactNativeClient = {
  getApplicationContext: async (): Promise<Record<string, string>> => {
    return {
      version: '0.0.0-react-native-tests',
      platform: 'react-native-tests',
      os: 'react-native-tests',
      language: 'react-native-tests',
      device_brand: 'react-native-tests',
      device_manufacturer: 'react-native-tests',
      device_model: 'react-native-tests',
      carrier: 'react-native-tests',
    };
  },
};
