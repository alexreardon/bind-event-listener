
export { Bind, BindAll, BindingOf, Binding, EventMap, BindingOptions, TypesOptions }

type Bind =
  { <T extends EventTarget>(target: T, binding: BindingOf<T>): () => void
  , <T extends EventTarget>(target: T, binding: UntypedBindingOf<T>): () => void
  }

type BindAll =
  { <T extends EventTarget>
      ( target: T
      , bindings: BindingOf<T>[]
      , defaultOptions?: boolean | AddEventListenerOptions
      ):
        () => void
  , <T extends EventTarget>
      ( target: T
      , bindings: UntypedBindingOf<T>[]
      , defaultOptions?: boolean | AddEventListenerOptions
      ):
        () => void
  }

type BindingOf<T extends EventTarget> =
  T extends unknown
    ? { [N in keyof EventMap<T>]:
        Binding<T, N>
      }[keyof EventMap<T>]
    : never

interface TypesOptions {}
type UntypedBindingOf<T extends EventTarget> = 
  TypesOptions extends { disallowUntypedEvents: true }
    ? never
    : Binding<T, UnknownEventName>


type EventMap<T extends EventTarget> =
  TrimOnFromKey<{
    [K in Extract<keyof T, `on${string}`>]:
      Parameters<Extract<T[K], (e: any) => any>>[0]
  }>
    
type Binding<T extends EventTarget, N extends EventName<T>> =
  { type: InferStringLiteral<N>
  , listener: Listener<T, N>
  , options?: BindingOptions
  }

type Listener<T extends EventTarget, N extends EventName<T>> =
  | Bivariant<(this: T, event: Event_<T, N>) => void>
  | ListenerObject<T, N>

interface ListenerObject<T extends EventTarget, N extends EventName<T>>
  { handleEvent(this: ListenerObject<T, N>, event: Event_<T, N>): void
  }

type BindingOptions =
  | undefined
  | boolean
  | AddEventListenerOptions

type EventName<T extends EventTarget> =
  | keyof EventMap<T>
  | UnknownEventName

type UnknownEventName =
  string

type Event_<T extends EventTarget, N extends EventName<T>> =
  N extends keyof EventMap<T>
    ? EventMap<T>[N]
    : UnknownEvent

type UnknownEvent =
  Event

type InferStringLiteral<T> =
  T extends string ? T : string

type TrimOnFromKey<M> =
  { [N in (keyof M extends `on${infer N}` ? N : never)]:
      M[`on${N}` & keyof M]
  }

type Bivariant<F> =
  F extends (this: infer T, ...a: infer A) => infer R
    ? { _(this: T, ...a: A): R }["_"]
    : never