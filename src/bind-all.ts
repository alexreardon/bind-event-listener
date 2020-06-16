import { Binding, UnbindFn } from './types';
import { bind } from './bind';

function toOptions(value?: boolean | AddEventListenerOptions): AddEventListenerOptions | undefined {
  if (typeof value === 'undefined') {
    return undefined;
  }

  // Convert capture boolean format to options to object
  if (typeof value === 'boolean') {
    return {
      capture: value,
    };
  }

  // Already an object, don't need to convert it
  return value;
}

function getBinding(original: Binding, sharedOptions?: boolean | AddEventListenerOptions): Binding {
  // No shared options, just return original binding
  if (sharedOptions == null) {
    return original;
  }

  const binding: Binding = {
    ...original,
    // Converting both options to object format for merging
    options: {
      ...toOptions(sharedOptions),
      // Giving individual binding option precedence
      ...toOptions(original.options),
    },
  };
  return binding;
}

export function bindAll(
  target: EventTarget,
  bindings: Binding[],
  sharedOptions?: boolean | AddEventListenerOptions,
): UnbindFn {
  const unbinds: UnbindFn[] = bindings.map((original: Binding) => {
    const binding: Binding = getBinding(original, sharedOptions);
    return bind(target, binding);
  });

  return function unbindAll() {
    unbinds.forEach((unbind: UnbindFn) => unbind());
  };
}
