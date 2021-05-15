export type UnbindFn = () => void;

type Listener<Ev extends Event> = { handleEvent(e: Ev): void } | ((e: Ev) => void);

export type Binding<Type extends string = string, Ev extends Event = Event> = {
  type: Type;
  listener: Listener<Ev>;
  options?: boolean | AddEventListenerOptions;
};
