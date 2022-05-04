export type UnbindFn = () => void;

type ExtractEventTypeFromHandler<MaybeFn extends unknown> = MaybeFn extends (
  this: any,
  event: infer MaybeEvent,
) => any
  ? MaybeEvent extends Event
    ? MaybeEvent
    : Event
  : never;

type GetEventType<Target extends EventTarget, EventName extends string> =
  // Does the target have a on${eventName} property?
  `on${EventName}` extends keyof Target
    ? ExtractEventTypeFromHandler<Target[`on${EventName}`]>
    : Event;

export type Binding<Target extends EventTarget = EventTarget, EventName extends string = string> = {
  type: EventName;
  listener: Listener<Target, EventName>;
  options?: boolean | AddEventListenerOptions;
};

export type Listener<Target extends EventTarget, EventName extends string> =
  | ListenerObject<GetEventType<Target, EventName>>
  | { (this: Target, e: GetEventType<Target, EventName>): void };

export type ListenerObject<TEvent extends Event> = {
  // For listener objects, the handleEvent function has the object as the `this` binding
  handleEvent(this: ListenerObject<TEvent>, e: TEvent): void;
};
