/// <reference types="node" />
import { EventEmitter } from 'node:events';
export default class Publisher extends EventEmitter {
    constructor(streamId: string, token: string, track: MediaStreamTrack, setState: (state: number) => void);
    pc: RTCPeerConnection;
    streamId: string;
    token: string;
    track: MediaStreamTrack;
    setState: (state: number) => void;
}
