'use strict';

var react = require('react');
var node_events = require('node:events');

class Publisher extends node_events.EventEmitter {
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
    const [state, setState] = react.useState(0);
    return new Publisher(streamId, token, new MediaStreamTrack(), setState);
};
const usePublish = (streamId, token, track) => {
    const [state, setState] = react.useState(0);
    return new Publisher(streamId, token, track, setState);
};

exports.usePublish = usePublish;
exports.useSubscribe = useSubscribe;
//# sourceMappingURL=index.js.map
