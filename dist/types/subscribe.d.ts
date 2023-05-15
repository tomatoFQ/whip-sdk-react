/// <reference types="node" />
import { EventEmitter } from 'events';
export default class Subscriber extends EventEmitter {
    constructor(token: string);
    pc: RTCPeerConnection;
    appId: string;
    streamId: string;
    token: string;
    audio: MediaStreamTrack;
    video: MediaStreamTrack;
    audioMuted: boolean;
    videoMuted: boolean;
    sessionId: string;
    location?: string;
    get state(): RTCPeerConnectionState;
    createRTCPeerConnection(): void;
    subscribe(): Promise<void>;
    unsubscribe(): Promise<void>;
    mute(muted: boolean, kind?: 'audio' | 'video'): Promise<void>;
}
