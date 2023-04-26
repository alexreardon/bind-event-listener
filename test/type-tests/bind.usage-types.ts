import { bind } from '../../src';

// inline definitions
{
  const button: HTMLElement = document.createElement('button');

  bind(button, {
    type: 'click',
    listener(event: MouseEvent) {},
  });
}

// inferred types
{
  const button: HTMLElement = document.createElement('button');

  bind(button, {
    type: 'click',
    listener(event) {
      const value: number = event.button;
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

// provided generics
{
  const button: HTMLElement = document.createElement('button');

  bind<HTMLElement, 'click'>(button, {
    type: 'click',
    listener: function (event) {},
  });
}

// incorrect event name
{
  const button: HTMLElement = document.createElement('button');

  bind<HTMLElement, 'keydown'>(button, {
    // @ts-expect-error - should be 'keydown'
    type: 'click',
    listener: function (event) {},
  });
}

// incorrect target type
{
  const button: HTMLElement = document.createElement('button');

  // @ts-expect-error - should be HTMLElement
  bind<SVGElement, 'click'>(button, {
    type: 'click',
    listener: function (event) {},
  });
}
