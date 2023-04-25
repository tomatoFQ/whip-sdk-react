import { useRef, useState, useCallback, useEffect } from 'react';
import { EventEmitter } from 'events';
import post from 'axios';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

new TextEncoder();
const decoder = new TextDecoder();

const decodeBase64 = (encoded) => {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};
const decode$1 = (input) => {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = decoder.decode(encoded);
    }
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    try {
        return decodeBase64(encoded);
    }
    catch (_a) {
        throw new TypeError('The input to be decoded is not correctly encoded.');
    }
};

class JOSEError extends Error {
    static get code() {
        return 'ERR_JOSE_GENERIC';
    }
    constructor(message) {
        var _a;
        super(message);
        this.code = 'ERR_JOSE_GENERIC';
        this.name = this.constructor.name;
        (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor);
    }
}
class JWTInvalid extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = 'ERR_JWT_INVALID';
    }
    static get code() {
        return 'ERR_JWT_INVALID';
    }
}

function isObjectLike(value) {
    return typeof value === 'object' && value !== null;
}
function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
        return false;
    }
    if (Object.getPrototypeOf(input) === null) {
        return true;
    }
    let proto = input;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
}

const decode = decode$1;

function decodeJwt(jwt) {
    if (typeof jwt !== 'string')
        throw new JWTInvalid('JWTs must use Compact JWS serialization, JWT must be a string');
    const { 1: payload, length } = jwt.split('.');
    if (length === 5)
        throw new JWTInvalid('Only JWTs using Compact JWS serialization can be decoded');
    if (length !== 3)
        throw new JWTInvalid('Invalid JWT');
    if (!payload)
        throw new JWTInvalid('JWTs must contain a payload');
    let decoded;
    try {
        decoded = decode(payload);
    }
    catch (_a) {
        throw new JWTInvalid('Failed to parse the base64url encoded payload');
    }
    let result;
    try {
        result = JSON.parse(decoder.decode(decoded));
    }
    catch (_b) {
        throw new JWTInvalid('Failed to parse the decoded payload as JSON');
    }
    if (!isObject(result))
        throw new JWTInvalid('Invalid JWT Claims Set');
    return result;
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafeStringify(rnds);
}

const Domain = 'test-openrtc.eaydu.com';
// 推流请求
const pushRequest = ({ AppID, StreamID, token, SessionID = v4(), sdp, MuteAudio = false, MuteVideo = false, }) => {
    const url = `https://${Domain}/pub/${AppID}/${StreamID}?SessionID=${SessionID}&MuteAudio=${MuteAudio}&MuteVideo=${MuteVideo}&ServerIP=47.94.244.188`;
    return post(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/sdp",
            Authorization: `Bearer ${token}`,
        },
        data: sdp,
    }).then((r) => __awaiter(void 0, void 0, void 0, function* () {
        if (r.status !== 201) {
            const code = r.status;
            throw new Error(`${r.data} 错误码：${code}`);
        }
        const answerSdp = yield r.data;
        const { location } = r.headers;
        return { sdp: answerSdp, location };
    }));
};
// 拉流请求
const pullRequest = ({ AppID, StreamID, token, SessionID = v4(), sdp, MuteAudio = false, MuteVideo = false, }) => {
    const requestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/sdp",
        },
        data: sdp,
    };
    if (token) {
        requestInit.headers.Authorization = `Bearer ${token}`;
    }
    const url = `https://${Domain}/sub/${AppID}/${StreamID}?SessionID=${SessionID}&MuteAudio=${MuteAudio}&MuteVideo=${MuteVideo}&ServerIP=47.94.244.188`;
    return post(url, requestInit).then((r) => __awaiter(void 0, void 0, void 0, function* () {
        if (r.status !== 201) {
            const b = r.status;
            throw new Error(`${r.data} 错误码：${b}`);
        }
        const answerSdp = yield r.data;
        const { location } = r.headers;
        return { sdp: answerSdp, location };
    }));
};
const deleteRequest = (location) => post(location, {
    method: "DELETE",
});
const updateRequest = (location, config) => __awaiter(void 0, void 0, void 0, function* () {
    return post(location, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(config),
    }).then((r) => __awaiter(void 0, void 0, void 0, function* () {
        if (r.status !== 200) {
            const msg = yield r.data;
            const code = r.status;
            throw new Error(`${msg} 错误码：${code}`);
        }
    }));
});

