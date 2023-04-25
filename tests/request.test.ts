import { SignJWT } from 'jose';
import { TextEncoder } from 'web-encoding';
import type {PushParameters} from '../src/request';
import {pullRequest, pushRequest} from '../src/request';
import {publishSDP, subscribeOfferSdp} from './moke-sdp';
import {AppID, AppKey} from './config';


const StreamID = '6caf9e90-72be-454f-a93e-ccf0b9b32a70';
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

  const token = await new SignJWT(payload).setProtectedHeader({
    alg: 'HS256',
    typ: "JWT",
  }).sign(privateKey);
  const requestData: PushParameters = {
    StreamID,
    AppID,
    SessionID,
    token,
    sdp: publishSDP,
  };
  const resp = await pushRequest(requestData);
  expect(resp.location).toContain('https://test-openrtc.eaydu.com/resource/bc22d5/6caf9e90-72be-454f-a93e-ccf0b9b32a70?SessionID=bc22d5_6caf9e90-72be-454f-a93e-ccf0b9b32a70_');
  expect(resp.sdp).not.toBeNaN()
})



test('subscribe http request', async () => {

  const exp = Math.floor(Date.now() / 1000) + 3600;
  const action = "sub";
  const payload: any = {
    version: "1.0",
    appID: AppID,
    streamID: StreamID,
    action,
    exp,
    enableSubAuth: true,
  };

  const token = await new SignJWT(payload).setProtectedHeader({
    alg: 'HS256',
    typ: "JWT",
  }).sign(privateKey);
  const requestData: PushParameters = {
    StreamID,
    AppID,
    token,
    sdp: subscribeOfferSdp,
  };
  const resp = await pullRequest(requestData)
  expect(resp.location).toContain('https://test-openrtc.eaydu.com/resource/bc22d5/6caf9e90-72be-454f-a93e-ccf0b9b32a70?SessionID=bc22d5_6caf9e90-72be-454f-a93e-ccf0b9b32a70_');
  expect(resp.sdp).not.toBeNaN()
  // expect(resp).toHaveReturned();

})
