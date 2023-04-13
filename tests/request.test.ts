import jwt from 'jsonwebtoken';
import { TextEncoder } from 'web-encoding';
import type {PushParameters} from '../src/request';
import {pushRequest} from '../src/request';
import {publishSDP} from './moke-sdp';
import {AppID, AppKey} from './config';


const StreamID = '8b91567b-b7cc-4303-8a0f-309ea9fc43ef';
const SessionID = 'dd4d9cf9-00f9-4093-b188-9f91e4815708';

const textEncoder = new TextEncoder();
const privateKey = textEncoder.encode(AppKey);

test('publish http request', async () => {

  const exp = Math.floor(Date.now() / 1000) + 3600;
  const action = "pub";
  const payload: any = {
    version: "1.0",
    appID: AppID,
    streamID: StreamID,
    action,
    exp,
    enableSubAuth: true,
  };

  const token = jwt.sign(payload, privateKey, {algorithm: 'HS256', noTimestamp: true});
  const requestData: PushParameters = {
    StreamID,
    AppID,
    SessionID,
    token,
    sdp: publishSDP,
  };
  expect(pushRequest(requestData)).resolves.toHaveReturned();

})
