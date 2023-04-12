

import post from 'axios';

export interface RequestParams {
  Domain: string;
  AppID: string;
  AppKey: string | undefined;
  StreamID: string;
  SessionID: string;
  sdp: string;
  ClientIp?: string;
  MuteAudio?: boolean;
  MuteVideo?: boolean;
  parameter?: string;
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
                              Domain,
                              AppID,
                              StreamID,
                              token,
                              SessionID,
                              sdp,
                              ClientIp,
                              MuteAudio,
                              MuteVideo,
                              parameter,
                            }: PushParameters): Promise<ResponseParams> => {
  const arr: string[] = [];
  parameter?.split("&").map((item) => {
    if (
      item.split("=")[0] !== "Domain" &&
      item.split("=")[0] !== "AppID" &&
      item.split("=")[0] !== "AppKey" &&
      item.split("=")[0] !== "StreamID" &&
      item.split("=")[0] !== ""
    ) {
      arr.push(`&${item}`);
    }
    return item;
  });
  const res = arr.join("");
  const url = ClientIp
    ? `https://${Domain}/pub/${AppID}/${StreamID}?SessionID=${SessionID}&ClientIP=${ClientIp}&MuteAudio=${MuteAudio}&MuteVideo=${MuteVideo}${res}`
    : `https://${Domain}/pub/${AppID}/${StreamID}?SessionID=${SessionID}&MuteAudio=${MuteAudio}&MuteVideo=${MuteVideo}${res}`;
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
    // const location = r.headers.get("location");
    const location = 'r.headers.get("location")';
    return { sdp: answerSdp, location } as ResponseParams;
  });
};

// 拉流请求
export const pullRequest = ({
                              Domain,
                              AppID,
                              StreamID,
                              token,
                              SessionID,
                              sdp,
                              MuteAudio,
                              MuteVideo,
                              ClientIp,
                              // ip,
                              parameter,
                            }: PullParameters): Promise<ResponseParams> => {
  const requestInit: any = {
    method: "POST",
    headers: {
      "Content-Type": "application/sdp",
    },
    body: sdp,
  };
  if (token) {
    requestInit.headers.Authorization = `Bearer ${  token}`;
  }
  const arr: string[] = [];
  parameter?.split("&").map((item) => {
    if (
      item.split("=")[0] !== "mode" &&
      item.split("=")[0] !== "Domain" &&
      item.split("=")[0] !== "AppID" &&
      item.split("=")[0] !== "AppKey" &&
      item.split("=")[0] !== "StreamID" &&
      item.split("=")[0] !== "" &&
      item.split("=")[1] !== ""
    ) {
      arr.push(`&${  item}`);
    }
    return item;
  });
  const res = arr.join("");
  const url = ClientIp
    ? `https://${Domain}/sub/${AppID}/${StreamID}?SessionID=${SessionID}&ClientIP=${ClientIp}&MuteAudio=${MuteAudio}&MuteVideo=${MuteVideo}${res}`
    : `https://${Domain}/sub/${AppID}/${StreamID}?SessionID=${SessionID}&MuteAudio=${MuteAudio}&MuteVideo=${MuteVideo}${res}`;
  return post(url, requestInit).then(async (r) => {
    if (r.status !== 201) {
      const b = r.status;
      throw new Error(`${r.data  } 错误码：${  b}`);
    }
    const answerSdp = await r.data;
    // const location = r.headers.get("location");
    const location = 'r.headers.get("location")';
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
