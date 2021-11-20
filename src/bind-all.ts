import { bind } from './bind';
import { BindAll, BindingOptions } from './types';

export const bindAll: BindAll = (target, bindings, _defaultOptions) => {
  let unbinds = [] as (() => void)[];
  let defaultOptions = normalizedOptions(_defaultOptions);

  for (let { type, listener, options: _options } of bindings) {
    unbinds.push(bind(target, {
      type, listener,
      options: { ...defaultOptions, ...normalizedOptions(_options) }
    }));
  }

  return () => unbinds.forEach(f => f());
}

const normalizedOptions = (options: BindingOptions): Extract<BindingOptions, object> =>
  typeof options === "undefined" ? {} :
  typeof options === "boolean" ? { capture: options } :
  options