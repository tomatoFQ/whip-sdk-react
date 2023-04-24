import { EventEmitter } from 'events';
import { decodeJwt } from 'jose';
import { deleteRequest, pushRequest, updateRequest } from './request';

export default class Publisher extends EventEmitter {
  constructor(token: string) {
    super();
    this.token = token;
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
    return this.appId && this.streamId && this.token && this.mediaStream && this.pc && this.pc.connectionState === 'new';
  }

  async init() {
    const { appID, streamID } = decodeJwt(this.token) as { appID: string, streamID: string };
    this.streamId = streamID;
    this.appId = appID;
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

  async publish(audio: MediaStreamTrack, video: MediaStreamTrack) {
    await this.init();
    if (!this.canPublish) {
      throw new Error('Publisher is not ready.')
    }
    if (!audio) {
      throw new Error('Audio track is required.')
    }
    if (!video) {
      throw new Error('Video track is required.')
    }

    this.audio = audio;
    this.video = video;
    this.mediaStream.addTrack(audio);
    this.mediaStream.addTrack(video);
    this.pc.addTransceiver(audio, { direction: 'sendonly', streams: [this.mediaStream] });
    this.pc.addTransceiver(video, { direction: 'sendonly', streams: [this.mediaStream] });

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
    this.mediaStream = undefined;
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
