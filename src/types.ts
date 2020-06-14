export type UnbindFn = () => void;
export type Binding = { target: Element, type: keyof HTMLElementEventMap, handler: (this: Element, event: Event) => any, options?: EventListenerOptions };