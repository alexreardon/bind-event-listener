import { bind } from '../../src';
import { expectTypeOf } from 'expect-type';

// inline definitions
{
  const button: HTMLElement = document.createElement('button');

  bind(button, {
    type: 'click',
    listener(event: MouseEvent) {},
  });
}

// inline definitions (inferred)
{
  const button: HTMLElement = document.createElement('button');

  bind(button, {
    type: 'keydown',
    listener(event) {
      expectTypeOf(event).toEqualTypeOf<KeyboardEvent>();
    },
  });
}

// inline definitions (inferred + no concrete event type)
{
  const button: HTMLElement = document.createElement('button');

  bind(button, {
    type: 'hello',
    listener(event) {
      expectTypeOf(event).toEqualTypeOf<Event>();
    },
  });
}

// inferred types
{
  const button: HTMLElement = document.createElement('button');

  bind(button, {
    type: 'click',
    listener(event) {
      expectTypeOf(event).toEqualTypeOf<MouseEvent>();
    },
  });
}

// hoisted definitions
{
  const button: HTMLElement = document.createElement('button');

  function listener(event: MouseEvent) {}

  bind(button, {
    type: 'click',
    listener: listener,
  });
}

// hoisted incorrect definitions
{
  const button: HTMLElement = document.createElement('button');

  function listener(event: KeyboardEvent) {}

  bind(button, {
    type: 'click',
    // @ts-expect-error
    listener: listener,
  });
}
