it('should allow binding with the object syntax', () => {
  const el = document.createElement('div');
  const listener = {
    handleEvent: jest.fn(),
  };

  el.addEventListener('click', listener);

  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

  expect(listener.handleEvent).toHaveBeenCalled();
});

it('should unbind when passing in the same object reference', () => {
  const el = document.createElement('div');
  const listener = {
    handleEvent: jest.fn(),
  };

  el.addEventListener('click', listener);

  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(listener.handleEvent).toHaveBeenCalled();
  listener.handleEvent.mockReset();

  el.removeEventListener('click', listener);
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(listener.handleEvent).not.toHaveBeenCalled();
});

it('should not unbind when passing in a different object reference', () => {
  const el = document.createElement('div');
  const listener = {
    handleEvent: jest.fn(),
  };

  el.addEventListener('click', listener);

  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(listener.handleEvent).toHaveBeenCalled();
  listener.handleEvent.mockReset();

  const newListener = {
    ...listener,
  };

  el.removeEventListener('click', newListener);
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(listener.handleEvent).toHaveBeenCalled();
});

// Validated in browser:
// https://codesandbox.io/s/event-listener-object-internal-change-mu1d5
it('should not unbind when passing in a different object reference', () => {
  const el = document.createElement('div');
  const first = jest.fn();
  const second = jest.fn();
  const listener = {
    handleEvent: first,
  };

  el.addEventListener('click', listener);

  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(first).toHaveBeenCalled();
  expect(second).not.toHaveBeenCalled();
  first.mockReset();

  // modifying listener
  listener.handleEvent = second;

  el.removeEventListener('click', listener);
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  // even though 'first' is no longer the handleEvent function, it was still removed
  expect(first).not.toHaveBeenCalled();
  expect(second).not.toHaveBeenCalled();
});
