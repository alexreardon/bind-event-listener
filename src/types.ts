export type UnbindFn = () => void;

type AnyFunction = (...args: any[]) => any;

type GetEventType<Target extends EventTarget, EventType extends string> = Target extends unknown
  ? `on${EventType}` extends keyof Target
    ? GetEventTypeFromListener<
        // remove types that aren't assignable to `AnyFunction`
        // so that we don't end up with union like `MouseEvent | Event`
        Extract<Target[`on${EventType}`], AnyFunction>
      >
    : Event
  : never;

type GetEventTypeFromListener<TFunction extends AnyFunction> = TFunction extends (
  this: any,
  event: infer TReturn,
) => any
  ? TReturn extends Event
    ? TReturn
    : Event
  : Event;

export type Binding<Target extends EventTarget = EventTarget, Type extends string = string> = {
  type: Type;
  listener: Listener<GetEventType<Target, Type>, Target>;
  options?: boolean | AddEventListenerOptions;
};

export type Listener<TEvent extends Event, Target extends EventTarget> =
  | ListenerObject<TEvent>
  // For a listener function, the `this` binding is the target the event listener is added to
  // using bivariance hack here so if the user
  // wants to narrow event type by hand TS
  // won't give them an error
  | { bivarianceHack(this: Target, e: TEvent): void }['bivarianceHack'];

type ListenerObject<TEvent extends Event> = {
  // For listener objects, the handleEvent function has the object as the `this` binding
  handleEvent(this: ListenerObject<TEvent>, Ee: TEvent): void;
};
