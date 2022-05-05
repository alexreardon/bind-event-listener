export type UnbindFn = () => void;

type ExtractEventTypeFromHandler<MaybeFn extends unknown> = MaybeFn extends (
  this: any,
  event: infer MaybeEvent,
) => any
  ? MaybeEvent extends Event
    ? MaybeEvent
    : Event
  : never;

// Given an EventTarget and an EventName - return the event type (eg `MouseEvent`)
// Rather than switching on every time of EventTarget and looking up the appropriate `EventMap`
// We are being sneaky an pulling the type out of any `on${EventName}` property
// This is surprisingly robust
type GetEventType<
  Target extends EventTarget,
  EventName extends string,
> = `on${EventName}` extends keyof Target
  ? ExtractEventTypeFromHandler<Target[`on${EventName}`]>
  : Event;

// For listener objects, the handleEvent function has the object as the `this` binding
type ListenerObject<TEvent extends Event> = {
  handleEvent(this: ListenerObject<TEvent>, e: TEvent): void;
};

// event listeners can be an object or a function
export type Listener<Target extends EventTarget, EventName extends string> =
  | ListenerObject<GetEventType<Target, EventName>>
  | { (this: Target, e: GetEventType<Target, EventName>): void };

export type Binding<Target extends EventTarget = EventTarget, EventName extends string = string> = {
  type: EventName;
  listener: Listener<Target, EventName>;
  options?: boolean | AddEventListenerOptions;
};
