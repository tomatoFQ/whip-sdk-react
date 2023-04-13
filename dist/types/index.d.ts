import Publisher from './publish';
export declare const useSubscribe: (streamId: string, token: string) => Publisher;
export declare const usePublish: (streamId: string, token: string, track: MediaStreamTrack) => Publisher;
