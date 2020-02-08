'use strict';

import React from 'react';
import Socket from '../handlers/SocketSession'
import StatesConstants from '../constants/StatesConstants';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import Welcome from '../components/Welcome.jsx'
import UserDetails from '../components/UserDetails.jsx'
import RoomJoin from '../components/RoomJoin.jsx'
import Room from '../components/Room.jsx'
import Connecting from '../components/Connecting.jsx'
import ConnectionProblem from '../components/ConnectionProblem.jsx'
import RoomCreate from '../components/RoomCreate.jsx'

import PreviewRoomJoin from '../components/PreviewRoomJoin.jsx'
import PreviewRoomSpectate from '../components/PreviewRoomSpectate.jsx'


const _pathList = [];
var _pathName = undefined;

class StateMachine extends React.Component {
    constructor(props) {
        console.log('state machine constructed');
        super(props);

        this.state = {
            socket_connected: false
        };

        // keep last 5 states
        browserHistory.listen(function (ev) {
            _pathName = ev.pathname;
            _pathList.unshift(_pathName);
            _pathList.slice(0, 5);
        });

        // when NOT Connected
        if (Socket.session.connected === false) {
            Socket.session.on('connect', function() {
                this.setState({socket_connected: true});
            }.bind(this));
        }

        // DISCONNECT - from Server
        Socket.session.on('disconnect', function(err) {
            this.setState({socket_connected: false});
        }.bind(this));
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
        return true === Socket.session.connected ? (
            <Router history={browserHistory}>
                <Route path={StatesConstants.MAIN} component={Welcome}/>
                <Route path={StatesConstants.WELCOME} component={Welcome}/>
                {/*<Route path={StatesConstants.CONNECTING} component={Connecting}/>*/}
                <Route path={StatesConstants.CONNECTION_PROBLEM} component={ConnectionProblem}/>

                <Route path={StatesConstants.ROOM_CREATE} component={RoomCreate}/>
                <Route path={StatesConstants.ROOM_JOIN} component={RoomJoin}/>
                <Route path={StatesConstants.ROOM_JOIN_ALTERNATIVE} component={RoomJoin}/>
                <Route path={StatesConstants.ROOM} component={Room}/>

                <Route path={StatesConstants.USER_DETAILS} component={UserDetails}/>

                <Route path={StatesConstants.ROOM_PREVIEW_JOIN} component={PreviewRoomJoin}/>
                <Route path={StatesConstants.ROOM_PREVIEW_ID} component={PreviewRoomSpectate}/>
            </Router>
        ) : <Connecting />;
    }
}

export default StateMachine;
