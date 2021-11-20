import { bind } from '../../src';

bind(window, {
  type: 'beforeunload',
  listener: function(event) {
    Type.expectAreEqual(this, window);
    Type.expectAreEqual(event, {} as BeforeUnloadEvent);
  }
});

bind(window, {
  type: 'beforeunload',
  listener: {
    handleEvent(event) {
      this.handleEvent;
      Type.expectAreEqual(event, {} as BeforeUnloadEvent);
    }
  }
});

declare let fooEventTarget: EventTarget & { onfoo: (e: { foo: number }) => void };
bind(fooEventTarget, {
  type: 'foo',
  listener: function(event) {
    Type.expectAreEqual(this, fooEventTarget);
    Type.expectAreEqual(event, {} as { foo: number });
  }
});

declare let untypedEventTarget: EventTarget & { bar: number }
bind(untypedEventTarget, {
  type: 'someEvent',
  listener: function(event) {
    Type.expectAreEqual(this, untypedEventTarget);
    Type.expectAreEqual(event, {} as Event);
  }
})

bind(document.body, {
  type: 'someEvent',
  listener: function(event) {
    Type.expectAreEqual(this, document.body);
    Type.expectAreEqual(event, {} as Event);
  }
})

/*
// TODO: test the above two cases should not compile with...
declare module '../../src' {
  interface TypesOptions {
    disallowUntypedEvents: true
  }
}
*/

declare let barEventTarget: EventTarget & { onbar: (e: { bar: number }) => void }

bind(Math.random() ? fooEventTarget : barEventTarget, {
  type: 'foo',
  listener: function(event) {
    Type.expectAreEqual(this, fooEventTarget)
    Type.expectAreEqual(event, {} as { foo: number })
  }
})


declare let alsoFooEventTarget: EventTarget & { onfoo: (e: { alsoFoo: number }) => void }

bind(Math.random() ? fooEventTarget : alsoFooEventTarget, {
  type: 'foo',
  listener: function(event) {
    // @ts-expect-error
    expectAreEqual(this, Math.random() ? fooEventTarget : alsoFooEventTarget);

    // @ts-expect-error
    expectAreEqual(event, {} as { foo: number } | { alsoFoo: number });

    /* Does not work because...
    const f:
      | ((event: { foo: number; }) => void)
      | ((event: { alsoFoo: number; }) => void)
    = e => {
      ^ -- any
    }
    */
  }
})


declare const Type:
  { expectAreEqual: <A, B>
      ( a: A
      , b: B
      , ...errorNotEqual: AreEqual<A, B> extends true ? [] : [(debug: A) => void]
      ) =>
        void
  }

export type AreEqual<A, B> =
  (<T>() => T extends B ? 1 : 0) extends (<T>() => T extends A ? 1 : 0)
    ? true
    : false;
