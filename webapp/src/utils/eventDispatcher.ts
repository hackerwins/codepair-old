/* eslint-disable max-classes-per-file */
class Event {
  private name: string;

  callbacks: Array<Function>;

  constructor(name: string) {
    this.name = name;
    this.callbacks = [];
  }

  on(cb: Function) {
    this.callbacks.push(cb);
  }

  off(cb: Function) {
    const idx = this.callbacks.findIndex((callback) => callback === cb);
    this.callbacks.splice(idx, 1);
  }

  toString() {
    return this.name;
  }
}

export default class EventDispatcher {
  events: { [name: string]: Event };

  constructor() {
    this.events = {};
  }

  emit(name: string, ...args: Array<unknown>) {
    if (!this.events[name]) {
      return;
    }

    this.events[name].callbacks.forEach((cb) => {
      cb(...args);
    });
  }

  addEventListener(name: string, cb: Function): void {
    if (!this.events[name]) {
      this.events[name] = new Event(name);
    }

    this.events[name].on(cb);
  }

  removeEventListener(name: string, cb?: Function) {
    if (!cb) {
      delete this.events[name];
      return;
    }

    this.events[name].off(cb);
  }
}
