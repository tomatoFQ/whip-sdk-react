/// <reference types="node" />
import { EventEmitter } from 'events';
export default class Publisher extends EventEmitter {
    constructor();
    pc: RTCPeerConnection;
    appId?: string;
    streamId?: string;
    token?: string;
    mediaStream: MediaStream;
    audio?: MediaStreamTrack;
    video?: MediaStreamTrack;
    audioMuted: boolean;
    videoMuted: boolean;
    sessionId?: string;
    location?: string;
    get canPublish(): boolean;
    init(token: string): Promise<void>;
    publish(audio: MediaStreamTrack, video: MediaStreamTrack): Promise<void>;
    unpublish(): Promise<void>;
    mute(muted: boolean, kind?: 'audio' | 'video'): Promise<void>;
}
