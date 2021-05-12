import { UnbindFn, Binding } from './types';

// ========================
// solution 2
// ========================
// List all `EventMap` types here.
type DOMEventMapDefinitions = [
  [AbortSignal, AbortSignalEventMap],
  [AbstractWorker, AbstractWorkerEventMap],
  [Animation, AnimationEventMap],
  [ApplicationCache, ApplicationCacheEventMap],
  [AudioScheduledSourceNode, AudioScheduledSourceNodeEventMap],
  [AudioWorkletNode, AudioWorkletNodeEventMap],
  [BaseAudioContext, BaseAudioContextEventMap],
  [BroadcastChannel, BroadcastChannelEventMap],
  [Document, DocumentEventMap],
  [DocumentAndElementEventHandlers, DocumentAndElementEventHandlersEventMap],
  [Element, ElementEventMap],
  [EventSource, EventSourceEventMap],
  [FileReader, FileReaderEventMap],
  [GlobalEventHandlers, GlobalEventHandlersEventMap],
  [HTMLBodyElement, HTMLBodyElementEventMap],
  [HTMLElement, HTMLElementEventMap],
  [HTMLFrameSetElement, HTMLFrameSetElementEventMap],
  [HTMLMarqueeElement, HTMLMarqueeElementEventMap],
  [HTMLMediaElement, HTMLMediaElementEventMap],
  [IDBDatabase, IDBDatabaseEventMap],
  [IDBOpenDBRequest, IDBOpenDBRequestEventMap],
  [IDBRequest, IDBRequestEventMap],
  [IDBTransaction, IDBTransactionEventMap],
  [MSInputMethodContext, MSInputMethodContextEventMap],
  [MediaDevices, MediaDevicesEventMap],
  [MediaKeySession, MediaKeySessionEventMap],
  [MediaQueryList, MediaQueryListEventMap],
  [MediaSource, MediaSourceEventMap],
  [MediaStream, MediaStreamEventMap],
  [MediaStreamTrack, MediaStreamTrackEventMap],
  [MessagePort, MessagePortEventMap],
  [Notification, NotificationEventMap],
  [OfflineAudioContext, OfflineAudioContextEventMap],
  [PaymentRequest, PaymentRequestEventMap],
  [Performance, PerformanceEventMap],
  [PermissionStatus, PermissionStatusEventMap],
  [RTCDTMFSender, RTCDTMFSenderEventMap],
  [RTCDataChannel, RTCDataChannelEventMap],
  [RTCDtlsTransport, RTCDtlsTransportEventMap],
  [RTCDtmfSender, RTCDtmfSenderEventMap],
  [RTCIceGatherer, RTCIceGathererEventMap],
  [RTCIceTransport, RTCIceTransportEventMap],
  [RTCPeerConnection, RTCPeerConnectionEventMap],
  [RTCSctpTransport, RTCSctpTransportEventMap],
  [RTCSrtpSdesTransport, RTCSrtpSdesTransportEventMap],
  [SVGElement, SVGElementEventMap],
  [SVGSVGElement, SVGSVGElementEventMap],
  [ScreenOrientation, ScreenOrientationEventMap],
  [ScriptProcessorNode, ScriptProcessorNodeEventMap],
  [ServiceWorker, ServiceWorkerEventMap],
  [ServiceWorkerContainer, ServiceWorkerContainerEventMap],
  [ServiceWorkerRegistration, ServiceWorkerRegistrationEventMap],
  [SourceBuffer, SourceBufferEventMap],
  [SourceBufferList, SourceBufferListEventMap],
  [SpeechRecognition, SpeechRecognitionEventMap],
  [SpeechSynthesis, SpeechSynthesisEventMap],
  [SpeechSynthesisUtterance, SpeechSynthesisUtteranceEventMap],
  [TextTrack, TextTrackEventMap],
  [TextTrackCue, TextTrackCueEventMap],
  [TextTrackList, TextTrackListEventMap],
  [WebSocket, WebSocketEventMap],
  [Window, WindowEventMap],
  [WindowEventHandlers, WindowEventHandlersEventMap],
  [Worker, WorkerEventMap],
  [XMLHttpRequest, XMLHttpRequestEventMap],
  [XMLHttpRequestEventTarget, XMLHttpRequestEventTargetEventMap],
];

type GetEventType_<Target extends EventTarget, Type extends string> = {
  [K in keyof DOMEventMapDefinitions]: DOMEventMapDefinitions[K] extends [any, any]
    ? Target extends DOMEventMapDefinitions[K][0]
      ? Type extends keyof DOMEventMapDefinitions[K][1]
        ? DOMEventMapDefinitions[K][1][Type]
        : never
      : never
    : never;
}[keyof DOMEventMapDefinitions];

type IsNever<T> = [T] extends [never] ? true : false;

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
