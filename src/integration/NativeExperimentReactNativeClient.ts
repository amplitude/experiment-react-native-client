import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getApplicationContext(): Promise<{
    version?: string;
    platform?: string;
    language?: string;
    os?: string;
    device_brand?: string;
    device_manufacturer?: string;
    device_model?: string;
    carrier?: string;
  }>;
}

export default TurboModuleRegistry.get<Spec>('ExperimentReactNativeClient');
