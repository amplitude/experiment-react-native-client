/**
 * @packageDocumentation
 * @internal
 */

import { Storage } from '../types/storage';
import { Variant, Variants } from '../types/variant';
import AsyncStorage from '@react-native-community/async-storage';

export class LocalStorage implements Storage {
  protected readonly namespace: string;
  protected map: Record<string, Variant> = {};

  constructor(instanceName: string, apiKey: string) {
    const shortApiKey = apiKey.substring(apiKey.length - 6);
    this.namespace = `amp-exp-${instanceName}-${shortApiKey}`;
  }

  put(key: string, value: Variant): void {
    this.map[key] = value;
  }

  get(key: string): Variant {
    let value = this.map[key];
    if (value === undefined) {
      value = null;
    }
    return value;
  }

  clear(): void {
    this.map = {};
  }

  getAll(): Variants {
    return this.map;
  }

  async load(): Promise<void> {
    try {
      const item = await AsyncStorage.getItem(this.namespace);
      const map = JSON.parse(item) || {};
      const newMap = {};
      for (const [key, value] of Object.entries(map)) {
        if (typeof value === 'string') {
          // old format
          newMap[key] = { value: value };
        } else if (typeof value === 'object') {
          // new format
          newMap[key] = {
            // @ts-ignore
            value: value.value,
            // @ts-ignore
            payload: value.payload,
          };
        }
      }
      this.map = newMap;
    } catch (e) {
      this.map = {};
    }
  }

  async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.namespace, JSON.stringify(this.map));
    } catch (e) {
      // pass
    }
  }
}
