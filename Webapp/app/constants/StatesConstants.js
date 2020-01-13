export default {
    MAIN: '/',
    WELCOME: '/welcome',
    NO_MATCH: '*',
    CONNECTING: '/connecting',
    CONNECTION_PROBLEM: '/connection_problem',

    ROOM: '/room/:room_id',
    ROOM_CREATE: '/create_room',
    ROOM_JOIN_ALTERNATIVE: '/room',
    ROOM_JOIN: '/join_room',
    // ROOM_JOIN: '/create_room',
    // USER_DETAILS: '/user_details/:autoregister',
    // USER_DETAILS: '/user_details',
    USER_DETAILS: '/room/:room_id/user_details',
    ROOM_DISPLAY: '/display_room'
};
