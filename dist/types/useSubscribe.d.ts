export declare const useSubscribe: (Token: string) => {
    videoTrack: MediaStreamTrack;
    audioTrack: MediaStreamTrack;
    state: number;
    mute: (mute: boolean, kind: 'video' | 'audio') => void;
};
