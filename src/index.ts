import { useState } from 'react';
import Publisher from './publish';

export function usePublish() {

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
    delete: publisher.unpublish.bind(publisher)
  };
}