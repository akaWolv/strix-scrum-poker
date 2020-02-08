import React from 'react';
import Paper from 'material-ui/Paper';

import RoomVotingPanel from '../components/RoomVotingPanel';

import RoomConstants from '../constants/RoomConstants';
import PokerActions from '../actions/PokerActions';
import VotingConstants from '../constants/VotingConstants';
import StatesConstants from '../constants/StatesConstants';
import StateMachine from '../controllers/StateMachine';
import PokerStore from '../stores/PokerStore';
import VotingStore from '../stores/VotingStore';
import VotingAction from '../actions/VotingActions';

import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionHourGlass from 'material-ui/svg-icons/action/hourglass-empty';
import ActionEventSeat from 'material-ui/svg-icons/action/event-seat';
import {pink900, blue100, orange400, lime600, grey400, orange600, red600} from 'material-ui/styles/colors';

import RaisedButton from 'material-ui/RaisedButton';
import _ from 'underscore';
import Footer from '../components/Footer';
import BackBox from '../components/BackBox.jsx';
import UserDetails from "./UserDetails.jsx";

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
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 0,
        height: '100%',
        textAlign: 'left'
    },

    users_list_status_icon: {
        float: 'right',
        fontSize: '1.5em'
    },

    no_voting_header: {
        textAlign: 'center',
        color: grey400
    },

    admin_box: {
        padding: 20,
        backgroundColor: pink900,
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
    voting_status_text: {},
    connected_info: 'users connected: ',
    user_status: 'Users votes',
    start_new_voting: 'Start new voting',
    stop_voting: 'End voting',
    finish_voting: 'Finish and show values',
    continue_voting: 'Continue voting',
    admin_panel_header: 'Admin control'
};

texts.voting_status_text[VotingConstants.STATUS_PENDING] = 'pending';
texts.voting_status_text[VotingConstants.STATUS_IN_PROCESS] = 'in_process';
texts.voting_status_text[VotingConstants.STATUS_FINISHED] = 'finished';

