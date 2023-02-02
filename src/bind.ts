import { UnbindFn, InferEventType, InferEvent, Listener } from './types';

export function bind<
  TTarget extends EventTarget,
  TType extends InferEventType<TTarget> | (string & {}),
>(
  target: TTarget,
  // binding: Binding<
  //   TTarget,
  //   // `| (string & {})` should be moved to the Type's constraint
  //   // however, doing that today breaks autocompletion
  //   // this is being by https://github.com/microsoft/TypeScript/pull/51770 but we need wait for its release in TS 5.0
  //   TType | (string & {})
  // >

  // this "inline" variant works better when it comes to limiting `InferEvent` to using the `TType` from the "outer scope" (bind's and not Binding's)
  // we can still export Binding and it could be used by people if they with to. To aid inference we can keep this inline within `bind`'s signature
  // most likely we'll be able to refactor this when https://github.com/microsoft/TypeScript/pull/51770 gets released in TS 5.0
  {
    type,
    listener,
    options,
  }: {
    type: TType;
    listener: Listener<TTarget, InferEvent<TTarget, TType>>;
    options?: boolean | AddEventListenerOptions;
  },
): UnbindFn {
  target.addEventListener(type, listener, options);

  return function unbind() {
    target.removeEventListener(type, listener, options);
  };
}
