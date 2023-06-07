# WHIP WebRTC Low-Latency Live Streaming SDK

This project is a low-latency live streaming SDK based on WHIP (WebRTC-HTTP ingestion protocol) and WebRTC technologies, designed to provide integration support for live streaming functionality in React projects.

## React Hooks
|Hooks|Parameter|Return|
|-|-|-|
|usePublish|[`token: string`](#how-to-get-token)|[`PublishHook`](#PublishHook)|
|useSubscribe|[`token: string`](#how-to-get-token)|[`SubscribeHook`](#SubscribeHook)|

- <code id="PublishHook">PublishHook</code>
```typescript
interface PublishHook {

  // Audio state
  audioMuted: boolean;

  // Video state
  videoMuted: boolean;

  publish(audio: MediaStreamTrack, video: MediaStreamTrack): Promise<void>;

  mute(muted: boolean, kind?: 'audio' | 'video'): Promise<void>;

  unpublish(): Promise<void>;

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
   */
  getPeerConnection(): RTCPeerConnection;
}
```

- <code id="SubscribeHook">SubscribeHook</code>
```typescript
interface SubscribeHook {

  // Audio state
  audioMuted: boolean;

  // Video state
  videoMuted: boolean;

  subscribe(): MediaStream;

  mute(muted: boolean, kind?: 'audio' | 'video'): Promise<void>;

  unsubscribe(): Promise<void>;

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
   */
  getPeerConnection(): RTCPeerConnection;
}
```

## Quick Start

Here is a quick guide to integrating the WHIP WebRTC Low-Latency Live Streaming SDK into your React project:

1. Ensure that Node.js and npm are installed in your project.

2. In the root directory of your project, run the following command to install the dependencies:

```shell
npm install whip-sdk-react
```

3. In the component where you want to use the live streaming functionality, import the `usePublish` and `useSubscribe` hooks:

```javascript
import { usePublish, useSubscribe } from 'whip-sdk-react';
```

4. Use the `usePublish` hook in your component to implement publishing stream functionality:

```javascript
function MyPublishComponent() {
  const { audioMuted, videoMuted, publish, mute, unpublish, getPeerConnection } = usePublish("YOUR_PUBLISH_TOKEN");

  // Call the publish method to publish the audio and video streams
  const handlePublish = async () => {
    const audioTrack = /* get the audio MediaStreamTrack */;
    const videoTrack = /* get the video MediaStreamTrack */;
    await publish(audioTrack, videoTrack);
  };

  // Call the mute method to mute/unmute the audio or video stream
  const handleMuteAudio = async () => {
    await mute(!audioMuted, 'audio');
  };

  const handleMuteVideo = async () => {
    await mute(!videoMuted, 'video');
  };

  // Call the unpublish method to stop publishing the audio and video streams
  const handleUnpublish = async () => {
    await unpublish();
  };

  return (
    <div>
      <button onClick={handlePublish}>Start Publishing</button>
      <button onClick={handleMuteAudio}>
        {audioMuted ? 'Unmute Audio' : 'Mute Audio'}
      </button>
      <button onClick={handleMuteVideo}>
        {videoMuted ? 'Unmute Video' : 'Mute Video'}
      </button>
      <button onClick={handleUnpublish}>Stop Publishing</button>
    </div>
  );
}
```

5. Use the `useSubscribe` hook in your component to implement subscribing to a stream functionality:

```javascript
function MySubscribeComponent() {
  const { audioMuted, videoMuted, subscribe, mute, unsubscribe, getPeerConnection } = useSubscribe("YOUR_SUBSCRIBE_TOKEN");

  // Call the subscribe method to start subscribing to the stream
  const handleSubscribe = () => {
    subscribe();
  };

  // Call the mute method to mute/unmute the audio or video stream
  const handleMuteAudio = async () => {
    await mute(!audioMuted, 'audio');
  };

  const handleMuteVideo = async () => {
    await mute(!videoMuted, 'video');
  };

  // Call the unsubscribe method to stop subscribing to the stream
  const handleUnsubscribe = async () => {
    await unsubscribe();
  };

  return (
    <div>
      <button onClick={handleSubscribe}>Start Subscribing</button>
      <button onClick={handleMuteAudio}>
        {audioMuted ? 'Unmute Audio' : 'Mute Audio'}
      </button>
      <button onClick={handleMuteVideo}>
        {videoMuted ? 'Unmute Video' : 'Mute Video'}
      </button>
      <button onClick={handleUnsubscribe

}>Stop Subscribing</button>
    </div>
  );
}
```

Make sure you have followed the above steps to integrate the WHIP WebRTC Low-Latency Live Streaming SDK into your project. Now you can use the `usePublish` and `useSubscribe` hooks in the appropriate components to implement the live streaming functionality as needed.

## How to Get Token

We use JWT(JSON Web Token) for authorization and authentication purposes. You can generate JWTs using libraries like jsonwebtoken. Here's an example of how you can generate a JWT in your project:

```typescript
import jwt from 'jsonwebtoken';

// Generate a JWT token
const generateToken = (StreamID: string) => {
  const action: 'Pub' | 'Sub' = 'Pub'; // Publish or subscribe.
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const payload = {
    version: '1.0',
    appID: /* Contact Us to get this. We will provide one for free experience */,
    streamID: StreamID,
    action,
    exp,
    enableSubAuth: true,
  };
  const secretKey = /* We will provide you with the AppID together */;
  const token = jwt.sign(payload, secretKey);
  return token;
};

// Use the generated token for authorization
const token = generateToken();
// Include the token in API requests or store it for authentication purposes

```
- Please click [Contact Us](https://talwtn.eaydu.com/contact.html) to obtain the AppID and secret key.
- We strongly recommend that you place the token generation logic on the server-side. If you handle such logic on the client-side, the key is susceptible to easy leakage.

## Demo Experience

We provide an online demo for you to experience the functionality of the WHIP WebRTC Low-Latency Live Streaming SDK. You can access the demo at CodeSandbox:

[Code Sandbox](https://codesandbox.io/embed/whip-demo-djk70f?fontsize=14&hidenavigation=1&theme=dark)

Please follow the instructions on the demo page to explore the live streaming features and learn how to use the SDK.

## Resources

- [WHIP Documentation](https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html)
- [TAL WHIP Demo GitHub Repository](https://github.com/whip-sdk-react)

If you encounter any issues or need further support while using the SDK, please refer to the above resources or contact our support team. [Contact Us](https://talwtn.eaydu.com/contact.html)