class Room extends React.Component {
    constructor(props, context) {
        super(props, context);

        if (undefined !== props.routeParams.room_id && undefined === PokerStore.getRoomId()) {
            console.log('lets join ROOOOOOM');
            PokerActions.joinRoomById(props.routeParams.room_id);
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

    onRoomNotFound() {
        StateMachine.changeState(StatesConstants.WELCOME);
    }

    onChangeUserDetails() {
        this.setState({
            user_id: PokerStore.getUserId(),
            user_name: PokerStore.getUserName()
        });
    }

    onChangeRoomDetails() {
        console.log('onChangeRoomDetails');
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
                return <p>Voting status (<span style={{color: votes !== users ? orange400 : lime600}}>votes: <b>{votes}</b> / users: <b>{users}</b></span>)</p>;
            case VotingConstants.STATUS_FINISHED:
                return <p>Continue current voting or finalize it.</p>;
        }
    }

    renderAdminPanel() {
        if (this.state.room_admin === PokerStore.getUserId()) {
            return (
                <Paper style={styles.paper_info} zDepth={1}>
                    <div style={styles.admin_box}>
                        <h4 style={styles.admin_panel_header}>
                            {texts.admin_panel_header}
                        </h4>
                        { this.renderVotingStatusHints() }
                        { this.renderAdminPanelButtons() }
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
                <Paper style={styles.paper_info} zDepth={1}>
                    <div style={styles.admin_box}>
                        <div className="row center-xs">
                            <div className="col-xs-12">
                                <RaisedButton
                                    label={texts.finish_voting}
                                    primary={true}
                                    style={styles.admin_panel_button}
                                    onClick={this.handleFinishVoting.bind(this)}/>
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
                            <RaisedButton
                                label={texts.start_new_voting}
                                primary={true}
                                style={styles.admin_panel_button}
                                onClick={this.handleStartNewVotingButton.bind(this)}/>
                        </div>
                    </div>
                );
            case VotingConstants.STATUS_IN_PROCESS:
                return (
                    <div className="row center-xs">
                        <div className="col-xs-12">
                            <RaisedButton
                                label={texts.finish_voting}
                                primary={true}
                                style={styles.admin_panel_button}
                                onClick={this.handleFinishVoting.bind(this)}/>
                        </div>
                    </div>
                );
            case VotingConstants.STATUS_FINISHED:
                return (
                    <div className="row center-xs">
                        <div className="col-xs-6">
                            <RaisedButton
                                label={texts.continue_voting}
                                primary={true}
                                style={styles.admin_panel_button}
                                onClick={this.handleContinueVoting.bind(this)}/>
                        </div>
                        <div className="col-xs-6">
                            <RaisedButton
                                label={texts.stop_voting}
                                primary={true}
                                style={styles.admin_panel_button}
                                onClick={this.handleStopVoting.bind(this)}/>
                        </div>
                    </div>
                );
        }
    }

    renderStatusIcon(usersId) {
        const {voting_status, users_already_voted, users_votes, highest_vote, lowest_vote} = this.state;

        if (VotingConstants.STATUS_IN_PROCESS === voting_status) {
            if (undefined !== users_already_voted && -1 < users_already_voted.indexOf(usersId)) {
                return <ActionDone style={styles.users_list_status_icon} color={lime600} />;
            } else {
                return <ActionHourGlass style={styles.users_list_status_icon} color={orange400} />;
            }
        } else if (VotingConstants.STATUS_FINISHED === voting_status) {
            if (undefined !== users_votes[usersId]) {
                let color = 'inherit';
                if (lowest_vote === highest_vote){
                    color = lime600;
                } else if (lowest_vote === users_votes[usersId]){
                    color = orange600;
                } else if (highest_vote === users_votes[usersId]) {
                    color = red600;
                }
                return <span style={styles.users_list_status_icon}>
                    <b style={{color: color}}>{users_votes[usersId]}</b>
                </span>;
            } else {
                return <span style={styles.users_list_status_icon}><i style={{opacity: '0.4'}}>no vote</i></span>;
            }
        }

        return <ActionEventSeat style={styles.users_list_status_icon} color={blue100} />;
    }

    render() {
        const {room_id, user_id} = this.state;

        if (undefined === user_id && undefined === room_id) {
            return <div><center><br /><br />Connecting to Room...</center></div>;
        } else if (undefined === user_id) {
            return <UserDetails room_id={room_id} />;
        } else {
            return (
                <div>
                    <div className="row center-xs">
                        <div className="col-xs-12  col-sm-6  col-md-4">
                            <div className="box">
                                <Paper style={styles.paper_info} zDepth={1}>
                                    <div style={styles.text_box_info}>
                                        <h4>{texts.header}{this.state.room_name}</h4>
                                        <div style={styles.text_box_info_details}>
                                            <p>
                                                {texts.password}
                                                <b>{this.state.room_password}</b>
                                            </p>
                                            <p>
                                                {texts.connected_info}
                                                <b>{Object.keys(this.state.room_users).length}</b>
                                            </p>
                                            <p>
                                                {texts.voting_status}
                                                <b>{texts.voting_status_text[this.state.voting_status]}</b>
                                            </p>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                        </div>
                    </div>
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
                                    voting_status={this.state.voting_status}/>
                            </div>
                        </div>
                    </div>
                    <div className="row center-xs">
                        <div className="col-xs-12  col-sm-6  col-md-4">
                            <div className="box">
                                <Paper style={styles.paper_users_list} zDepth={1}>
                                    <div style={styles.paper_users_list_box}>
                                        <h4>{texts.user_status}</h4>
                                    </div>
                                    <List>
                                        {_.toArray(this.state.room_users).map(function (element) {
                                            return (
                                                <ListItem
                                                    key={element.id}
                                                    primaryText={undefined === element.name ? '...' : element.name}
                                                    leftAvatar={<Avatar src="" />}>
                                                    { this.renderStatusIcon(element.id) }
                                                </ListItem>
                                            )
                                        }.bind(this))}
                                    </List>
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
                    <BackBox backLink={StatesConstants.WELCOME} backText="Back to dashboard"/>
                    <Footer />
                </div>
            );
        }
    }
}

Room.contextTypes = {
    router: function () {
        return React.PropTypes.func.isRequired;
    }
};

export default Room;
