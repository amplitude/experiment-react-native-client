import AsyncStorage from '@react-native-async-storage/async-storage';

import { Storage } from '../types/storage';

export class LocalStorage implements Storage {
  async get(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async put(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
    return;
  }

  async delete(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
    return;
  }
}
