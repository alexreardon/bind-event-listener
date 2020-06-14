# bind-event-listener

> A utility to make using `addEventListener` easier.

When using `addEventListener()` you need to remember to manually call `removeEventListener()` correctly in order to unbind the event.

```ts
target.addEventListener('click', onClick, options);

// You need to remember to call removeEventListener to unbind the event
target.removeEventListener('click', onClick, options);
```

## Rationale

Pitfalls with manually removing the event listener:

1. You need to pass in the same listener _reference_ (`onClick`), otherwise the original function will not unbind.

This means you can also never unbind listeners that are arrow functions `addEventListener('click', () => console.log('I can never be unbound'))`

2. You need to remember to pass in the same _value_ for the third argument to `addEventListener`: (`boolean | AddEventListenerOption`) or the event will not be unbound

```ts
// add a listener
target.addEventListener('click', onClick, options);

// forget the third value (or use a different value)
target.addEventListener('click', onClick);

// event is still bound in some browsers!!
```

`bind-event-listener` solves these problems!

## Usage

```ts
import { bind } from 'bind-event-listener';

const unbind = bind({
  target: button,
  type: 'click',
  listener: onClick,
  options,
});

// when your are all done:
unbind();
```

```ts
import { bind } from 'bind-event-listener';

const unbind = bind({
  target: button,
  type: 'click',
  // you can now use arrow functions for handlers if you want
  listener: () => console.log('click'),
  options,
});

// when your are all done:
unbind();
```

```ts
import { bindAll } from 'bind-event-listener';

const unbindAll = bind([
  {
    target: button,
    type: 'click',
    listener: onClick,
    options,
  },
  { target: button, type: 'mouseover', listener: onMouseOver, options },
]);

// when your are all done:
unbindAll();
```
