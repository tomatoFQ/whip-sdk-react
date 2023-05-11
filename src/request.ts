import post from 'axios';
import {v4 as uuid} from 'uuid';

const Domain = 'test-openrtc.eaydu.com';
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

// 推流请求
export const pushRequest = ({
                              AppID,
                              StreamID,
                              token,
                              SessionID = uuid(),
                              sdp,
                              MuteAudio = false,
                              MuteVideo = false,
                            }: PushParameters): Promise<ResponseParams> => {
  const url = `https://${Domain}/pub/${AppID}/${StreamID}?SessionID=${SessionID}&MuteAudio=${MuteAudio}&MuteVideo=${MuteVideo}`;
  return post(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/sdp",
      Authorization: `Bearer ${token}`,
    },
    data: sdp,
  }).then(async (r) => {
    if (r.status !== 201) {
      const code = r.status;
      throw new Error(`${r.data  } 错误码：${  code}`);
    }
    const answerSdp = await r.data;
    const {location} = r.headers;
    return { sdp: answerSdp, location } as ResponseParams;
  });
};

// 拉流请求
export const pullRequest = ({
                              AppID,
                              StreamID,
                              token,
                              SessionID = uuid(),
                              sdp,
                              MuteAudio = false,
                              MuteVideo = false,
                            }: PullParameters): Promise<ResponseParams> => {

  const requestInit: any = {
    method: "POST",
    headers: {
      "Content-Type": "application/sdp",
    },
    data: sdp,
  };
  if (token) {
    requestInit.headers.Authorization = `Bearer ${token}`;
  }
  const url = `https://${Domain}/sub/${AppID}/${StreamID}?SessionID=${SessionID}&MuteAudio=${MuteAudio}&MuteVideo=${MuteVideo}`;
  return post(url, requestInit).then(async (r) => {
    if (r.status !== 201) {
      const b = r.status;
      throw new Error(`${r.data  } 错误码：${  b}`);
    }
    const answerSdp = await r.data;
    const {location} = r.headers;
    return { sdp: answerSdp, location } as ResponseParams;
  });
};

export const deleteRequest = (location: string) => post(location, {
    method: "DELETE",
  });

export const updateRequest = async (
  location: string,
  config: { MuteAudio: boolean; MuteVideo: boolean },
) => post(location, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(config),
  }).then(async (r) => {
    if (r.status !== 200) {
      const msg = await r.data;
      const code = r.status;
      throw new Error(`${msg  } 错误码：${  code}`);
    }
  });
