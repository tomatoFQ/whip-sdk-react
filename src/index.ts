import { useRef, useState } from 'react';
import Publisher from './publish';

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