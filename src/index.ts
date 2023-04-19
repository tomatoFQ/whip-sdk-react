import { useState } from 'react';
import Publisher from './publish';

export interface PublishHook {
  audioMuted: boolean;
  videoMuted: boolean;
  peerconnection: RTCPeerConnection;
  init: typeof Publisher.prototype.init;
  publish: typeof Publisher.prototype.publish;
  mute: typeof Publisher.prototype.mute;
  unpublish: typeof Publisher.prototype.unpublish;
}
export function usePublish(): PublishHook {

  const publisher = new Publisher();
  const [audioMuted, setAudioMuted] = useState(publisher.audioMuted);
  const [videoMuted, setVideoMuted] = useState(publisher.videoMuted);

  publisher.on('muteChanged', () => {
    setAudioMuted(publisher.audioMuted);
    setVideoMuted(publisher.videoMuted);
  });

  return { 
    audioMuted,
    videoMuted,
    peerconnection: publisher.pc,
    init: publisher.init.bind(publisher),
    publish: publisher.publish.bind(publisher),
    mute: publisher.mute.bind(publisher),
    unpublish: publisher.unpublish.bind(publisher)
  };
}