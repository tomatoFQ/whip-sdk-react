import { useState, useEffect, useRef } from 'react';
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
    getPeerConnection: () => publisher.pc,
  };
}

export interface SubscribeHook {
  audioMuted: boolean;
  videoMuted: boolean;
  publish: typeof Publisher.prototype.publish;
  mute: typeof Publisher.prototype.mute;
  unpublish: typeof Publisher.prototype.unpublish;
  getPeerConnection: () => RTCPeerConnection;
}

/**
 * @return SubscribeHook
 */
export function useSubscribe(): SubscribeHook {
  const subscriber = useRef<Subscribe>();
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const publish = useRef(subscriber.current?.subscribe.bind(subscriber.current)).current;
  const mute = useRef(subscriber.current?.mute.bind(subscriber.current)).current;
  const unpublish = useRef(subscriber.current?.subscribe.bind(subscriber.current)).current;

  useEffect(() => {
    subscriber.current = new Subscribe('');
    subscriber.current.on('muteChanged', () => {
      setAudioMuted(subscriber.current?.audioMuted);
      setVideoMuted(subscriber.current?.videoMuted);
    });
  }, []);

  return {
    audioMuted,
    videoMuted,
    publish,
    mute,
    unpublish,
    getPeerConnection: () => subscriber.current?.pc,
  };
}
