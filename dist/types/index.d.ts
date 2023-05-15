import Publisher from './publish';
import Subscriber from './subscribe';
export interface PublishHook {
    audioMuted: boolean;
    videoMuted: boolean;
    publish: typeof Publisher.prototype.publish;
    mute: typeof Publisher.prototype.mute;
    unpublish: typeof Publisher.prototype.unpublish;
    getPeerConnection: () => RTCPeerConnection;
}
export declare function usePublish(token: string): PublishHook;
export interface SubscribeHook {
    audioMuted: boolean;
    videoMuted: boolean;
    subscribe: () => MediaStream;
    mute: typeof Subscriber.prototype.mute;
    unsubscribe: typeof Subscriber.prototype.unsubscribe;
    getPeerConnection: () => RTCPeerConnection;
}
/**
 * @return SubscribeHook
 */
export declare function useSubscribe(token: string): SubscribeHook;
