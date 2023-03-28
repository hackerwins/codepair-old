import { describe, it, expect, vi } from 'vitest';
import BrowserStorage from './storage';

/**
 * @vitest-environment jsdom
 */
describe('BrowserStorage', () => {
  it('should get default data when storage have no data', () => {
    const browserStorage = new BrowserStorage('test');
    const testData = {
      codeKey: 'vim',
      theme: 'dark',
    };

    expect(browserStorage.getValue(testData)).toEqual(testData);
  });

  it('should get saved data', () => {
    const browserStorage = new BrowserStorage('test');
    const testData = {
      codeKey: 'vim',
      theme: 'dark',
    };

    browserStorage.setValue(testData);
    expect(browserStorage.getValue({})).toEqual(testData);
  });
});
