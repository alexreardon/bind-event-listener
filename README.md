# bind-event-listener

[![npm](https://img.shields.io/npm/v/bind-event-listener.svg)](https://www.npmjs.com/package/bind-event-listener)
![types](https://img.shields.io/badge/types-typescript-blueviolet)

> A utility to make binding and (**especially**) unbinding DOM events easier.
> I seem to write this again with every new project, so I made it a library

```ts
import { bind, UnbindFn } from 'bind-event-listener';

const unbind: UnbindFn = bind(button, {
  type: 'click',
  listener: onClick,
});

// when you are all done:
unbind();
```

```ts
import { bindAll } from 'bind-event-listener';

const unbind = bind(button, [
  {
    type: 'click',
    listener: onClick,
    options: { capture: true },
  },
  {
    type: 'mouseover',
    listener: onMouseOver,
  },
]);

// when you are all done:
unbind();
```

## Rationale

When using `addEventListener()`, **correctly unbinding** events with `removeEventListener()` can be tricky.

1. You need to remember to call `removeEventListener` (it can be easy to forget!)

<details>
<summary>Example</summary>

```ts
target.addEventListener('click', onClick, options);

// You need to remember to call removeEventListener to unbind the event
target.removeEventListener('click', onClick, options);
```

</details>

2. You need to pass in the same listener _reference_ to `removeEventListener`

<details>
<summary>Example</summary>

```ts
target.addEventListener(
  'click',
  function onClick() {
    console.log('clicked');
  },
  options,
);

// Even those the functions look the same, they don't have the same reference.
// The original onClick is not unbound!
target.removeEventListener(
  'click',
  function onClick() {
    console.log('clicked');
  },
  options,
);
```

```ts
// Inline arrow functions can never be unbound because you have lost the reference!
target.addEventListener('click', () => console.log('i will never unbind'), options);
target.removeEventListener('click', () => console.log('i will never unbind'), options);
```

</details>

3. You need to pass in the same `capture` value option

<details>
<summary>Example</summary>

```ts
// add a listener: AddEventListenerOptions format
target.addEventListener('click', onClick, { capture: true });

// not unbound: no capture value
target.removeEventListener('click', onClick);

// not unbound: different capture value
target.removeEventListener('click', onClick, { capture: false });

// successfully unbound: same capture value
target.removeEventListener('click', onClick, { capture: true });
// this would also unbind (different notation)
target.removeEventListener('click', onClick, true /* shorthand for { capture: true } */);
```

```ts
// add a listener: boolean capture format
target.addEventListener('click', onClick, true /* shorthand for { capture: true } */);

// not unbound: no capture value
target.addEventListener('click', onClick);
// not unbound: different capture value
target.addEventListener('click', onClick, false);

// successfully unbound: same capture value
target.addEventListener('click', onClick, true);
// this would also unbind (different notation)
target.addEventListener('click', onClick, { capture: true });
```

</details>

**`bind-event-listener` solves these problems**

1. When you bind an event (or events with `bindAll`) you get back a simple `unbind` function
2. The unbind function ensures the same listener _reference_ is passed to `removeEventListener`
3. The unbind function ensures that whatever `capture` value is used with `addEventListener` is used with `removeEventListener`

## Usage

### `bind`: basic

```ts
import { bind, UnbindFn } from 'bind-event-listener';

const unbind: UnbindFn = bind(button, {
  type: 'click',
  listener: onClick,
});

// when your are all done:
unbind();
```

### `bind`: with options

```ts
import { bind } from 'bind-event-listener';

const unbind = bind(button, {
  type: 'click',
  listener: onClick,
  options: { capture: true, passive: false },
});

// when you are all done:
unbind();
```

### `bindAll`: basic

```ts
import { bindAll } from 'bind-event-listener';

const unbind = bindAll(button, [
  {
    type: 'click',
    listener: onClick,
  },
]);

// when you are all done:
unbind();
```

### `bindAll`: with options

```ts
import { bindAll } from 'bind-event-listener';

const unbind = bindAll(button, [
  {
    type: 'click',
    listener: onClick,
    options: { passive: true },
  },
  // default options that are applied to all bindings
  { capture: false },
]);

// when you are all done:
unbind();
```

When using `defaultOptions` for `bindAll`, the `defaultOptions` are merged with the `options` on each binding. Options on the individual bindings will take precedent. You can think of it like this:

```ts
const merged: AddEventListenerOptions = {
  ...defaultOptions,
  ...options,
};
```

> Note: it is a little bit more complicated than just object spreading as the library will also behave correctly when passing in a `boolean` capture argument. An options value can be a boolean `{ options: true }` which is shorthand for `{ options: {capture: true } }`

## Recipe: [`react`](https://reactjs.org/) effect

You can return a [cleanup function](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect) from [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) (or [`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)). `bind-event-listener` makes this super convenient because you can just return the unbind function from your effect.

```ts
import React, { useState, useEffect } from 'react';
import { bind } from 'bind-event-listener';

export default function App() {
  const [clickCount, onClick] = useState(0);

  useEffect(() => {
    const unbind = bind(window, {
      type: 'click',
      listener: () => onClick((value) => value + 1),
    });

    return unbind;
  }, []);

  return <div>Window clicks: {clickCount}</div>;
}
```

> You can play with this [example on codesandbox](https://codesandbox.io/s/bind-event-listener-useeffect-mnfi3)

## Types

```ts
function bind(target: EventTarget, binding: Binding): UnbindFn;

function bindAll(
  target: EventTarget,
  bindings: Binding[],
  // AddEventListenerOptions is a built in TypeScript type
  sharedOptions?: boolean | AddEventListenerOptions,
): UnbindFn;

type Binding = {
  type: string;
  // EventListenerOrEventListenerObject is a built in TypeScript type
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
};

type UnbindFn = () => void;
```

> Typescript built in DOM types: [raw view](https://raw.githubusercontent.com/microsoft/TypeScript/master/lib/lib.dom.d.ts), [pretty view](https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts) (warning: pretty view seems to crash Github!)

## Cheers 👋

Brought to you by [@alexandereardon](https://twitter.com/alexandereardon)
