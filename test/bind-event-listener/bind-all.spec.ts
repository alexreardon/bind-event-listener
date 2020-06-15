import { bindAll, UnbindFn } from '../../src';

it('should allow for multiple bindings of different types', () => {
  const button: HTMLElement = document.createElement('button');
  const onClick = jest.fn();
  const onMouseOver = jest.fn();

  const unbind = bindAll(button, [
    {
      type: 'click',
      listener: onClick,
    },
    {
      type: 'mouseover',
      listener: onMouseOver,
    },
  ]);

  button.dispatchEvent(new MouseEvent('click'));
  button.dispatchEvent(new MouseEvent('mouseover'));

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onMouseOver).toHaveBeenCalledTimes(1);
  onClick.mockClear();
  onMouseOver.mockClear();

  unbind();

  button.dispatchEvent(new MouseEvent('click'));
  button.dispatchEvent(new MouseEvent('mouseover'));

  expect(onClick).not.toHaveBeenCalled();
  expect(onMouseOver).not.toHaveBeenCalled();
});

it('should allow for multiple bindings of the same type', () => {
  const button: HTMLElement = document.createElement('button');
  const onClick1 = jest.fn();
  const onClick2 = jest.fn();

  const unbind = bindAll(button, [
    {
      type: 'click',
      listener: onClick1,
    },
    {
      type: 'click',
      listener: onClick2,
    },
  ]);

  button.dispatchEvent(new MouseEvent('click'));

  expect(onClick1).toHaveBeenCalledTimes(1);
  expect(onClick2).toHaveBeenCalledTimes(1);
  onClick1.mockClear();
  onClick2.mockClear();

  unbind();

  button.dispatchEvent(new MouseEvent('click'));

  expect(onClick1).not.toHaveBeenCalled();
  expect(onClick2).not.toHaveBeenCalled();
});

it('should apply shared options', () => {
  // setting handler to occur on the capture phase
  {
    const parent: HTMLElement = document.createElement('div');
    const child: HTMLElement = document.createElement('div');
    parent.append(child);
    const mock = jest.fn();

    const unbind = bindAll(
      parent,
      [
        {
          type: 'click',
          listener: (event: Event) => {
            mock(event.eventPhase);
          },
        },
      ],
      { capture: true },
    );
    child.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const eventPhase: number = mock.mock.calls[0][0];
    expect(eventPhase).toBe(Event.CAPTURING_PHASE);
    unbind();
  }
  // setting handler to occur on the bubble phase
  {
    const parent: HTMLElement = document.createElement('div');
    const child: HTMLElement = document.createElement('div');
    parent.append(child);
    const mock = jest.fn();

    const unbind = bindAll(
      parent,
      [
        {
          type: 'click',
          listener: (event: Event) => {
            mock(event.eventPhase);
          },
        },
      ],
      { capture: false },
    );
    child.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const eventPhase: number = mock.mock.calls[0][0];
    expect(eventPhase).toBe(Event.BUBBLING_PHASE);
    unbind();
  }
});

it('should merge shared options', () => {
  // Giving preference to binding option
  {
    const parent: HTMLElement = document.createElement('div');
    const child: HTMLElement = document.createElement('div');
    parent.append(child);
    const mock = jest.fn();

    const unbind = bindAll(
      parent,
      [
        {
          type: 'click',
          listener: (event: Event) => {
            mock(event.eventPhase);
          },
          // this will will
          options: { capture: false },
        },
      ],
      { capture: true },
    );
    child.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const eventPhase: number = mock.mock.calls[0][0];
    expect(eventPhase).toBe(Event.BUBBLING_PHASE);
    unbind();
  }
  // Handles the capture: boolean form on the binding
  {
    const parent: HTMLElement = document.createElement('div');
    const child: HTMLElement = document.createElement('div');
    parent.append(child);
    const mock = jest.fn();

    const unbind = bindAll(
      parent,
      [
        {
          type: 'click',
          listener: (event: Event) => {
            mock(event.eventPhase);
          },
          // this will win
          options: false /* capture: false */,
        },
      ],
      { capture: true },
    );
    child.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const eventPhase: number = mock.mock.calls[0][0];
    expect(eventPhase).toBe(Event.BUBBLING_PHASE);
    unbind();
  }
  // Handles the capture: boolean form on the shared options
  {
    const parent: HTMLElement = document.createElement('div');
    const child: HTMLElement = document.createElement('div');
    parent.append(child);
    const mock = jest.fn();

    const unbind = bindAll(
      parent,
      [
        {
          type: 'click',
          listener: (event: Event) => {
            mock(event.eventPhase);
          },
          // this will win
          options: { capture: false },
        },
      ],
      true /* capture: true */,
    );
    child.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const eventPhase: number = mock.mock.calls[0][0];
    expect(eventPhase).toBe(Event.BUBBLING_PHASE);
    unbind();
  }
  // Handles the capture: boolean form on both options
  {
    const parent: HTMLElement = document.createElement('div');
    const child: HTMLElement = document.createElement('div');
    parent.append(child);
    const mock = jest.fn();

    const unbind = bindAll(
      parent,
      [
        {
          type: 'click',
          listener: (event: Event) => {
            mock(event.eventPhase);
          },
          // this will win
          options: false /* capture: false */,
        },
      ],
      true /* capture: true */,
    );
    child.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const eventPhase: number = mock.mock.calls[0][0];
    expect(eventPhase).toBe(Event.BUBBLING_PHASE);
    unbind();
  }
});

it('should give the correct "this" context to listeners', () => {
  const button: HTMLElement = document.createElement('button');
  function onClick(this: HTMLElement, event: Event) {
    expect(this).toBe(button);
    expect(this).toBe(event.target);
  }

  const unbind: UnbindFn = bindAll(button, [
    {
      type: 'click',
      listener: onClick,
    },
  ]);
  button.click();

  unbind();
});

it('should allow standard "this" manipulation (bind)', () => {
  const button: HTMLElement = document.createElement('button');

  const object = {};

  const unbind: UnbindFn = bindAll(button, [
    {
      type: 'click',
      listener: function onClick(this: object, event: Event) {
        expect(this).toBe(object);
      }.bind(object),
    },
  ]);

  button.click();

  unbind();
});
