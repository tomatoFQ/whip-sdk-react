import Publisher from './publish';
export interface PublishHook {
    audioMuted: boolean;
    videoMuted: boolean;
    peerconnection: RTCPeerConnection;
    init: typeof Publisher.prototype.init;
    publish: typeof Publisher.prototype.publish;
    mute: typeof Publisher.prototype.mute;
    delete: typeof Publisher.prototype.unpublish;
}
export declare function usePublish(): PublishHook;
