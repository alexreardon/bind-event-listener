import { UnbindFn, Binding } from './types';

export function bind(target: Element, { type, listener, options }: Binding): UnbindFn {
  target.addEventListener(type, listener, options);

  return function unbind() {
    target.removeEventListener(type, listener, options);
  };
}
