import { expectTypeOf } from 'expect-type';
import { bindAll } from '../../src';

// inline definitions
{
  const button: HTMLElement = document.createElement('button');

  bindAll(button, [
    {
      type: 'click',
      listener(event: MouseEvent) {},
    },
    {
      type: 'keydown',
      listener(event: KeyboardEvent) {},
    },
  ]);
}

// inferred types
{
  const button: HTMLElement = document.createElement('button');

  bindAll(button, [
    {
      type: 'click',
      listener(event) {
        expectTypeOf(event).toEqualTypeOf<MouseEvent>();
      },
    },
    {
      type: 'keydown',
      listener(event) {
        expectTypeOf(event).toEqualTypeOf<KeyboardEvent>();
      },
    },
  ]);
}

// hoisted definitions
{
  const button: HTMLElement = document.createElement('button');

  function click(event: MouseEvent) {}
  function keydown(event: KeyboardEvent) {}

  bindAll(button, [
    {
      type: 'click',
      listener: click,
    },
    {
      type: 'keydown',
      listener: keydown,
    },
  ]);
}

// hoisted incorrect definitions
{
  const button: HTMLElement = document.createElement('button');

  function listener(event: KeyboardEvent) {}

  bindAll(button, [
    {
      type: 'click',
      // @ts-expect-error
      listener: listener,
    },
  ]);
}
