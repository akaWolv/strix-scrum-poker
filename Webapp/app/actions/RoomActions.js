import AppDispatcher from '../dispatcher/AppDispatcher';
import RoomConstants from '../constants/RoomConstants';
import Socket from "../handlers/SocketSession";

var RoomActions = {
    create: function(details) {
        const {name, password, sequence} = details;
        Socket.session.emit('create_room', {name, password, sequence});
    },

    joinRoomByNameAndPassword: function(name, password) {
        Socket.session.emit('join_room_by_name_and_pass', {name, password});
    },
    leaveRoom: function(id) {
        Socket.session.emit('leave_room', {id});
    },
    joinRoomById: function(id) {
        console.log('>>>>>>>>>>>>>>>');
        Socket.session.emit('join_room', {id});
        console.log('+++++++++++++++++');
        // AppDispatcher.handleViewAction(RoomConstants.ACTION_JOIN_ROOM_BY_ID, {id: id});
    },

    // ----
    // USER
    // ----

    /**
     * @param name
     * @param room_id
     */
    registerNewUser: function(name, room_id) {
        AppDispatcher.handleViewAction(RoomConstants.ACTION_REGISTER_NEW_USER, {name, room_id});
    },
    /**
     * @param id
     */
    registerUserById: function(id) {
        // AppDispatcher.handleViewAction(RoomConstants.ACTION_REGISTER_USER_BY_ID, {id});
        // Socket.session.emit('register_user_by_id', {id: payload.details.id});
        Socket.session.emit('register_user_by_id', {id});
    },
};

export default RoomActions;
