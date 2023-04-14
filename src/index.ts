import { useState } from 'react';
import Publisher from './publish';

export function usePublish(audio: MediaStreamTrack, video: MediaStreamTrack, token: string) {

  const publisher = new Publisher(audio, video, token);
  const [state, setState] = useState(publisher.state);
  const [audioMuted, setAudioMuted] = useState(publisher.audioMuted);
  const [videoMuted, setVideoMuted] = useState(publisher.videoMuted);

  publisher.on('connectionstatechange', () => {
    setState(publisher.state);
  });

  publisher.on('muteChanged', () => {
    setAudioMuted(publisher.audioMuted);
    setVideoMuted(publisher.videoMuted);
  });

  return { 
    state,
    audioMuted,
    videoMuted,
    mute: publisher.mute.bind(publisher),
    delete: publisher.unpublish.bind(publisher)
  };
}