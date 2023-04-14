export declare function usePublish(audio: MediaStreamTrack, video: MediaStreamTrack, token: string): {
    state: "closed" | "connected" | "connecting" | "disconnected" | "failed" | "new";
    audioMuted: boolean;
    videoMuted: boolean;
    mute: any;
    delete: any;
};
