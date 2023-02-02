import { expectTypeOf } from 'expect-type';
import { Binding, Listener } from '../../src';
import { expectType, TypeOf } from 'ts-expect';

// extracting event type
{
  // correctly extracts event type from target (HTMLElement)
  expectTypeOf<Binding<HTMLElement, 'click'>>().toEqualTypeOf<{
    type: 'click';
    listener: Listener<HTMLElement, 'click'>;
    options?: boolean | AddEventListenerOptions;
  }>();

  type ClickListener = Listener<HTMLElement, 'click'>;

  // `this` and `event` are set correctly
  type Obj1 = {
    handleEvent: (this: Obj1, e: MouseEvent) => void;
  };
  expectType<TypeOf<ClickListener, Obj1>>(true);

  // not okay to use the wrong `this` type
  type Obj2 = {
    handleEvent: (this: number, e: MouseEvent) => void;
  };
  expectType<TypeOf<ClickListener, Obj2>>(false);

  // not okay to use the wrong `event` type
  type Obj3 = {
    handleEvent: (this: Obj3, e: AnimationEvent) => void;
  };
  expectType<TypeOf<ClickListener, Obj3>>(false);
}
