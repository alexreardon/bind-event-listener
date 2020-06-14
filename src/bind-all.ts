import { Binding, UnbindFn } from './types';
import { bind } from './bind';

export function bindAll(bindings: Binding[]): UnbindFn {
  // TODO: what about this binding of the binding
  const unbinds: UnbindFn[] = bindings.map((binding: Binding) => bind(binding));

  return function unbindAll() {
    unbinds.forEach((unbind: UnbindFn) => unbind());
  };
}
