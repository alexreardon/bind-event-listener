import { bindAll } from '../../src';

bindAll(window, [{
  type: 'beforeunload',
  listener: function(event) {
    Type.expectAreEqual(this, window);
    Type.expectAreEqual(event, {} as BeforeUnloadEvent);
  }
}, {
  type: 'click',
  listener: function(event) {
    Type.expectAreEqual(this, window);
    Type.expectAreEqual(event, {} as MouseEvent);
  }
}]);

bindAll(window, [{
  type: 'beforeunload',
  listener: {
    handleEvent(event) {
      this.handleEvent;
      Type.expectAreEqual(event, {} as BeforeUnloadEvent);
    }
  }
}, {
  type: 'click',
  listener: {
    handleEvent(event) {
      this.handleEvent;
      Type.expectAreEqual(event, {} as MouseEvent);
    }
  }
}]);

declare let fooEventTarget: EventTarget & {
  onfoo1: (e: { foo1: number }) => void
  onfoo2: (e: { foo2: number }) => void
};
bindAll(fooEventTarget, [{
  type: 'foo1',
  listener: function(event) {
    Type.expectAreEqual(this, fooEventTarget);
    Type.expectAreEqual(event, {} as { foo1: number });
  }
}, {
  type: 'foo2',
  listener: function(event) {
    Type.expectAreEqual(this, fooEventTarget);
    Type.expectAreEqual(event, {} as { foo2: number });
  }
}]);

declare let untypedEventTarget: EventTarget & { bar: number }
bindAll(untypedEventTarget, [{
  type: 'someEvent',
  listener: function(event) {
    Type.expectAreEqual(this, untypedEventTarget);
    Type.expectAreEqual(event, {} as Event);
  }
}, {
  type: 'someOtherEvent',
  listener: function(event) {
    Type.expectAreEqual(this, untypedEventTarget);
    Type.expectAreEqual(event, {} as Event);
  }
}])

bindAll(document.body, [{
  type: 'someEvent',
  listener: function(event) {
    Type.expectAreEqual(this, document.body);
    Type.expectAreEqual(event, {} as Event);
  }
}, {
  type: 'click',
  listener: function(event) {
    Type.expectAreEqual(this, document.body);

    // if anyone of the event is untyped all of them become untyped
    Type.expectAreEqual(event, {} as Event); 
  }
}])

/*
// TODO: test the above two cases should not compile with...
declare module '../../src' {
  interface TypesOptions {
    disallowUntypedEvents: true
  }
}
*/

declare let barEventTarget: EventTarget & { onbar: (e: { bar: number }) => void }

bindAll(Math.random() ? fooEventTarget : barEventTarget, [{
  type: 'foo1',
  listener: function(event) {
    Type.expectAreEqual(this, fooEventTarget)
    Type.expectAreEqual(event, {} as { foo1: number })
  }
}, {
  type: 'bar',
  listener: function(event) {
    Type.expectAreEqual(this, barEventTarget)
    Type.expectAreEqual(event, {} as { bar: number })
  }
}])


declare let alsoFooEventTarget: EventTarget & { onfoo: (e: { alsoFoo: number }) => void }

bindAll(Math.random() ? fooEventTarget : alsoFooEventTarget, [{
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
}])


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
