export { bind } from './bind';
export { bindAll } from './bind-all';
export { BindingOf, Binding, EventMap, TypesOptions } from './types';

/** @deprecated use `() => void` instead, will be removed in next major version */
export type UnbindFn = () => void