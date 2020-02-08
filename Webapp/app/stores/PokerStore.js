import {EventEmitter} from 'events';
import RoomConstants from '../constants/RoomConstants';
import StoreMixin from '../mixins/StoreMixin';

import Socket from '../handlers/SocketSession'
import StateMachine from "../controllers/StateMachine";
import StatesConstants from "../constants/StatesConstants";
import Cookies from "cookies-js";

const _roomDetails = {
    id: undefined,
    name: undefined,
    sequence: undefined,
    admin: undefined,
    users: {},
    voting_status: undefined,
    password: undefined
}, _userDetails = {
    id: Cookies.get('_userDetails.id'),
    name: Cookies.get('_userDetails.name'),
    room_id: Cookies.get('_userDetails.room_id')
};

function clearUserDetails() {
    _userDetails.id = undefined;
    _userDetails.name = undefined;
    _userDetails.room_id = undefined;
    Cookies.expire('_userDetails.id');
    Cookies.expire('_userDetails.name');
    Cookies.expire('_userDetails.room_id');
    PokerStore.emit(RoomConstants.EVENT_USER_DETAILS);
}

const PokerStore = Object.assign({}, StoreMixin, EventEmitter.prototype, {
    // SETTERS
    setRoomId: function (room_id) {
        _roomDetails.id = room_id;
    },

    setRoomDetails: function (roomDetails) {
        const {
            id,
            name,
            sequence,
            admin,
            users,
            voting_status,
            password
        } = roomDetails;

        _roomDetails.id = id;
        _roomDetails.name = name;
        _roomDetails.sequence = sequence;
        _roomDetails.admin = admin;
        _roomDetails.users = users;
        _roomDetails.voting_status = voting_status;
        _roomDetails.password = password;

        PokerStore.emit(RoomConstants.EVENT_ROOM_DETAILS_UPDATE);
    },

    setUserDetails: function (id, name, roomId) {
        _userDetails.id = id;
        _userDetails.name = name;
        _userDetails.room_id = roomId;

        Cookies
            .set('_userDetails.id', _userDetails.id)
            .set('_userDetails.name', _userDetails.name)
            .set('_userDetails.room_id', _userDetails.room_id);

        PokerStore.emit(RoomConstants.EVENT_USER_DETAILS);
        return _userDetails;
    },

    // GETTERS
    getRoomDetails: function () {
        return _roomDetails;
    },
    getRoomId: function () {
        return _roomDetails.id;
    },
    getUserId: function () {
        return _userDetails.id;
    },
    getUserName: function () {
        return _userDetails.name;
    },
});

Socket.session.on('join_room_success', function (msg) {
    if (undefined !== msg.id) {
        StateMachine.changeState(StatesConstants.ROOM.replace(':room_id', msg.id));
        PokerStore.setRoomDetails(msg);
    }
});

Socket.session.on('join_room_preview', function (msg) {
    if (undefined !== msg.id) {
        StateMachine.changeState(StatesConstants.ROOM_PREVIEW_ID.replace(':room_id', msg.id));
        PokerStore.setRoomDetails(msg);
    }
});

Socket.session.on('room_not_found', function () {
    PokerStore.emit(RoomConstants.EVENT_ROOM_NOT_FOUND);
});

Socket.session.on('join_room_anonymous', function (msg) {
    console.log(' >>>> join_room_anonymous');
    if (null !== msg && undefined !== msg.id) {
        clearUserDetails();
        StateMachine.changeState(StatesConstants.ROOM.replace(':room_id', msg.id));
        PokerStore.setRoomDetails(msg);
    }
});

Socket.session.on('room_details', function (msg) {
    PokerStore.setRoomDetails(msg);
});

Socket.session.on('join_room_preview', function (msg) {
    PokerStore.setRoomDetails(msg);
});

Socket.session.on('user_details', function (msg) {
    console.log('register_user_success');
    PokerStore.setUserDetails(
        msg.id,
        msg.name,
        undefined !== msg.room_id ? msg.room_id : undefined
    );
});

Socket.session.on('user_not_found', function () {
    PokerStore.emit(RoomConstants.EVENT_USER_NOT_FOUND);
    clearUserDetails();
});

Socket.session.on('register_user_already_exists', function () {
    PokerStore.emit(RoomConstants.EVENT_REGISTER_USER_ALREADY_EXISTS);
});

Socket.session.on('register_user_fail', function () {
    PokerStore.emit(RoomConstants.EVENT_USER_REGISTER_FAIL);
    StateMachine.changeState(StatesConstants.USER_DETAILS);
});

export default PokerStore;
