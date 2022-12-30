export type UnbindFn = () => void;

type AnyFunction = (...args: any[]) => any;

export type InferEventType<TTarget> = TTarget extends {
  addEventListener(type: infer P, ...args: any): void;
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
    ? Parameters<Extract<TTarget[`on${TType}`], AnyFunction>>[0]
    : Event;

export type Listener<TTarget extends EventTarget, TEvent extends Event> =
  | { (this: TTarget, ev: TEvent): void }
  | ListenerObject<TEvent>;

interface ListenerObject<TEvent extends Event> {
  // For listener objects, the handleEvent function has the object as the `this` binding
  handleEvent(this: ListenerObject<TEvent>, event: TEvent): void;
}

export interface Binding<TTarget extends EventTarget = EventTarget, TType extends string = string> {
  type: TType;
  listener: Listener<TTarget, InferEvent<TTarget, TType>>;
  options?: boolean | AddEventListenerOptions;
}
