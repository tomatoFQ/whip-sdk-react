export interface RequestParams {
    AppID: string;
    StreamID: string;
    SessionID?: string;
    sdp: string;
    MuteAudio?: boolean;
    MuteVideo?: boolean;
}
export interface ResponseParams {
    sdp: string;
    location: string;
}
export interface PushParameters extends RequestParams {
    token: string;
}
export interface PullParameters extends RequestParams {
    token?: string;
}
export declare const pushRequest: ({ AppID, StreamID, token, SessionID, sdp, MuteAudio, MuteVideo, }: PushParameters) => Promise<ResponseParams>;
export declare const pullRequest: ({ AppID, StreamID, token, SessionID, sdp, MuteAudio, MuteVideo, }: PullParameters) => Promise<ResponseParams>;
export declare const deleteRequest: (location: string) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const updateRequest: (location: string, config: {
    MuteAudio: boolean;
    MuteVideo: boolean;
}) => Promise<void>;
