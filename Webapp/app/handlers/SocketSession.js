// var socket_host = window.location.hostname + ':3003';
// var socket = require('socket.io-client')(socket_host);
//
// export default socket;
// const socket_host = window.location.hostname + ':3003';
// const socketConnection = io(socket_host);
//
// export default socketConnection;

import io from 'socket.io-client'

const socket_host = window.location.hostname + ':3003';
// const socket_session = require('socket.io-client')(socket_host);
const socket_session = io(
    socket_host,
    {
        origins: "*",
        transports: ['websocket']
    }
);


const socket = {
    get session() {
        return socket_session;
    }
};

export default socket;
