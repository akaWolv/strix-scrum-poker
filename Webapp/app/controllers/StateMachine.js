'use strict';

import React from 'react';
import Socket from '../handlers/SocketSession'
import RoomActions from '../actions/RoomActions'
// import UserStore from '../stores/UserStore';
// import RoomStore from '../stores/RoomStore';
// import UserConstants from '../constants/UserConstants';
import StatesConstants from '../constants/StatesConstants';
// import RoomConstants from '../constants/RoomConstants';
import Cookies from 'cookies-js';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// import RoomActions from '../actions/RoomActions';

import Welcome from '../components/Welcome.jsx'
// import WelcomeUser from '../components/WelcomeUser.jsx'
import UserDetails from '../components/UserDetails.jsx'
// import LoginUser from '../components/LoginUser.jsx'
// import PreviewRoom from '../components/PreviewRoom.jsx'
import RoomJoin from '../components/RoomJoin.jsx'
import Room from '../components/Room.jsx'
// import Voting from '../components/default.jsx'
// import Results from '../components/default.jsx'
// import NoMatch from '../components/default.jsx'
// import NoAccess from '../components/NoAccess.jsx'
import Connecting from '../components/Connecting.jsx'
import ConnectionProblem from '../components/ConnectionProblem.jsx'
import RoomCreate from '../components/RoomCreate.jsx'
import RoomStore from "../stores/RoomStore";


const _pathList = [];
var _pathName = undefined;

class StateMachine extends React.Component {
    constructor(props) {
        console.log('state machine constructed');
        super(props);

        // keep last 5 states
        browserHistory.listen(function (ev) {
            _pathName = ev.pathname;
            _pathList.unshift(_pathName);
            _pathList.slice(0, 5);
        });

        // when NOT Connected
        if (Socket.session.connected === false) {
            // display temporary page
            if (StateMachine.getCurrentPath() !== StatesConstants.CONNECTING
                && StateMachine.getCurrentPath() !== StatesConstants.CONNECTION_PROBLEM) {
                StateMachine.changeState(StatesConstants.CONNECTING);
            }

            Socket.session.on('connect', function() {
                if (
                    undefined !== _pathList[1]
                    && StatesConstants.CONNECTION_PROBLEM !== _pathList[1]
                    && StatesConstants.CONNECTING !== _pathList[1]
                ) {
                    // go back to previous page
                    StateMachine.changeState(_pathList[1]);
                } else {
                    // there is no previous pages
                    // redirect to main page
                    StateMachine.changeState(StatesConstants.WELCOME);
                }

                // console.log('connected');
                // console.log(RoomStore.isJoined());
                // console.log(RoomStore.getRoomId());
                // if (RoomStore.isJoined() === false && RoomStore.getRoomId() !== undefined) {
                //     RoomActions.joinRoomById(RoomStore.getRoomId());
                // }
            });
        }

        // DISCONNECT - from Server
        Socket.session.on('disconnect', function(err) {
            console.log('DISCONNECTDISCONNECTDISCONNECTDISCONNECTDISCONNECT');
            console.error(err);

            if (StateMachine.getCurrentPath() !== StatesConstants.CONNECTION_PROBLEM) {
                // StateMachine.changeState(StatesConstants.CONNECTION_PROBLEM);
            }
        });
    }

    static changeState(state) {
        console.log('--------------------------');
        console.log(StateMachine.getCurrentPath() + " <- old vs. new -> " + state);
        console.log('--------------------------');

        if (StateMachine.getCurrentPath() !== state) {
            browserHistory.push(state);
        } else {
            console.log('xxx - no change state - xxx');
        }
    }

    static getCurrentPath() {
        return _pathName;
    }

    render() {
        return (
            <Router history={browserHistory}>
                <Route path={StatesConstants.MAIN} component={Welcome}/>
                <Route path={StatesConstants.WELCOME} component={Welcome}/>
                <Route path={StatesConstants.CONNECTING} component={Connecting}/>
                <Route path={StatesConstants.CONNECTION_PROBLEM} component={ConnectionProblem}/>

                <Route path={StatesConstants.ROOM_CREATE} component={RoomCreate}/>
                <Route path={StatesConstants.ROOM_JOIN} component={RoomJoin}/>
                <Route path={StatesConstants.ROOM_JOIN_ALTERNATIVE} component={RoomJoin}/>
                <Route path={StatesConstants.ROOM} component={Room}/>

                <Route path={StatesConstants.USER_DETAILS} component={UserDetails}/>

                {/*<Route path={StatesConstants.ROOM_JOIN} component={RoomJoin}/>*/}
                {/*<Route path={StatesConstants.ROOM_DISPLAY} component={RoomDisplay}/>*/}
            </Router>
        )
    }
}

export default StateMachine;
