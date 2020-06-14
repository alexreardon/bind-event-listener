export type UnbindFn = () => void;

export type Binding = {
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
};
