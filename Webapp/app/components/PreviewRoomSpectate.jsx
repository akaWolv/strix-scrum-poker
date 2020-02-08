'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Link} from 'react-router'

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import PokerActions from '../actions/PokerActions';
import StatesConstants from '../constants/StatesConstants';

import RoomConstants from '../constants/RoomConstants';

import VotingStore from '../stores/VotingStore';
import VotingConstants from '../constants/VotingConstants';

import {List, ListItem} from 'material-ui/List';
import _ from 'underscore';
import Avatar from 'material-ui/Avatar';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionHourGlass from 'material-ui/svg-icons/action/hourglass-empty';
import ActionEventSeat from 'material-ui/svg-icons/action/event-seat';
import {blue100, orange400, lime500, grey400} from 'material-ui/styles/colors';
import Strix from '../components/Strix';
import PokerStore from "../stores/PokerStore";

// import QRCode from 'react-qr-code';

const styles = {
    paper: {
        padding: 20,
        marginBottom: 10,
        textAlign: 'left'
    },
    button: {
        width: '100%'
    },
    text_input: {
        width: '100%'
    },
    paper_users_list: {
        textAlign: 'left'
    },
    paper_users_list_box: {
        paddingTop: '3%',
        paddingLeft: 20,
        height: '100%',
        textAlign: 'left'
    },

    users_list_status_icon: {
        float: 'right',
        fontSize: '1.5em'
    },
    paper_bottom_nav: {
        marginBottom: 10,
        padding: 20,
        textAlign: 'left'
    },
    paper_bottom_nav_button: {
        width: '100%'
    },
    paper_footer: {
        marginBottom: 20,
        padding: 10
    },
    footer_container: {
        height: '100%',
        textAlign: 'center'
    }
};

const texts = {
    input_label_room_name: 'Room name',
    input_label_room_password: 'Room password',
    input_label_room_admin_password: 'Admin password',
    admin_name: 'room admin: ',
    save_button: 'Continue',
    box_title: 'Preview room',
    room_name_invalid: 'Invalid name...',
    connected_info: 'users connected: ',
    room_password_invalid: '...or password',
    voting_status: 'voting status: ',
    user_status: 'Users votes',
    voting_status_text: {}
};
texts.voting_status_text[VotingConstants.STATUS_PENDING] = 'pending';
texts.voting_status_text[VotingConstants.STATUS_IN_PROCESS] = 'in_process';
texts.voting_status_text[VotingConstants.STATUS_FINISHED] = 'finished';

class PreviewRoom extends React.Component {
    constructor(props) {
        super(props);
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
            PokerActions.previewRoomById(props.routeParams.room_id);
        }
    }

    componentWillUnmount() {
        for (let k in this.listeners) {
            if (undefined !== this.listeners[k].deregister) {
                this.listeners[k].deregister()
            }
        }
    }

    onChangeRoomDetails() {
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

    onChangeUsersVotes() {
        this.setState({users_votes: VotingStore.getUsersVotes()});
    }

    onChangeUsersAlreadyVoted() {
        this.setState({users_already_voted: VotingStore.getUsersAlreadyVoted()});
    }

    renderStatusIcon(usersId, votingStatus, usersAlreadyVoted, usersVotes) {

        if (VotingConstants.STATUS_IN_PROCESS === votingStatus) {
            if (undefined !== usersAlreadyVoted && -1 < usersAlreadyVoted.indexOf(usersId)) {
                return <ActionDone style={styles.users_list_status_icon} color={lime500}/>;
            } else {
                return <ActionHourGlass style={styles.users_list_status_icon} color={orange400}/>;
            }
        } else if (VotingConstants.STATUS_FINISHED === votingStatus) {
            if (undefined !== usersVotes[usersId]) {
                return <span style={styles.users_list_status_icon}><b>{usersVotes[usersId]}</b></span>;
            } else {
                return <span style={styles.users_list_status_icon}><i>no vote</i></span>;
            }
        }

        return <ActionEventSeat style={styles.users_list_status_icon} color={blue100}/>;
    }

    render() {
        const {
            users_votes,
            users_already_voted,
            room_details
        } = this.state;

        if (undefined === room_details) {
            return <div></div>;
        }
        const {
            room_users,
            room_admin,
            room_name,
            voting_status,
        } = room_details;
        return (
            <div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <center>
                                <Paper style={styles.paper} zDepth={1}>
                                    <h4>{texts.box_title}: {room_name}</h4>
                                    <p>
                                        users in room: <b>{Object.keys(room_users).length}</b>
                                    </p>
                                    <p>
                                        {texts.admin_name} <b>{
                                        undefined !== room_users[room_admin]
                                            ? room_users[room_admin].name
                                            : 'unknown'
                                    }</b>
                                    </p>
                                    <p>
                                        {texts.connected_info} <b>{Object.keys(room_users).length}</b>
                                    </p>
                                    <p>
                                        {texts.voting_status} <b>{texts.voting_status_text[voting_status]}</b>
                                    </p>
                                </Paper>
                            </center>
                        </div>

                        <div className="box">
                            <Paper style={styles.paper} zDepth={1}>
                                {/*<QRCode value="http://google.com" />*/}
                            </Paper>
                        </div>

                        <div className="box">
                            <Paper style={styles.paper_bottom_nav} zDepth={1}>
                                <Link to={StatesConstants.WELCOME}>
                                    <RaisedButton
                                        style={styles.paper_bottom_nav_button}
                                        secondary={true}
                                        label="Back to main page"
                                    />
                                </Link>
                            </Paper>
                        </div>
                        <div className="box">
                            <center>
                                <Paper style={styles.paper_footer} zDepth={1}>
                                    <div style={styles.footer_container}>
                                        Brought to you by <Strix/>
                                    </div>
                                </Paper>
                            </center>
                        </div>
                    </div>
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <Paper style={styles.paper_users_list} zDepth={1}>
                                <div style={styles.paper_users_list_box}>
                                    <h4>{texts.user_status}</h4>
                                </div>
                                <List>
                                    {_.toArray(room_users).map(function (element) {
                                        return (
                                            <ListItem
                                                key={element.id}
                                                primaryText={undefined === element.name ? '...' : element.name}
                                                leftAvatar={<Avatar src=""/>}>
                                                {this.renderStatusIcon(
                                                    element.id,
                                                    voting_status,
                                                    users_already_voted,
                                                    users_votes
                                                )}
                                            </ListItem>
                                        )
                                    }.bind(this))}
                                </List>
                            </Paper>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PreviewRoom;
