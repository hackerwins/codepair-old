export type DataStorageType = 'localStorage' | 'sessionStorage';

export interface DataStorage<T> {
  getValue: (key?: keyof T) => T | string | void;
  setValue: (key: keyof T, value: any) => void;
}
