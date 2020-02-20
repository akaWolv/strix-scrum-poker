import React from 'react';
import Paper from '@material-ui/core/Paper';


import RoomConstants from '../constants/RoomConstants';
import PokerActions from '../actions/PokerActions';
import VotingConstants from '../constants/VotingConstants';
import StatesConstants from '../constants/StatesConstants';
import PokerStore from '../stores/PokerStore';
import VotingStore from '../stores/VotingStore';
import VotingAction from '../actions/VotingActions';
import Fab from '@material-ui/core/Fab';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ActionDone from '@material-ui/icons/Done';
import ActionHourGlass from '@material-ui/icons/HourglassEmpty';
import ActionEventSeat from '@material-ui/icons/EventSeat';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import ContentClear from '@material-ui/icons/Clear';
import MapsLocalCafe from '@material-ui/icons/LocalCafe';
import ActionAccessibility from '@material-ui/icons/Accessibility';
import ActionHelpOutline from '@material-ui/icons/HelpOutline';
import {pink, orange, lime, grey, red, lightBlue} from '@material-ui/core/colors';

import Button from '@material-ui/core/Button';
import _ from 'underscore';

import RoomInfoBox from '../components/RoomInfoBox.jsx';
import RoomVotingPanel from './RoomVotingPanel';
import BackBox from '../components/BackBox.jsx';
import Footer from './Footer';
import UserDetails from "./UserDetails.jsx";
import UsersVotesList from "../components/UsersVotesList.jsx";

const styles = {
    paper_info: {
        marginBottom: 10,
        textAlign: 'left'
    },
    text_box_info: {
        padding: 20,
        height: '100%',
        textAlign: 'left'
    },
    text_box_info_details: {
        fontSize: '.8em'
    },

    paper_users_list: {
        textAlign: 'left',
        marginBottom: 10
    },
    paper_users_list_box: {
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 0,
        height: '100%',
        textAlign: 'left'
    },

    no_voting_header: {
        textAlign: 'center',
        color: grey[400]
    },

    admin_box: {
        padding: 20,
        backgroundColor: pink[900],
        marginBottom: 10
    },
    admin_panel_header: {
        textAlign: 'left'
    },
    admin_panel_button: {
        width: '100%'
    }
};

const texts = {
    header: 'Room: ',
    password: 'Passowrd: ',
    admin_name: 'room admin: ',
    voting_status: 'voting status: ',
    connected_info: 'users connected: ',
    user_status: 'Users votes',
    start_new_voting: 'Start new voting',
    stop_voting: 'End voting',
    finish_voting: 'Finish and show values',
    continue_voting: 'Resume',
    admin_panel_header: 'Admin control'
};

class Room extends React.Component {
    constructor(props, context) {
        super(props, context);

        const {room_id} = this.props.match.params;

        if (undefined !== room_id && undefined === PokerStore.getRoomId()) {
            // console.log('lets join ROOOOOOM');
            PokerActions.joinRoomById(room_id);
        }

        let roomDetails = PokerStore.getRoomDetails();
        this.state = {
            room_id: roomDetails.id,
            room_name: roomDetails.name,
            room_password: roomDetails.password,
            room_sequence: roomDetails.sequence,
            room_admin: roomDetails.admin,
            room_users: roomDetails.users,
            voting_status: roomDetails.voting_status,
            users_already_voted: VotingStore.getUsersAlreadyVoted(),
            users_votes: VotingStore.getUsersVotes(),
            highest_vote: VotingStore.getHighestVote(),
            lowest_vote: VotingStore.getLowestVote(),
        };

        this.listeners = [
            PokerStore.registerListener(RoomConstants.EVENT_ROOM_DETAILS_UPDATE, this.onChangeRoomDetails.bind(this)),
            PokerStore.registerListener(RoomConstants.EVENT_USER_DETAILS, this.onChangeUserDetails.bind(this)),
            VotingStore.registerListener(VotingConstants.EVENT_USERS_ALREADY_VOTED, this.onChangeUsersAlreadyVoted.bind(this)),
            VotingStore.registerListener(VotingConstants.EVENT_USERS_VOTES, this.onChangeUsersVotes.bind(this))
        ];
    };

