import { DataStorage } from './type';
import { Menu, MenuKey } from '../../../reducers/settingReducer';

const SETTING_KEY = '$$codepair$$setting';

class SettingModel implements DataStorage<Menu> {
  storage: Storage;

  private constructor() {
    this.storage = window.localStorage;
  }

  static create() {
    return new SettingModel();
  }

  getValue(key?: keyof Menu): Menu | string | void {
    try {
      const menu = JSON.parse(this.storage[SETTING_KEY]) as Menu;
      if (key === undefined) {
        return menu;
      }

      if (!(key in menu)) {
        return;
      }

      return menu[key];
    } catch {
      return;
    }
  }

  setValue(key: MenuKey, value: string) {
    const menu = (this.getValue() || {}) as Partial<Menu>;
    menu[key] = value;
    this.storage[SETTING_KEY] = JSON.stringify(menu);
  }
}

export default SettingModel.create();
