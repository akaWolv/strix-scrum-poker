import Socket from "../handlers/SocketSession";
import PokerStore from "../stores/PokerStore";

var PokerActions = {
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
        const user_id = PokerStore.getUserId();
        Socket.session.emit('join_room', {id, user_id});
        console.log('+++++++++++++++++');
    },

    /**
     * @param name
     * @param password
     */
    previewRoomByNameAndPassword: function(name, password) {
        Socket.session.emit('preview_room', {name, password});
    },
    /**
     * @param id
     */
    previewRoomById: function(id) {
        Socket.session.emit('preview_room', {id});
    },

    // ----
    // USER
    // ----

    /**
     * @param name
     * @param room_id
     */
    registerNewUser: function(name, room_id) {
        Socket.session.emit('register_new_user', {name, room_id});
    },
    /**
     * @param id
     */
    registerUserById: function(id) {
        Socket.session.emit('register_user_by_id', {id});
    },
};

export default PokerActions;
