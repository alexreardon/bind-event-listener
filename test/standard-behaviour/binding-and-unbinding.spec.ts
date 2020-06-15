test('event handlers are unbound when passing in the same reference', () => {
  const handler = jest.fn();
  const button: HTMLElement = document.createElement('button');

  button.addEventListener('click', handler);
  const event: MouseEvent = new MouseEvent('click');
  button.dispatchEvent(event);
  expect(handler).toHaveBeenCalled();

  handler.mockReset();

  button.removeEventListener('click', handler);
  button.dispatchEvent(event);
  expect(handler).not.toHaveBeenCalled();
});

test('event handlers are unbound if the capture value is the same', () => {
  // No capture value
  {
    const handler = jest.fn();
    const button: HTMLElement = document.createElement('button');
    button.addEventListener('click', handler);
    button.removeEventListener('click', handler);

    const event: MouseEvent = new MouseEvent('click');
    button.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  }
  // Old school, why would you use this, API
  {
    const handler = jest.fn();
    const button: HTMLElement = document.createElement('button');
    button.addEventListener('click', handler, true);
    button.removeEventListener('click', handler, true);

    const event: MouseEvent = new MouseEvent('click');
    button.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  }
  // Much clearer API
  {
    const handler = jest.fn();
    const button: HTMLElement = document.createElement('button');
    button.addEventListener('click', handler, { capture: true });
    button.removeEventListener('click', handler, { capture: true });

    const event: MouseEvent = new MouseEvent('click');
    button.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  }
  // Same capture value different expression
  {
    const handler = jest.fn();
    const button: HTMLElement = document.createElement('button');
    button.addEventListener('click', handler, { capture: true });
    button.removeEventListener('click', handler, true);

    const event: MouseEvent = new MouseEvent('click');
    button.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  }

  // Same capture value different expression
  {
    const handler = jest.fn();
    const button: HTMLElement = document.createElement('button');
    button.addEventListener('click', handler, false);
    button.removeEventListener('click', handler, { capture: false });

    const event: MouseEvent = new MouseEvent('click');
    button.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  }
});

test('event handlers are not unbound if capture value is different', () => {
  // Old school, why would you use this, API
  {
    const handler = jest.fn();
    const button: HTMLElement = document.createElement('button');
    button.addEventListener('click', handler, true);
    button.removeEventListener('click', handler, false);

    const event: MouseEvent = new MouseEvent('click');
    button.dispatchEvent(event);
    // event not unbound!
    expect(handler).toHaveBeenCalled();
  }
  // Much clearer API
  {
    const handler = jest.fn();
    const button: HTMLElement = document.createElement('button');
    button.addEventListener('click', handler, { capture: true });
    button.removeEventListener('click', handler, { capture: false });

    const event: MouseEvent = new MouseEvent('click');
    button.dispatchEvent(event);
    // event not unbound!
    expect(handler).toHaveBeenCalled();
  }
});

test('event handlers will unbind even if the passive value has changed', () => {
  // No passive value at all
  {
    const handler = jest.fn();
    const button: HTMLElement = document.createElement('button');
    button.addEventListener('click', handler, { passive: true });
    button.removeEventListener('click', handler);

    const event: MouseEvent = new MouseEvent('click');
    button.dispatchEvent(event);
    // event will be unbound
    expect(handler).not.toHaveBeenCalled();
  }
  // Different value - but will still be unbound
  {
    const handler = jest.fn();
    const button: HTMLElement = document.createElement('button');
    button.addEventListener('click', handler, { passive: true });
    // @ts-ignore
    button.removeEventListener('click', handler, { passive: false });

    const event: MouseEvent = new MouseEvent('click');
    button.dispatchEvent(event);
    // event will be unbound
    expect(handler).not.toHaveBeenCalled();
  }
});
