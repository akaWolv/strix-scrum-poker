'use strict';

import React from 'react';
import {
    Router,
    Route
} from 'react-router-dom';
import history from '../handlers/History';

import Socket from '../handlers/SocketSession'
import StatesConstants from '../constants/StatesConstants';

import Welcome from '../components/Welcome.jsx'
import UserDetails from '../components/UserDetails.jsx'
import RoomJoin from '../components/RoomJoin.jsx'
import Room from '../components/Room.jsx'
import Connecting from '../components/Connecting.jsx'
import ConnectionProblem from '../components/ConnectionProblem.jsx'
import RoomCreate from '../components/RoomCreate.jsx'

import PreviewRoomJoin from '../components/PreviewRoomJoin.jsx'
import PreviewRoomSpectate from '../components/PreviewRoomSpectate.jsx'

class StateMachine extends React.Component {
    constructor(props) {
        // console.log('state machine constructed');
        super(props);

        this.state = {
            socket_connected: false
        };

        this.listeners = [
            // when NOT Connected
            Socket.session.on('connect', function() {
                this.setState({socket_connected: true});
            }.bind(this)),
            // DISCONNECT - from Server
            Socket.session.on('disconnect', function(err) {
                this.setState({socket_connected: false});
            }.bind(this))
        ]
    }

    componentWillUnmount() {
        for (let k in this.listeners) {
            if (undefined !== this.listeners[k].removeListener) {
                this.listeners[k].removeListener()
            }
        }
    }

    render() {
        return true === Socket.session.connected ? (
            <Router history={history}>
                <div id="container">
                    <Route exact path={StatesConstants.MAIN} component={Welcome}/>
                    <Route exact path={StatesConstants.WELCOME} component={Welcome}/>
                    {/*<Route exact path={StatesConstants.CONNECTING} component={Connecting}/>*/}
                    <Route exact path={StatesConstants.CONNECTION_PROBLEM} component={ConnectionProblem}/>

                    <Route exact path={StatesConstants.ROOM_CREATE} component={RoomCreate}/>
                    <Route exact path={StatesConstants.ROOM_JOIN} component={RoomJoin}/>
                    <Route exact path={StatesConstants.ROOM_JOIN_ALTERNATIVE} component={RoomJoin}/>
                    <Route exact path={StatesConstants.ROOM} component={Room}/>

                    <Route exact path={StatesConstants.USER_DETAILS} component={UserDetails}/>

                    <Route exact path={StatesConstants.ROOM_PREVIEW_JOIN} component={PreviewRoomJoin}/>
                    <Route exact path={StatesConstants.ROOM_PREVIEW_ID} component={PreviewRoomSpectate}/>
                </div>
            </Router>
        ) : <Connecting />;
    }
}

export default StateMachine;
