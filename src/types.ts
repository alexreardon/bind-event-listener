export type UnbindFn = () => void;

type Listener<Ev extends Event> = (e: Ev) => void;
type ListenerObject<Ev extends Event> = { handleEvent(e: Ev): void };

export type Binding<Type extends string = string, Ev extends Event = Event> = {
  type: Type;
  listener: Listener<Ev> | ListenerObject<Ev>;
  options?: boolean | AddEventListenerOptions;
};