class Publisher extends EventEmitter {
    constructor(token) {
        super();
        this.audioMuted = false;
        this.videoMuted = false;
        this.token = token;
    }
    get canPublish() {
        return this.appId && this.streamId && this.token && this.mediaStream && this.pc && this.pc.connectionState === 'new';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const { appID, streamID } = decodeJwt(this.token);
            this.streamId = streamID;
            this.appId = appID;
            this.mediaStream = new MediaStream();
            this.pc = new RTCPeerConnection({
                iceServers: [],
                iceTransportPolicy: "all",
                bundlePolicy: "max-bundle",
                rtcpMuxPolicy: "require",
                // @ts-ignore
                sdpSemantics: "unified-plan",
            });
            this.pc.addEventListener('connectionstatechange', this.emit.bind(this.pc));
        });
    }
    publish(audio, video) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            if (!this.canPublish) {
                throw new Error('Publisher is not ready.');
            }
            if (!audio) {
                throw new Error('Audio track is required.');
            }
            if (!video) {
                throw new Error('Video track is required.');
            }
            this.audio = audio;
            this.video = video;
            this.mediaStream.addTrack(audio);
            this.mediaStream.addTrack(video);
            this.pc.addTransceiver(audio, { direction: 'sendonly', streams: [this.mediaStream] });
            this.pc.addTransceiver(video, { direction: 'sendonly', streams: [this.mediaStream] });
            const offer = yield this.pc.createOffer();
            yield this.pc.setLocalDescription(offer);
            const { sdp, location } = yield pushRequest({
                AppID: this.appId,
                StreamID: this.streamId,
                token: this.token,
                sdp: offer.sdp,
            });
            yield this.pc.setRemoteDescription(new RTCSessionDescription({
                type: "answer",
                sdp,
            }));
            this.location = location;
        });
    }
    unpublish() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pc.connectionState === 'closed') {
                throw new Error('Already unpublished.');
            }
            if (!this.location) {
                throw new Error('Not in publishing. Consider using `publish()` before `unpublish()`.');
            }
            yield deleteRequest(this.location);
            this.location = undefined;
            this.pc.close();
            this.mediaStream.removeTrack(this.audio);
            this.mediaStream.removeTrack(this.video);
            this.mediaStream = undefined;
        });
    }
    mute(muted, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.location) {
                throw new Error('Not in publishing. Consider using `publish()` before `mute()`.');
            }
            if (kind === 'audio' || !kind) {
                this.audioMuted = muted;
            }
            if (kind === 'video' || !kind) {
                this.videoMuted = muted;
            }
            yield updateRequest(this.location, {
                MuteAudio: this.audioMuted,
                MuteVideo: this.videoMuted,
            });
            this.emit('muteChanged');
        });
    }
}

class Subscribe extends EventEmitter {
    constructor(token) {
        super();
        this.audioMuted = false;
        this.videoMuted = false;
        const { appID, streamID } = decodeJwt(token);
        this.streamId = streamID;
        this.appId = appID;
        this.token = token;
        this.createRTCPeerConnection();
    }
    get state() {
        return this.pc.connectionState;
    }
    createRTCPeerConnection() {
        this.pc = new RTCPeerConnection({
            iceServers: [],
            iceTransportPolicy: "all",
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require",
            // @ts-ignore
            sdpSemantics: "unified-plan",
        });
        this.pc.addTransceiver('audio', { direction: 'recvonly' });
        this.pc.addTransceiver('video', { direction: 'recvonly' });
        this.pc.addEventListener('connectionstatechange', this.emit.bind(this.pc));
        this.pc.addEventListener('track', (evt) => {
            if (evt.track) {
                if (evt.track.kind === 'audio') {
                    this.audio = evt.track;
                }
                else {
                    this.video = evt.track;
                }
            }
            this.emit('track', evt.track);
        });
        this.subscribe();
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pc.connectionState !== 'new') {
                throw new Error('Already subscribed.');
            }
            const offer = yield this.pc.createOffer();
            yield this.pc.setLocalDescription(offer);
            const { sdp, location } = yield pullRequest({
                AppID: this.appId,
                StreamID: this.streamId,
                token: this.token,
                SessionID: '',
                sdp: offer.sdp,
            });
            yield this.pc.setRemoteDescription(new RTCSessionDescription({
                type: "answer",
                sdp,
            }));
            this.location = location;
        });
    }
    unsubscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pc.connectionState === 'closed') {
                throw new Error('Already unsubscribed.');
            }
            if (!this.location) {
                throw new Error('Not in subscribing. Consider using `subscribe()` before `unsubscribe()`.');
            }
            yield deleteRequest(this.location);
            this.location = undefined;
            this.pc.close();
        });
    }
    mute(muted, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.location) {
                throw new Error('Not in subscribing. Consider using `subscribe()` before `mute()`.');
            }
            if (kind === 'audio' || !kind) {
                this.audioMuted = muted;
            }
            if (kind === 'video' || !kind) {
                this.videoMuted = muted;
            }
            yield updateRequest(this.location, {
                MuteAudio: this.audioMuted,
                MuteVideo: this.videoMuted,
            });
        });
    }
}

function usePublish(token) {
    const publisher = useRef(new Publisher(token)).current;
    const [audioMuted, setAudioMuted] = useState(publisher.audioMuted);
    const [videoMuted, setVideoMuted] = useState(publisher.videoMuted);
    const publish = useRef(publisher.publish.bind(publisher)).current;
    const mute = useRef(publisher.mute.bind(publisher)).current;
    const unpublish = useRef(publisher.unpublish.bind(publisher)).current;
    publisher.on('muteChanged', () => {
        setAudioMuted(publisher.audioMuted);
        setVideoMuted(publisher.videoMuted);
    });
    return {
        audioMuted,
        videoMuted,
        publish,
        mute,
        unpublish,
        getPeerConnection: () => publisher.pc,
    };
}
function useSubscribe(Token) {
    const [state, setState] = useState('new');
    const [subscriber, setSubscriber] = useState();
    const [videoTrack, setVideoTrack] = useState();
    const [audioTrack, setAudioTrack] = useState();
    const stop = useCallback(() => {
        if (subscriber) {
            subscriber.unsubscribe();
        }
    }, [subscriber]);
    const mute = (isMute, kind) => {
        subscriber.mute(isMute, kind);
    };
    const handleSubscribe = useCallback((track) => {
        if (track.kind === 'video') {
            setVideoTrack(track);
        }
        else {
            setAudioTrack(track);
        }
    }, []);
    const handleConnectionState = useCallback((peerConnectionState) => {
        setState(peerConnectionState);
    }, [state]);
    useEffect(() => {
        const subscribe = new Subscribe(Token);
        subscribe.addListener('track', handleSubscribe);
        subscribe.addListener('connectionstatechange', handleConnectionState);
        setSubscriber(subscribe);
    }, [Token]);
    return { videoTrack, audioTrack, state, mute, stop };
}

export { usePublish, useSubscribe };
//# sourceMappingURL=index.esm.js.map