    componentWillUnmount() {
        PokerActions.leaveRoom(this.state.room_id);
        for (let k in this.listeners) {
            this.listeners[k].deregister();
        }
    }

    onChangeUsersVotes() {
        this.setState({
            users_votes: VotingStore.getUsersVotes(),
            highest_vote: VotingStore.getHighestVote(),
            lowest_vote: VotingStore.getLowestVote(),
        });
    }

    onChangeUsersAlreadyVoted() {
        this.setState({users_already_voted: VotingStore.getUsersAlreadyVoted()});
    }

    onChangeUserDetails() {
        this.setState({
            user_id: PokerStore.getUserId(),
            user_name: PokerStore.getUserName()
        });
    }

    onChangeRoomDetails() {
        let roomDetails = PokerStore.getRoomDetails();

        this.detectAdminChange(this.state.room_admin, roomDetails.admin);

        this.setState({
            room_id: roomDetails.id,
            room_name: roomDetails.name,
            room_sequence: roomDetails.sequence,
            room_admin: roomDetails.admin,
            room_password: roomDetails.password,
            room_users: roomDetails.users,
            voting_status: roomDetails.voting_status,
            user_id: PokerStore.getUserId(),
            user_name: PokerStore.getUserName(),
        });
    }

    detectAdminChange(oldValue, newValue) {
        if (undefined !== oldValue && oldValue !== newValue && newValue === PokerStore.getUserId()) {
            alert('You are admin now!');
        }
    }

    handleStartNewVotingButton() {
        VotingAction.startNewVoting();
    }

    handleFinishVoting() {
        VotingAction.finishVoting();
    }

    handleStopVoting() {
        VotingAction.stopVoting();
    }

    handleContinueVoting() {
        VotingAction.continueVoting();
    }

    renderVotingStatusHints() {
        switch (this.state.voting_status) {
            case VotingConstants.STATUS_PENDING:
                return <p>Start collecting users votes.</p>;
            case VotingConstants.STATUS_IN_PROCESS:
                let votes = Object.keys(this.state.users_already_voted || {}).length,
                    users = Object.keys(this.state.room_users).length;
                return <p>Voting status (<span
                    style={{color: votes !== users ? orange['400'] : lime[600]}}>votes: <b>{votes}</b> / users: <b>{users}</b></span>)
                </p>;
            case VotingConstants.STATUS_FINISHED:
                return <p>Continue current voting or finalize it.</p>;
        }
    }

    renderAdminPanel() {
        if (this.state.room_admin === PokerStore.getUserId()) {
            return (
                <Paper style={styles.paper_info} elevation={1}>
                    <div style={styles.admin_box}>
                        <h4 style={styles.admin_panel_header}>
                            {texts.admin_panel_header}
                        </h4>
                        {this.renderVotingStatusHints()}
                        {this.renderAdminPanelButtons()}
                    </div>
                </Paper>
            )
        } else {
            return null;
        }
    }

    renderAdminPanel2() {
        if (
            this.state.room_admin === PokerStore.getUserId()
            && VotingConstants.STATUS_IN_PROCESS === this.state.voting_status
        ) {
            return (
                <Paper style={styles.paper_info} elevation={1}>
                    <div style={styles.admin_box}>
                        <div className="row center-xs">
                            <div className="col-xs-12">
                                <Button
                                    color="primary"
                                    variant="contained"
                                    style={styles.admin_panel_button}
                                    onClick={this.handleFinishVoting.bind(this)}>
                                    {texts.finish_voting}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Paper>
            )
        } else {
            return null;
        }
    }

