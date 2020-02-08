'use strict';

import React from 'react';
import RoomConstants from '../constants/RoomConstants';
import VotingConstants from '../constants/VotingConstants';

import PreviewRoomJoin from '../components/PreviewRoomJoin.jsx';
import RoomActions from "../actions/RoomActions";
import PokerStore from "../stores/PokerStore";
import PreviewRoomSpectate from '../components/PreviewRoomSpectate.jsx';
import VotingStore from "../stores/VotingStore";

class PreviewRoom extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            room_details: undefined,
            users_votes: undefined,
            users_already_voted: undefined
        };

        this.listeners = [
            PokerStore.registerListener(RoomConstants.EVENT_ROOM_DETAILS_UPDATE, this.onChangeRoomDetails.bind(this)),
            VotingStore.registerListener(VotingConstants.EVENT_USERS_ALREADY_VOTED, this.onChangeUsersAlreadyVoted.bind(this)),
            VotingStore.registerListener(VotingConstants.EVENT_USERS_VOTES, this.onChangeUsersVotes.bind(this))
        ];

        if (undefined !== props.routeParams.room_id && undefined === PokerStore.getRoomId()) {
            RoomActions.previewRoomById(props.routeParams.room_id);
        }
    }

    onChangeRoomDetails() {
        console.log('onChangeRoomDetails');
        let roomDetails = PokerStore.getRoomDetails();

        this.setState({
            room_details: {
                room_id: roomDetails.id,
                room_name: roomDetails.name,
                room_sequence: roomDetails.sequence,
                room_admin: roomDetails.admin,
                room_password: roomDetails.password,
                room_users: roomDetails.users,
                voting_status: roomDetails.voting_status,
                user_id: PokerStore.getUserId(),
                user_name: PokerStore.getUserName(),
            }
        });
    }

    componentWillUnmount() {
        for (let k in this.listeners) {
            if (undefined !== this.listeners[k].deregister) {
                this.listeners[k].deregister()
            }
        }
    }


    render() {
        return (
            undefined === this.state.room_details
            ? <PreviewRoomJoin />
            : <PreviewRoomSpectate
                    room_details={this.state.room_details}
                    users_votes={this.state.users_votes}
                    users_already_voted={this.state.users_already_voted}
                />
        );
    }
}

export default PreviewRoom;
