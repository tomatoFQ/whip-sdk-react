/// <reference types="node" />
import { EventEmitter } from 'events';
export default class Publisher extends EventEmitter {
    constructor(audio: MediaStreamTrack, video: MediaStreamTrack, token: string);
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
    publish(): Promise<void>;
    unpublish(): Promise<void>;
    mute(muted: boolean, kind?: 'audio' | 'video'): Promise<void>;
}
