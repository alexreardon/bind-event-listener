export type UnbindFn = () => void;

export type Binding = {
  target: Element;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
};
