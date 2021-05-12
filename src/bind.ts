import { UnbindFn, Binding } from './types';

// ========================
// solution 1 (required TS 4.1)
// ========================
interface AnyFunction {
  (...args: any[]): any;
}

type GetEventTypeFromListener<T extends AnyFunction> = T extends (this: any, event: infer U) => any
  ? U extends Event
    ? U
    : Event
  : Event;

type GetEventType<Target extends EventTarget, Type extends string> =
  `on${Type}` extends keyof Target
    ? GetEventTypeFromListener<Extract<Target[`on${Type}`], AnyFunction>>
    : Event;

export function bind<Target extends EventTarget, Type extends string>(
  target: Target,
  { type, listener, options }: Binding<Type, GetEventType<Target, Type>>,
): UnbindFn;
export function bind(target: EventTarget, { type, listener, options }: Binding): UnbindFn {
  target.addEventListener(type, listener, options);

  return function unbind() {
    target.removeEventListener(type, listener, options);
  };
}
