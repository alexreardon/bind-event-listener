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

export function bindAll<Target extends EventTarget, Type extends string>(
  target: Target,
  bindings: [Binding<Target, Type>],
  sharedOptions?: boolean | AddEventListenerOptions,
): UnbindFn;
export function bindAll<Target extends EventTarget, Type1 extends string, Type2 extends string>(
  target: Target,
  bindings: [Binding<Target, Type1>, Binding<Target, Type2>],
  sharedOptions?: boolean | AddEventListenerOptions,
): UnbindFn;
export function bindAll<
  Target extends EventTarget,
  Type1 extends string,
  Type2 extends string,
  Type3 extends string,
>(
  target: Target,
  bindings: [Binding<Target, Type1>, Binding<Target, Type2>, Binding<Target, Type3>],
  sharedOptions?: boolean | AddEventListenerOptions,
): UnbindFn;
export function bindAll<
  Target extends EventTarget,
  Type1 extends string,
  Type2 extends string,
  Type3 extends string,
  Type4 extends string,
>(
  target: Target,
  bindings: [
    Binding<Target, Type1>,
    Binding<Target, Type2>,
    Binding<Target, Type3>,
    Binding<Target, Type4>,
  ],
  sharedOptions?: boolean | AddEventListenerOptions,
): UnbindFn;
export function bindAll<
  Target extends EventTarget,
  Type1 extends string,
  Type2 extends string,
  Type3 extends string,
  Type4 extends string,
  Type5 extends string,
>(
  target: Target,
  bindings: [
    Binding<Target, Type1>,
    Binding<Target, Type2>,
    Binding<Target, Type3>,
    Binding<Target, Type4>,
    Binding<Target, Type5>,
  ],
  sharedOptions?: boolean | AddEventListenerOptions,
): UnbindFn;
export function bindAll<
  Target extends EventTarget,
  Type1 extends string,
  Type2 extends string,
  Type3 extends string,
  Type4 extends string,
  Type5 extends string,
  Type6 extends string,
>(
  target: Target,
  bindings: [
    Binding<Target, Type1>,
    Binding<Target, Type2>,
    Binding<Target, Type3>,
    Binding<Target, Type4>,
    Binding<Target, Type5>,
    Binding<Target, Type6>,
  ],
  sharedOptions?: boolean | AddEventListenerOptions,
): UnbindFn;
export function bindAll(
  target: EventTarget,
  bindings: Binding[],
  sharedOptions?: boolean | AddEventListenerOptions,
): UnbindFn;
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
    unbinds.forEach((unbind) => unbind());
  };
}
