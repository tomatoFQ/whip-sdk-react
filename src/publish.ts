import { EventEmitter } from 'events';
import { decode } from 'jsonwebtoken';
import { deleteRequest, pushRequest, updateRequest } from './request';

export default class Publisher extends EventEmitter {
  constructor(audio: MediaStreamTrack, video: MediaStreamTrack, token: string) {
    super();
    const { appId, streamId } = decode(token) as { appId: string, streamId: string };
    this.streamId = streamId;
    this.appId = appId;
    this.token = token;
    this.audio = audio;
    this.video = video;
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
    this.pc.addTransceiver(this.audio, { direction: 'sendonly' });
    this.pc.addTransceiver(this.video, { direction: 'sendonly' });

    this.pc.addEventListener('connectionstatechange', this.emit.bind(this.pc));

    this.publish();
  }

  async publish() {
    if (this.pc.connectionState !== 'new') {
      throw new Error('Already published.')
    }
    const offer = await this.pc.createOffer();

    await this.pc.setLocalDescription(offer);
    const { sdp, location } = await pushRequest({
      AppID: this.appId,
      StreamID: this.streamId,
      token: this.token,
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

  async unpublish() {
    if (this.pc.connectionState === 'closed') {
      throw new Error('Already unpublished.')
    }

    if (!this.location) {
      throw new Error('Not in publishing. Consider using `publish()` before `unpublish()`.')
    }

    await deleteRequest(this.location);
    this.location = undefined;
    this.pc.close();
  }

  async mute(muted: boolean, kind?: 'audio' | 'video') {
    if (!this.location) {
      throw new Error('Not in publishing. Consider using `publish()` before `mute()`.')
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

    this.emit('muteChanged')
  }
}
