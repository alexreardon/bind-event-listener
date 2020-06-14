# bind-event-listener

[![npm](https://img.shields.io/npm/v/bind-event-listener.svg)](https://www.npmjs.com/package/bind-event-listener)
![types](https://img.shields.io/badge/types-typescript-blueviolet)
[![dependencies](https://david-dm.org/alexreardon/bind-event-listener.svg)](https://david-dm.org/alexreardon/bind-event-listener)
[![minzip](https://img.shields.io/bundlephobia/minzip/bind-event-listener.svg)](https://www.npmjs.com/package/bind-event-listener)

> A utility to make using `addEventListener` easier. I seem to write this again with every new project, so I made it a library

```ts
import { bind } from 'bind-event-listener';

const unbind = bind(button, {
  type: 'click',
  listener: onClick,
});

// when your are all done:
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

// when your are all done:
unbind();
```

## Rationale

When using `addEventListener()` you need to remember to manually call `removeEventListener()` correctly in order to unbind the event.

```ts
target.addEventListener('click', onClick, options);

// You need to remember to call removeEventListener to unbind the event
target.removeEventListener('click', onClick, options);
```

You need to pass in the same listener _reference_ (`onClick`), otherwise the original function will not unbind.

```ts
target.addEventListener(
  'click',
  function onClick() {
    console.log('clicked');
  },
  options,
);

// This will not unbind as you have not passed in the same 'onClick' function reference
target.removeEventListener(
  'click',
  function onClick() {
    console.log('clicked');
  },
  options,
);
```

This means you can also never unbind listeners that are arrow functions

```ts
target.addEventListener('click', () => console.log('i will never unbind'), options);

// This will not unbind as you have not passed in the same function reference
target.removeEventListener('click', () => console.log('i will never unbind'), options);
```

You also need to remember to pass in the same `capture` _value_ for the third argument to `addEventListener`: (`boolean | AddEventListenerOption`) or the event will not be unbound

```ts
// add a listener
target.addEventListener('click', onClick, { capture: true });

// forget the third value: not unbound
target.addEventListener('click', onClick);

// different capture value: not unbound
target.addEventListener('click', onClick, { capture: false });

// You need to pass in the same capture value when using the boolean capture format as well
target.addEventListener('click', onClick, true /* shorthand for {capture: true} */);
// not unbound
target.addEventListener('click', onClick);
// not unbound
target.addEventListener('click', onClick, false);
```

`bind-event-listener` solves these problems!

## Usage

### `bind`: basic

```ts
import { bind } from 'bind-event-listener';

const unbind = bind(button, {
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

// when your are all done:
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

// when your are all done:
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

// when your are all done:
unbind();
```

When using `defaultOptions` for `bindAll`, there `defaultOptions` are merged with the `options` on each binding. Options on the individual bindings will take predicdent. You can think of it like this:

```ts
const merged = {
  ...defaultOptions,
  ...options,
};
```

> Note: it is a little bit more complicated than just spreading as the library will also behave correctly when passing in a `boolean` capture argument. An options value can be a boolean (which is shorthand for `{ capture: value}`
