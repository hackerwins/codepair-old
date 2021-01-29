import { SettingState } from 'features/settingSlices';

export default class BrowserStorage<T> {
  key: string;

  storage: Storage;

  constructor(key: string, storage: Storage) {
    this.key = key;
    this.storage = storage;
  }

  getValue(initial: T): T {
    try {
      return JSON.parse(this.storage[this.key]) as T;
    } catch {
      return initial;
    }
  }

  setValue(value: T) {
    this.storage[this.key] = JSON.stringify(value);
  }
}

const SETTING_MODEL_KEY = '$$codepair$$setting';
export const SettingModel = new BrowserStorage<SettingState>(SETTING_MODEL_KEY, window.localStorage);
