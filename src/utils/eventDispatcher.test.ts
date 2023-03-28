import { describe, it, expect, vi } from 'vitest';
import EventDispatcher from './eventDispatcher';

describe('EventDispatcher', () => {
  it('should emit event', () => {
    const eventDispatcher = new EventDispatcher();

    const handler = vi.fn();

    eventDispatcher.addEventListener('bar', handler);
    eventDispatcher.emit('bar');

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should emit event width multiple handlers', () => {
    const eventDispatcher = new EventDispatcher();

    const handler1 = vi.fn();
    const handler2 = vi.fn();

    eventDispatcher.addEventListener('bar', handler1);
    eventDispatcher.addEventListener('bar', handler2);
    eventDispatcher.emit('bar');

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener by handler', () => {
    const eventDispatcher = new EventDispatcher();

    const handler = vi.fn();

    eventDispatcher.addEventListener('bar', handler);
    eventDispatcher.removeEventListener('bar', handler);
    eventDispatcher.emit('bar');

    expect(handler).toHaveBeenCalledTimes(0);
  });

  it('should remove event listener by name', () => {
    const eventDispatcher = new EventDispatcher();

    const handler = vi.fn();

    eventDispatcher.addEventListener('bar', handler);
    eventDispatcher.removeEventListener('bar');
    eventDispatcher.emit('bar');

    expect(handler).toHaveBeenCalledTimes(0);
  });
});
