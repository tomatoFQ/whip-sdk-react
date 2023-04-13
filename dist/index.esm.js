import { useState } from 'react';
import { EventEmitter } from 'node:events';

class Publisher extends EventEmitter {
    constructor(streamId, token, track, setState) {
        super();
        this.pc = new RTCPeerConnection();
        this.streamId = streamId;
        this.token = token;
        this.track = track;
        this.setState = setState;
    }
}

const useSubscribe = (streamId, token) => {
    const [state, setState] = useState(0);
    return new Publisher(streamId, token, new MediaStreamTrack(), setState);
};
const usePublish = (streamId, token, track) => {
    const [state, setState] = useState(0);
    return new Publisher(streamId, token, track, setState);
};

export { usePublish, useSubscribe };
//# sourceMappingURL=index.esm.js.map
