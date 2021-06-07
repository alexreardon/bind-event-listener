import { expectTypeOf } from 'expect-type';
import { Binding } from '../../src';
import { Listener } from '../../src/types';

// correctly extracts event type from target
expectTypeOf<Binding<Window, 'beforeunload'>>().toEqualTypeOf<{
  type: 'beforeunload';
  listener: Listener<BeforeUnloadEvent, Window>;
  options?: boolean | AddEventListenerOptions;
}>();

// fallbacks to Event if handler isn't present on the target
expectTypeOf<Binding<Window, 'DOMContentLoaded'>>().toEqualTypeOf<{
  type: 'DOMContentLoaded';
  listener: Listener<Event, Window>;
  options?: boolean | AddEventListenerOptions;
}>();

// correctly works with union target
expectTypeOf<Binding<Window | Element, 'beforeunload'>>().toEqualTypeOf<{
  type: 'beforeunload';
  listener: Listener<Event | BeforeUnloadEvent, Window | Element>;
  options?: boolean | AddEventListenerOptions;
}>();

// correctly works with union type
expectTypeOf<Binding<Window, 'abort' | 'beforeunload'>>().toEqualTypeOf<{
  type: 'abort' | 'beforeunload';
  listener: Listener<UIEvent | BeforeUnloadEvent, Window>;
  options?: boolean | AddEventListenerOptions;
}>();

// correctly works with union target and type
expectTypeOf<Binding<Window | Element, 'abort' | 'beforeunload'>>().toEqualTypeOf<{
  type: 'abort' | 'beforeunload';
  listener: Listener<UIEvent | Event | BeforeUnloadEvent, Window | Element>;
  options?: boolean | AddEventListenerOptions;
}>();
