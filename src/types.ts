export type UnbindFn = () => void;

export type Binding = {
  target: Element;
  type: string;
  handler: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
};
