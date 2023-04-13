import jwt from 'jsonwebtoken';

export interface TokenParameters {
  AppID: string;
  StreamID: string;
  Action: string;
  PullAuth?: boolean;
  AppKey?: string;
}

// 生成token
export async function generateToken({
                                      AppID,
                                      StreamID,
                                      Action,
                                      PullAuth,
                                      AppKey,
                                    }: TokenParameters) {
  const textEncoder = new TextEncoder();
  const privateKey = textEncoder.encode(AppKey);

  const exp = 1681207262;
  const action = "pub";
  const payload: any = {
    version: "1.0",
    appID: AppID,
    streamID: StreamID,
    action,
    exp,
  };
  if (Action === "pub") {
    payload.enableSubAuth = !!PullAuth;
  }
  const token = jwt.sign({data: payload}, privateKey, {algorithm: 'HS256'});
  return token;
}
