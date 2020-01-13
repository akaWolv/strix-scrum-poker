import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import RoomConstants from '../constants/RoomConstants';
import uuid from 'uuid';
import RoomActions from '../actions/RoomActions';
import Socket from '../handlers/SocketSession'
import Cookies from 'cookies-js';
import StoreMixin from '../mixins/StoreMixin';
import StateMachine from "../controllers/StateMachine";
import StatesConstants from "../constants/StatesConstants";
import RoomStore from "./RoomStore";

var _userDetails = {
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
    UserStore.emit(RoomConstants.EVENT_USER_DETAILS);
}

var UserStore = Object.assign({}, StoreMixin, EventEmitter.prototype, {

    getUserId: function () {
        return _userDetails.id;
    },
    getUserName: function () {
        return _userDetails.name;
    },
    getRoomId: function () {
        return _userDetails.room_id;
    },

    getUserDetails: function () {
        return _userDetails;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.action) {
            // case RoomConstants.ACTION_REGISTER_USER_BY_ID:
            //     Socket.session.emit('register_user_by_id', {id: payload.details.id});
            //     break;
            case RoomConstants.ACTION_REGISTER_USER_BY_NAME_AND_PASSWORD:
                Socket.session.emit('register_user_by_id', {name: payload.details.name, password: payload.details.password});
                break;
            case RoomConstants.ACTION_REGISTER_NEW_USER:
                Socket.session.emit(
                    'register_new_user',
                    {
                        name: payload.details.name,
                        room_id: payload.details.room_id,

                    });
                break;
            case RoomConstants.ACTION_CLEAR_USER_DETAILS:
                clearUserDetails();
                break;

            case RoomConstants.ACTION_FORGET_ABOUT_LAST_VISITED_ROOM:
                //SocketActions.emitForgetAboutLastVisitedRoom();
                Socket.session.emit('forget_about_last_visited_room', {});
                break;
            case RoomConstants.ACTION_REQUEST_USER_DETAILS:
                Socket.session.emit('request_user_details', {id: payload.details.id});
                break;
        }

        return true;
    })
});

Socket.session.on('user_details', function (msg) {
    _userDetails.id = msg.id;
    _userDetails.name = msg.name;
    _userDetails.room_id = undefined !== msg.room_id ? msg.room_id : undefined;

    Cookies
        .set('_userDetails.id', _userDetails.id)
        .set('_userDetails.name', _userDetails.name)
        .set('_userDetails.room_id', _userDetails.room_id);

    console.log('user_details');
    console.log(_userDetails);

    UserStore.emit(RoomConstants.EVENT_USER_DETAILS);
});

Socket.session.on('user_not_found', function () {
    UserStore.emit(RoomConstants.EVENT_USER_NOT_FOUND);
    clearUserDetails();
});

// Socket.session.on('register_user_success', function () {
//     UserStore.emit(RoomConstants.EVENT_USER_REGISTERED);
// });

Socket.session.on('register_user_already_exists', function () {
    UserStore.emit(RoomConstants.EVENT_REGISTER_USER_ALREADY_EXISTS);
});

Socket.session.on('register_user_fail', function () {
    UserStore.emit(RoomConstants.EVENT_USER_REGISTER_FAIL);
});

Socket.session.on('join_room_anonymous', function (msg) {
    console.log('let me try to introduce myself');
    let usersId = Cookies.get('_userDetails.id');
    if (usersId !== undefined) {
        console.log('introduce_myself: found id in cookie try to register: ' + usersId);
        RoomActions.registerUserById(usersId);
    } else {
        console.log('introduce_myself: unknown user - no details saved - redirect to user details');
        StateMachine.changeState(StatesConstants.USER_DETAILS.replace(':room_id', RoomStore.getRoomId()));
    }
});

export default UserStore;
