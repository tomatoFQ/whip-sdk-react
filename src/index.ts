import { useState, useCallback, useMemo, useRef } from 'react';
import Publisher from './publish';
import Subscribe from './subscribe';

export interface PublishHook {
  audioMuted: boolean;
  videoMuted: boolean;
  publish: typeof Publisher.prototype.publish;
  mute: typeof Publisher.prototype.mute;
  unpublish: typeof Publisher.prototype.unpublish;
  getPeerConnection: () => RTCPeerConnection;
}
export function usePublish(token: string): PublishHook {
  const publisher = useRef(new Publisher(token)).current;
  const [audioMuted, setAudioMuted] = useState(publisher.audioMuted);
  const [videoMuted, setVideoMuted] = useState(publisher.videoMuted);
  const publish = useRef(publisher.publish.bind(publisher)).current;
  const mute = useRef(publisher.mute.bind(publisher)).current;
  const unpublish = useRef(publisher.unpublish.bind(publisher)).current;

  publisher.on('muteChanged', () => {
    setAudioMuted(publisher.audioMuted);
    setVideoMuted(publisher.videoMuted);
  });

  return {
    audioMuted,
    videoMuted,
    publish,
    mute,
    unpublish,
    getPeerConnection: () => publisher.pc
  };
}

export interface Subscriber {
  videoTrack: MediaStreamTrack,
  audioTrack: MediaStreamTrack,
  state: RTCPeerConnectionState,
  mute: Function,
  stop: Function,
}

export function useSubscribe(Token: string) {
  const [state, setState] = useState<RTCPeerConnectionState>('new');
  const [subscriber, setSubscriber] = useState<Subscribe>();
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>();
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>();

  const handleSubscribe = useCallback((track: MediaStreamTrack) => {
    if (track.kind === 'video') {
      setVideoTrack(track)
    } else {
      setAudioTrack(track)
    }
  }, [])

  const handleConnectionState = (peerConnectionState: RTCPeerConnectionState) => {
    setState(peerConnectionState);
  }

  const stop = () => {
    subscriber.unsubscribe();
  };

  const mute = (isMute: boolean, kind: 'video' | 'audio') => {
    // TODO add lock
    subscriber.mute(isMute, kind);
  };

  useMemo(() => {
    setSubscriber(new Subscribe(Token));
    subscriber.addListener('track', handleSubscribe);
    subscriber.addListener('connectionstatechange', handleConnectionState);
    return () => subscriber.unsubscribe();
  }, []);

  return {videoTrack, audioTrack, state, mute, stop} as Subscriber;
}
