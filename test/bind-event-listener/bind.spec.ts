import { UnbindFn } from '../../src/types';
import { bind } from '../../src';

it('should bind a listener', () => {
  const button: HTMLElement = document.createElement('button');
  const onClick = jest.fn();

  bind(button, {
    type: 'click',
    listener: onClick,
  });

  button.click();

  expect(onClick).toHaveBeenCalledTimes(1);
});

it('should unbind a listener', () => {
  const button: HTMLElement = document.createElement('button');
  const onClick = jest.fn();

  const unbind: UnbindFn = bind(button, {
    type: 'click',
    listener: onClick,
  });

  button.click();

  expect(onClick).toHaveBeenCalledTimes(1);

  // Going to unbind
  onClick.mockClear();
  unbind();
  button.click();
  expect(onClick).not.toHaveBeenCalled();
});

it('should respect the default event context', () => {
  const button: HTMLElement = document.createElement('button');
  function onClick(this: HTMLElement, event: Event) {
    expect(this).toBe(button);
    expect(this).toBe(event.target);
  }

  const unbind: UnbindFn = bind(button, {
    type: 'click',
    listener: onClick,
  });

  button.click();

  unbind();
});

it('should allow standard "this" manipulation (bind)', () => {
  const button: HTMLElement = document.createElement('button');

  const object = {};

  const unbind: UnbindFn = bind(button, {
    type: 'click',
    listener: function onClick(this: object, event: Event) {
      expect(this).toBe(object);
    }.bind(object),
  });

  button.click();

  unbind();
});

it('should allow standard "this" manipulation (call)', () => {
  const button: HTMLElement = document.createElement('button');

  const object = {};

  function otherFn(this: unknown, event: Event) {
    expect(this).toBe(object);
  }

  const unbind: UnbindFn = bind(button, {
    type: 'click',
    listener: function onClick(this: HTMLElement, event: Event) {
      expect(this).toBe(button);
      otherFn.call(object, event);
    },
  });

  button.click();

  unbind();
});

it('should allow standard "this" manipulation (arrow fn)', () => {
  const button: HTMLElement = document.createElement('button');

  const context = this;

  const unbind: UnbindFn = bind(button, {
    type: 'click',
    listener: () => {
      expect(this).toBe(context);
    },
  });

  button.click();

  unbind();
});
