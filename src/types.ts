export type UnbindFn = () => void;

type AnyFunction = (...args: any[]) => any;

type GetEventType<Target extends EventTarget, Type extends string> = Target extends unknown
  ? `on${Type}` extends keyof Target
    ? GetEventTypeFromListener<
        // remove types that aren't assignable to `AnyFunction`
        // so that we don't end up with union like `MouseEvent | Event`
        Extract<Target[`on${Type}`], AnyFunction>
      >
    : Event
  : never;

type GetEventTypeFromListener<T extends AnyFunction> = T extends (this: any, event: infer U) => any
  ? U extends Event
    ? U
    : Event
  : Event;

export type Binding<Target extends EventTarget = EventTarget, Type extends string = string> = {
  type: Type;
  listener: Listener<GetEventType<Target, Type>>;
  options?: boolean | AddEventListenerOptions;
};

export type Listener<Ev extends Event> =
  | { handleEvent(e: Ev): void }
  // using bivariance hack here so if the user
  // wants to narrow event type by hand TS
  // won't give him an error
  | { bivarianceHack(e: Ev): void }['bivarianceHack'];
