import { EventEmitter } from 'events';
import { decode } from 'jsonwebtoken';
import {deleteRequest, pullRequest, updateRequest} from './request';

export default class Subscribe extends EventEmitter {
  constructor(token: string) {
    super();
    const { appId, streamId } = decode(token) as { appId: string, streamId: string };
    this.streamId = streamId;
    this.appId = appId;
    this.token = token;
    this.createRTCPeerConnection();
  }

  pc: RTCPeerConnection;

  appId: string;

  streamId: string;

  token: string;

  audio: MediaStreamTrack;

  video: MediaStreamTrack;

  audioMuted: boolean = false;

  videoMuted: boolean = false;

  sessionId: string;

  location?: string;

  get state(): RTCPeerConnectionState {
    return this.pc.connectionState;
  }

  createRTCPeerConnection() {
    this.pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: "all",
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
      // @ts-ignore
      sdpSemantics: "unified-plan",
    });
    this.pc.addTransceiver(this.audio, { direction: 'recvonly' });
    this.pc.addTransceiver(this.video, { direction: 'recvonly' });

    this.pc.addEventListener('connectionstatechange', this.emit.bind(this.pc));
    this.pc.addEventListener('track', (evt: RTCTrackEvent) => {
      if (evt.track) {
        if (evt.track.kind === 'audio') {
          this.audio = evt.track;
        } else {
          this.video = evt.track;
        }
      }
      this.emit.call(this.pc,'track', evt.track);
    });

    this.subscribe();
  }

  async subscribe() {
    if (this.pc.connectionState !== 'new') {
      throw new Error('Already subscribed.')
    }
    const offer = await this.pc.createOffer();

    await this.pc.setLocalDescription(offer);
    const { sdp, location } = await pullRequest({
      AppID: this.appId,
      StreamID: this.streamId,
      token: this.token,
      SessionID: '',
      sdp: offer.sdp,
    })
    await this.pc.setRemoteDescription(
      new RTCSessionDescription({
        type: "answer",
        sdp,
      }),
    );
    this.location = location;
  }

  async unsubscribe() {
    if (this.pc.connectionState === 'closed') {
      throw new Error('Already unsubscribed.')
    }

    if (!this.location) {
      throw new Error('Not in subscribing. Consider using `subscribe()` before `unsubscribe()`.')
    }

    await deleteRequest(this.location);
    this.location = undefined;
    this.pc.close();
  }

  async mute(muted: boolean, kind?: 'audio' | 'video') {
    if (!this.location) {
      throw new Error('Not in subscribing. Consider using `subscribe()` before `mute()`.')
    }

    if (kind === 'audio' || !kind) {
      this.audioMuted = muted;
    }

    if (kind === 'video' || !kind) {
      this.videoMuted = muted;
    }

    await updateRequest(this.location, {
      MuteAudio: this.audioMuted,
      MuteVideo: this.videoMuted,
    })
  }
}
