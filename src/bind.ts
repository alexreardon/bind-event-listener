import { UnbindFn, Binding } from './types';

export function bind({ target, type, listener: handler, options }: Binding): UnbindFn {
  target.addEventListener(type, handler, options);

  return function unbind() {
    target.removeEventListener(type, handler, options);
  };
}
