import io from 'socket.io-client'

const socket_host = window.location.hostname + ':' + location.port,
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
