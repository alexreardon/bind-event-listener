import { UnbindFn, Binding } from './types';

// ========================
// solution 2
// ========================
// List all `EventMap` types here.
type DOMEventMapDefinitions = [
  [DocumentAndElementEventHandlers, DocumentAndElementEventHandlersEventMap],
  [ServiceWorkerRegistration, ServiceWorkerRegistrationEventMap],
  [XMLHttpRequestEventTarget, XMLHttpRequestEventTargetEventMap],
  [AudioScheduledSourceNode, AudioScheduledSourceNodeEventMap],
  [SpeechSynthesisUtterance, SpeechSynthesisUtteranceEventMap],
  [ServiceWorkerContainer, ServiceWorkerContainerEventMap],
  [MSInputMethodContext, MSInputMethodContextEventMap],
  [RTCSrtpSdesTransport, RTCSrtpSdesTransportEventMap],
  [GlobalEventHandlers, GlobalEventHandlersEventMap],
  [WindowEventHandlers, WindowEventHandlersEventMap],
  [HTMLFrameSetElement, HTMLFrameSetElementEventMap],
  [OfflineAudioContext, OfflineAudioContextEventMap],
  [ScriptProcessorNode, ScriptProcessorNodeEventMap],
  [HTMLMarqueeElement, HTMLMarqueeElementEventMap],
  [RTCPeerConnection, RTCPeerConnectionEventMap],
  [ScreenOrientation, ScreenOrientationEventMap],
  [SpeechRecognition, SpeechRecognitionEventMap],
  [ApplicationCache, ApplicationCacheEventMap],
  [AudioWorkletNode, AudioWorkletNodeEventMap],
  [BaseAudioContext, BaseAudioContextEventMap],
  [BroadcastChannel, BroadcastChannelEventMap],
  [HTMLMediaElement, HTMLMediaElementEventMap],
  [IDBOpenDBRequest, IDBOpenDBRequestEventMap],
  [MediaStreamTrack, MediaStreamTrackEventMap],
  [PermissionStatus, PermissionStatusEventMap],
  [RTCDtlsTransport, RTCDtlsTransportEventMap],
  [RTCSctpTransport, RTCSctpTransportEventMap],
  [SourceBufferList, SourceBufferListEventMap],
  [HTMLBodyElement, HTMLBodyElementEventMap],
  [MediaKeySession, MediaKeySessionEventMap],
  [RTCIceTransport, RTCIceTransportEventMap],
  [SpeechSynthesis, SpeechSynthesisEventMap],
  [AbstractWorker, AbstractWorkerEventMap],
  [IDBTransaction, IDBTransactionEventMap],
  [MediaQueryList, MediaQueryListEventMap],
  [PaymentRequest, PaymentRequestEventMap],
  [RTCDataChannel, RTCDataChannelEventMap],
  [RTCIceGatherer, RTCIceGathererEventMap],
  [XMLHttpRequest, XMLHttpRequestEventMap],
  [RTCDTMFSender, RTCDTMFSenderEventMap],
  [RTCDtmfSender, RTCDtmfSenderEventMap],
  [SVGSVGElement, SVGSVGElementEventMap],
  [ServiceWorker, ServiceWorkerEventMap],
  [TextTrackList, TextTrackListEventMap],
  [MediaDevices, MediaDevicesEventMap],
  [Notification, NotificationEventMap],
  [SourceBuffer, SourceBufferEventMap],
  [TextTrackCue, TextTrackCueEventMap],
  [AbortSignal, AbortSignalEventMap],
  [EventSource, EventSourceEventMap],
  [HTMLElement, HTMLElementEventMap],
  [IDBDatabase, IDBDatabaseEventMap],
  [MediaSource, MediaSourceEventMap],
  [MediaStream, MediaStreamEventMap],
  [MessagePort, MessagePortEventMap],
  [Performance, PerformanceEventMap],
  [FileReader, FileReaderEventMap],
  [IDBRequest, IDBRequestEventMap],
  [SVGElement, SVGElementEventMap],
  [Animation, AnimationEventMap],
  [TextTrack, TextTrackEventMap],
  [WebSocket, WebSocketEventMap],
  [Document, DocumentEventMap],
  [Element, ElementEventMap],
  [Window, WindowEventMap],
  [Worker, WorkerEventMap],
];

type GetEventType_<Target extends EventTarget, Type extends string> = {
  [K in keyof DOMEventMapDefinitions]: DOMEventMapDefinitions[K] extends [
    infer TargetType,
    infer EventMap,
  ]
    ? Target extends TargetType
      ? Type extends keyof EventMap
        ? EventMap[Type]
        : never
      : never
    : never;
}[keyof DOMEventMapDefinitions];

type IsNever<T> = [T] extends [never] ? true : false;

// if `Target` doesn't match any item form the
// `DOMEventMapDefinitions`, we fallback to Event
type CastToEvent<T> = IsNever<T> extends true ? Event : T;

type GetEventType<Target extends EventTarget, Type extends string> = CastToEvent<
  GetEventType_<Target, Type>
>;

export function bind<Target extends EventTarget, Type extends string>(
  target: Target,
  { type, listener, options }: Binding<Type, GetEventType<Target, Type>>,
): UnbindFn;
export function bind(target: EventTarget, { type, listener, options }: Binding): UnbindFn {
  target.addEventListener(type, listener, options);

  return function unbind() {
    target.removeEventListener(type, listener, options);
  };
}
