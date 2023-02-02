import { expectTypeOf } from 'expect-type';
import { Binding, Listener } from '../../src';
import { expectType, TypeOf } from 'ts-expect';

// This is how you can 'teach' TS about your custom event
declare global {
  interface HTMLElement {
    'onmy-custom-registered-event': CustomEvent<{ foo: number }>;
  }
}

// extracting event type
{
  // correctly extracts event type from target (HTMLElement)
  expectTypeOf<Binding<HTMLElement, 'click'>>().toEqualTypeOf<{
    type: 'click';
    listener: Listener<HTMLElement, 'click'>;
    options?: boolean | AddEventListenerOptions;
  }>();

  type ClickListener = Listener<HTMLElement, 'click'>;

  // `this` and `event` are set correctly
  expectType<TypeOf<ClickListener, (this: HTMLElement, e: MouseEvent) => void>>(true);

  // okay to use a more generic `event` type
  expectType<TypeOf<ClickListener, (this: HTMLElement, e: Event) => void>>(true);
  expectType<TypeOf<ClickListener, (this: HTMLElement, e: UIEvent) => void>>(true);
  expectType<TypeOf<ClickListener, (this: HTMLElement, e: unknown) => void>>(true);
  expectType<TypeOf<ClickListener, (this: HTMLElement, e: any) => void>>(true);

  // okay to use more generic `this` type
  expectType<TypeOf<ClickListener, (this: EventTarget, e: MouseEvent) => void>>(true);
  expectType<TypeOf<ClickListener, (this: unknown, e: MouseEvent) => void>>(true);
  expectType<TypeOf<ClickListener, (this: any, e: MouseEvent) => void>>(true);

  // not okay to use the wrong `this` type
  expectType<TypeOf<ClickListener, (this: Window, e: MouseEvent) => void>>(false);

  // not okay to use the wrong `event` type
  expectType<TypeOf<ClickListener, (this: HTMLElement, e: AnimationEvent) => void>>(false);
}

// extracting event types from the `window`
{
  // correctly extracts event type from target (Window)
  expectTypeOf<Binding<Window, 'click'>>().toEqualTypeOf<{
    type: 'click';
    listener: Listener<Window, 'click'>;
    options?: boolean | AddEventListenerOptions;
  }>();

  type ClickListener = Listener<Window, 'click'>;

  // `this` and `event` are set correctly
  expectType<TypeOf<ClickListener, (this: Window, e: MouseEvent) => void>>(true);

  // okay to use a more generic `event` type
  expectType<TypeOf<ClickListener, (this: Window, e: Event) => void>>(true);
  expectType<TypeOf<ClickListener, (this: Window, e: UIEvent) => void>>(true);
  expectType<TypeOf<ClickListener, (this: Window, e: unknown) => void>>(true);
  expectType<TypeOf<ClickListener, (this: Window, e: any) => void>>(true);

  // okay to use more generic `this` type
  expectType<TypeOf<ClickListener, (this: EventTarget, e: MouseEvent) => void>>(true);
  expectType<TypeOf<ClickListener, (this: unknown, e: MouseEvent) => void>>(true);
  expectType<TypeOf<ClickListener, (this: any, e: MouseEvent) => void>>(true);

  // not okay to use the wrong `this` type
  expectType<TypeOf<ClickListener, (this: HTMLElement, e: MouseEvent) => void>>(false);

  // not okay to use the wrong `event` type
  expectType<TypeOf<ClickListener, (this: Window, e: AnimationEvent) => void>>(false);
}

// fallbacks for when there is no `on${EventName}` property
{
  expectTypeOf<Binding<Window, 'DOMContentLoaded'>>().toEqualTypeOf<{
    type: 'DOMContentLoaded';
    listener: Listener<Window, 'DOMContentLoaded'>;
    options?: boolean | AddEventListenerOptions;
  }>();

  // fallback to `Event` if handler isn't present on the target
  expectType<TypeOf<Listener<Window, 'DOMContentLoaded'>, (this: Window, e: Event) => void>>(true);

  // cannot fall back to some other event type
  expectType<TypeOf<Listener<Window, 'DOMContentLoaded'>, (this: Window, e: UIEvent) => void>>(
    false,
  );
}

// custom events
{
  expectTypeOf<Binding<HTMLElement, 'my-custom-event'>>().toEqualTypeOf<{
    type: 'my-custom-event';
    listener: Listener<HTMLElement, 'my-custom-event'>;
    options?: boolean | AddEventListenerOptions;
  }>();

  // event is cast as `Event` (how can we know it is a custom event!?)
  expectType<
    TypeOf<Listener<HTMLElement, 'my-custom-event'>, (this: HTMLElement, e: Event) => void>
  >(true);
  // Cannot safely cast to `CustomEvent` as we don't know what the custom events are!!
  expectType<
    TypeOf<Listener<HTMLElement, 'my-custom-event'>, (this: HTMLElement, e: CustomEvent) => void>
  >(false);
  // Cannot cast to `CustomEvent` as we don't know what the custom events are!!

  expectType<
    TypeOf<
      Listener<HTMLElement, 'my-custom-registered-event'>,
      (this: HTMLElement, e: CustomEvent<{ foo: number }>) => void
    >
  >(true);
}

// The `Binding` type should allow EventTarget unions
// No idea why we want this, but it exists 🙈
{
  // correctly works with union target
  expectTypeOf<Binding<Window | HTMLElement, 'beforeunload'>>().toEqualTypeOf<{
    type: 'beforeunload';
    listener: Listener<Window | HTMLElement, 'beforeunload'>;
    options?: boolean | AddEventListenerOptions;
  }>();

  expectType<
    TypeOf<
      Listener<Window | HTMLElement, 'beforeunload'>,
      (this: Window | HTMLElement, e: BeforeUnloadEvent) => void
    >
  >(true);

  expectType<
    TypeOf<
      Listener<Window | HTMLElement, 'beforeunload'>,
      (this: Window | HTMLElement, e: AnimationEvent) => void
    >
  >(false);
}

// The `Binding` type should allow EventName unions
// No idea why we want this, but it exists 🙈
{
  // correctly works with union target

  type OurListener = Listener<Window | HTMLElement, 'keydown' | 'click'>;

  expectTypeOf<Binding<Window | HTMLElement, 'keydown' | 'click'>>().toEqualTypeOf<{
    type: 'keydown' | 'click';
    listener: OurListener;
    options?: boolean | AddEventListenerOptions;
  }>();

  expectType<TypeOf<OurListener, (this: Window | Element, e: KeyboardEvent | MouseEvent) => void>>(
    true,
  );

  // too narrow
  expectType<TypeOf<OurListener, (this: Window | Element, e: MouseEvent) => void>>(false);
}