    renderAdminPanelButtons() {
        switch (this.state.voting_status) {
            case VotingConstants.STATUS_PENDING:
                return (
                    <div className="row center-xs">
                        <div className="col-xs-12">
                            <Button
                                color="primary"
                                variant="contained"
                                style={styles.admin_panel_button}
                                onClick={this.handleStartNewVotingButton.bind(this)}>
                                {texts.start_new_voting}
                            </Button>
                        </div>
                    </div>
                );
            case VotingConstants.STATUS_IN_PROCESS:
                return (
                    <div className="row center-xs">
                        <div className="col-xs-12">
                            <Button
                                color="secondary"
                                variant="outlined"
                                style={styles.admin_panel_button}
                                onClick={this.handleFinishVoting.bind(this)}>
                                {texts.finish_voting}
                            </Button>
                        </div>
                    </div>
                );
            case VotingConstants.STATUS_FINISHED:
                return (
                    <div className="row center-xs">
                        <div className="col-xs-6">
                            <Button
                                color="primary"
                                variant="contained"
                                style={styles.admin_panel_button}
                                onClick={this.handleContinueVoting.bind(this)}>
                                {texts.continue_voting}
                            </Button>
                        </div>
                        <div className="col-xs-6">
                            <Button
                                color="primary"
                                variant="contained"
                                style={styles.admin_panel_button}
                                onClick={this.handleStopVoting.bind(this)}>
                                {texts.stop_voting}
                            </Button>
                        </div>
                    </div>
                );
        }
    }

    render() {
        const {
            room_id,
            user_id,
            room_name,
            room_password,
            room_users,
            voting_status,
            room_admin,
            users_already_voted,
            users_votes,
            highest_vote,
            lowest_vote
        } = this.state;
        let view = null;

        if (undefined === room_id) {
            return <center><br/><br/>Connecting to Room...</center>;
        } else if (undefined === user_id) {
            view = <UserDetails roomId={room_id}/>;
        } else {
            view = (
                <div>
                    <div className="row center-xs">
                        <div className="col-xs-12  col-sm-6  col-md-4">
                            <div className="box">
                                {this.renderAdminPanel()}
                            </div>
                        </div>
                    </div>
                    <div className="row center-xs">
                        <div className="col-xs-12  col-sm-6  col-md-4">
                            <div className="box">
                                <RoomVotingPanel
                                    voting_status={voting_status}/>
                            </div>
                        </div>
                    </div>
                    <div className="row center-xs">
                        <div className="col-xs-12  col-sm-6  col-md-4">
                            <div className="box">
                                <Paper style={styles.paper_users_list} elevation={1}>
                                    <div style={styles.paper_users_list_box}>
                                        <h4>{texts.user_status}</h4>
                                    </div>
                                    <UsersVotesList
                                        room_users={room_users}
                                        voting_status={voting_status}
                                        users_already_voted={users_already_voted}
                                        users_votes={users_votes}
                                        highest_vote={highest_vote}
                                        lowest_vote={lowest_vote} />
                                    <br/>
                                </Paper>
                            </div>
                        </div>
                    </div>
                    <div className="row center-xs">
                        <div className="col-xs-12  col-sm-6  col-md-4">
                            <div className="box">
                                {this.renderAdminPanel2()}
                            </div>
                        </div>
                    </div>
                    <div className="row center-xs">
                        <div className="col-xs-12  col-sm-6  col-md-4">
                            <RoomInfoBox
                                room_name={room_name}
                                room_users={room_users}
                                room_admin={room_admin}
                                room_password={room_password}
                                voting_status={voting_status}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return <div>
            {view}
            <BackBox
                backLink={StatesConstants.ROOM_PREVIEW_ID.replace(':room_id', room_id)}
                backText="Switch to preview room (TV)"
                variant="contained"
                icon={BackBox.icon.TV}
            />
            <BackBox/>
            <Footer/>
        </div>;
    }
}

export default Room;
