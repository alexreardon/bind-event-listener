export type UnbindFn = () => void;

type AnyFunction = (...args: any[]) => any;

// type TargetMap = {
//   [Window]: true
// }

type ExtractEventTypeFromHandler<MaybeFn extends unknown> = MaybeFn extends (
  this: any,
  event: infer MaybeEvent,
) => any
  ? MaybeEvent extends Event
    ? MaybeEvent
    : never
  : never;

type GetEventType<Target extends EventTarget, EventName extends string> =
  // case 1: does the target have a on${eventName} property?
  `on${EventName}` extends keyof Target
    ? ExtractEventTypeFromHandler<Target[`on${EventName}`]>
    : Event;

// case 3: is the `target` the `Document`?
// Target extends Document ? EventName extends keyof DocumentEventMap ? DocumentEventMap[EventName] : never : never
// : never;

// type GetEventType<Target extends EventTarget, Type extends string> = Target extends unknown
//   ? `on${Type}` extends keyof Target
//     ? GetEventTypeFromListener<
//         // remove types that aren't assignable to `AnyFunction`
//         // so that we don't end up with union like `MouseEvent | Event`
//         Extract<Target[`on${Type}`], AnyFunction>
//       >
//     : Event
//   : never;

// type GetEventTypeFromListener<Fn extends AnyFunction> = Fn extends (
//   this: any,
//   event: infer U,
// ) => any
//   ? U extends Event
//     ? U
//     : Event
//   : Event;

export type Binding<Target extends EventTarget = EventTarget, EventName extends string = string> = {
  type: EventName;
  listener: Listener<GetEventType<Target, EventName>, Target>;
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
  handleEvent(this: ListenerObject<TEvent>, e: TEvent): void;
};
