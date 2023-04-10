export default class BrowserStorage<T> {
  key: string;

  storage: Storage;

  constructor(key: string) {
    this.key = key;
    this.storage = window.localStorage;
  }

  getValue(initial: T): T {
    try {
      return {
        ...initial,
        ...(JSON.parse(this.storage[this.key]) as T),
      };
    } catch {
      return initial;
    }
  }

  setValue(value: T) {
    this.storage[this.key] = JSON.stringify(value);
  }
}
