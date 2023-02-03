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
        const value: number = event.button;
      },
    },
    {
      type: 'keydown',
      listener(event) {
        const value: string = event.key;
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
