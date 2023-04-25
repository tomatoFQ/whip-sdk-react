import Publisher from './publish';
export interface PublishHook {
    audioMuted: boolean;
    videoMuted: boolean;
    publish: typeof Publisher.prototype.publish;
    mute: typeof Publisher.prototype.mute;
    unpublish: typeof Publisher.prototype.unpublish;
    getPeerConnection: () => RTCPeerConnection;
}
export declare function usePublish(token: string): PublishHook;
export interface Subscriber {
    videoTrack: MediaStreamTrack;
    audioTrack: MediaStreamTrack;
    state: RTCPeerConnectionState;
    mute: Function;
    stop: Function;
}
export declare function useSubscribe(Token: string): Subscriber;
