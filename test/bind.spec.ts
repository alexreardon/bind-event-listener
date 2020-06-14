import { UnbindFn } from './../src/types';
import { bind } from '../src';

it('should bind a listener', () => {
  const button: HTMLElement = document.createElement('button');
  const onClick = jest.fn();

  bind({
    target: button,
    type: 'click',
    handler: onClick,
  });

  button.click();

  expect(onClick).toHaveBeenCalledTimes(1);
});

it('should unbind a listener', () => {
  const button: HTMLElement = document.createElement('button');
  const onClick = jest.fn();

  const unbind: UnbindFn = bind({
    target: button,
    type: 'click',
    handler: onClick,
  });

  button.click();

  expect(onClick).toHaveBeenCalledTimes(1);

  // Going to unbind
  onClick.mockClear();
  unbind();
  button.click();
  expect(onClick).not.toHaveBeenCalled();
});
