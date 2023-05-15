import {useState, useEffect, useRef} from 'react';
import Publisher from './publish';
import Subscriber from './subscribe';

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

  useEffect(() => {
    publisher.on('muteChanged', () => {
      setAudioMuted(publisher.audioMuted);
      setVideoMuted(publisher.videoMuted);
    });
  }, [publisher])


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
  subscribe: () => MediaStream;
  mute: typeof Subscriber.prototype.mute;
  unsubscribe: typeof Subscriber.prototype.unsubscribe;
  getPeerConnection: () => RTCPeerConnection;
}


/**
 * @return SubscribeHook
 */
export function useSubscribe(token: string): SubscribeHook {
  const subscriber = useRef(new Subscriber(token)).current;
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const mute = subscriber.mute.bind(subscriber);
  const unsubscribe = subscriber.unsubscribe.bind(subscriber);

  const stream = new MediaStream();
  const subscribe = () => {
    subscriber.on('trackAdded', (track: MediaStreamTrack) => {
      stream.addTrack(track);
    });
    subscriber.subscribe();
    return stream;
  }
  useEffect(() => {
    subscriber.on('muteChanged', () => {
      setAudioMuted(subscriber.audioMuted);
      setVideoMuted(subscriber.videoMuted);
    });
  }, []);

  return {
    audioMuted,
    videoMuted,
    subscribe,
    mute,
    unsubscribe,
    getPeerConnection: () => subscriber.pc,
  };
}
