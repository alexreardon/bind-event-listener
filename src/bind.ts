import { UnbindFn, Binding, PossibleEventType } from './types';

export function bind<Target extends EventTarget, Type extends PossibleEventType<keyof Target>>(
  target: Target,
  { type, listener, options }: Binding<Target, Type>,
): UnbindFn;
export function bind(target: EventTarget, { type, listener, options }: Binding) {
  target.addEventListener(type, listener, options);

  return function unbind() {
    target.removeEventListener(type, listener, options);
  };
}
