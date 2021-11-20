import { Bind } from './types';

export const bind: Bind = (target, { type, listener, options }) => {
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}