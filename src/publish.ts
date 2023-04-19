import { EventEmitter } from 'events';
import { decodeJwt } from 'jose';
import { deleteRequest, pushRequest, updateRequest } from './request';

export default class Publisher extends EventEmitter {
  constructor() {
    super();
    this.mediaStream = new MediaStream();
    this.pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: "all",
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
      // @ts-ignore
      sdpSemantics: "unified-plan",
    });

    this.pc.addEventListener('connectionstatechange', this.emit.bind(this.pc));
  }

  pc: RTCPeerConnection;

  appId?: string;

  streamId?: string;

  token?: string;

  mediaStream: MediaStream;

  audio?: MediaStreamTrack;

  video?: MediaStreamTrack;

  audioMuted: boolean = false;

  videoMuted: boolean = false;

  sessionId?: string;

  location?: string;

  get canPublish() {
    return this.appId && this.streamId && this.token && this.pc.connectionState === 'new';
  }

  async init(token: string) {
    const { appId, streamId } = decodeJwt(token) as { appId: string, streamId: string };
    this.streamId = streamId;
    this.appId = appId;
    this.token = token;
    this.pc.addTransceiver('audio', { direction: 'sendonly', streams: [this.mediaStream] });
    this.pc.addTransceiver('video', { direction: 'sendonly', streams: [this.mediaStream] });
  }

  async publish(audio: MediaStreamTrack, video: MediaStreamTrack) {
    if (!this.canPublish) {
      throw new Error('Publisher is not ready.')
    }
    if (!audio) {
      throw new Error('Audio track is required.')
    }
    if (!video) {
      throw new Error('Video track is required.')
    }

    this.mediaStream.addTrack(audio);
    this.mediaStream.addTrack(video);

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
    this.mediaStream.removeTrack(this.audio);
    this.mediaStream.removeTrack(this.video);
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
