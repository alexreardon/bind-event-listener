export type UnbindFn = () => void;

type UnknownFunction = (...args: any[]) => any;

export type InferEventType<TTarget> = TTarget extends {
  // we infer from 2 overloads which are super common for event targets in the DOM lib
  // we "prioritize" the first one as the first one is always more specific
  addEventListener(type: infer P, ...args: any): void;
  // we can ignore the second one as it's usually just a fallback that allows bare `string` here
  // we use `infer P2` over `any` as we really don't care about this type value
  // and we don't want to accidentally fail a type assignability check, remember that `any` isn't assignable to `never`
  addEventListener(type: infer P2, ...args: any): void;
}
  ? P
  : never;

export type InferEvent<TTarget, TType extends string> =
  // we check if the inferred Type is the same as its defined constraint
  // if it's the same then we've failed to infer concrete value
  // it means that a string outside of the autocompletable values has been used
  // we'll be able to drop this check when https://github.com/microsoft/TypeScript/pull/51770 gets released in TS 5.0
  InferEventType<TTarget> extends TType
    ? Event
    : `on${TType}` extends keyof TTarget
    ? Parameters<Extract<TTarget[`on${TType}`], UnknownFunction>>[0]
    : Event;

// For listener objects, the handleEvent function has the object as the `this` binding
type ListenerObject<TEvent extends Event> = {
  handleEvent(this: ListenerObject<TEvent>, event: TEvent): void;
};

// event listeners can be an object or a function
export type Listener<TTarget extends EventTarget, TType extends string = string> =
  | ListenerObject<InferEvent<TTarget, TType>>
  | { (this: TTarget, ev: InferEvent<TTarget, TType>): void };

export type Binding<TTarget extends EventTarget = EventTarget, TType extends string = string> = {
  type: TType;
  listener: Listener<TTarget, TType>;
  options?: boolean | AddEventListenerOptions;
};
