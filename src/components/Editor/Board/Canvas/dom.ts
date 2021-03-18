export function addEvent(el: EventTarget, type: string, fn: EventListener, capturing?: boolean) {
  return el.addEventListener(type, fn, capturing);
}

export function removeEvent(el: EventTarget, type: string, fn: EventListener, capturing?: boolean) {
  return el.removeEventListener(type, fn, capturing);
}
