import io from 'socket.io-client'

const port = window.location.hostname === 'localhost' ? 3003 : window.location.port;

const socket_host = window.location.hostname + ':' + port,
    socket_session = io(
        socket_host,
        {
            origins: "*",
            transports: ['websocket']
        }
    ),
    socket = {
        get session() {
            return socket_session;
        }
    };

export default socket;
