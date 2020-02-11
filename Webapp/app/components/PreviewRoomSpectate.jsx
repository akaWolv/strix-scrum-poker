'use strict';

import React from 'react';

import Paper from '@material-ui/core/Paper';

import PokerActions from '../actions/PokerActions';
import StatesConstants from '../constants/StatesConstants';

import RoomConstants from '../constants/RoomConstants';

import Divider from '@material-ui/core/Divider';
import VotingStore from '../stores/VotingStore';
import VotingConstants from '../constants/VotingConstants';
import HourglassFullTwoToneIcon from '@material-ui/icons/HourglassFullTwoTone';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import _ from 'underscore';
import Avatar from '@material-ui/core/Avatar';
import ActionDone from '@material-ui/icons/Done';
import ActionHourGlass from '@material-ui/icons/HourglassEmpty';
import ActionEventSeat from '@material-ui/icons/EventSeat';
import {blue, orange, lime, cyan} from '@material-ui/core/colors';
import PokerStore from "../stores/PokerStore";
import RoomInfoBox from '../components/RoomInfoBox.jsx';
import BackBox from "../components/BackBox.jsx";
import Footer from "../components/Footer";

import QRCode from 'qrcode.react';

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
        fontSize: '1.5em',
        color: blue[100]
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
    },
    waiting: {
        color: cyan['800'],
        fontWeight: 100,
        textAlign: 'center',
    }
};

const texts = {
    input_label_room_name: 'Room name',
    input_label_room_password: 'Room password',
    input_label_room_admin_password: 'Admin password',
    save_button: 'Continue',
    room_name_invalid: 'Invalid name...',
    room_password_invalid: '...or password',
    user_status: 'Users votes',
};

class PreviewRoomSpectate extends React.Component {
    constructor(props) {
        super(props);

        const {room_id} = this.props.match.params;

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

        if (undefined !== room_id && undefined === PokerStore.getRoomId()) {
            PokerActions.previewRoomById(room_id);
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
                return <ActionDone style={styles.users_list_status_icon} color={lime['500']}/>;
            } else {
                return <ActionHourGlass style={styles.users_list_status_icon} color={orange['400']}/>;
            }
        } else if (VotingConstants.STATUS_FINISHED === votingStatus) {
            if (undefined !== usersVotes[usersId]) {
                return <span style={styles.users_list_status_icon}><b>{usersVotes[usersId]}</b></span>;
            } else {
                return <span style={styles.users_list_status_icon}><i>no vote</i></span>;
            }
        }

        return <ActionEventSeat style={styles.users_list_status_icon} />;
    }

    render() {
        const {
                users_votes,
                users_already_voted,
                room_details
            } = this.state,
            {location} = window;

        if (undefined === room_details) {
            return <div></div>;
        }
        const {
                room_id,
                room_users,
                room_admin,
                room_name,
                voting_status,
            } = room_details,
            qr_url = location.origin + '/room/' + room_id;

        return (
            <div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <RoomInfoBox
                            room_name={room_name}
                            room_users={room_users}
                            room_admin={room_admin}
                            voting_status={voting_status}
                        />

                        <div className="box">
                            <Paper style={styles.paper} elevation={1}>
                                <center>
                                    <QRCode
                                        size={256}
                                        value={qr_url}/>
                                </center>
                            </Paper>
                        </div>

                        <BackBox
                            backLink={StatesConstants.WELCOME}
                            backText="Back to main page"
                            doDisconnectRoom={true}
                            renderRow={false}
                        />
                    </div>
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box" style={{marginBottom: 10}}>
                            <Paper style={styles.paper_users_list} elevation={1}>
                                <div style={styles.paper_users_list_box}>
                                    <h4>{texts.user_status}</h4>
                                </div>
                                <Divider light={true}/>
                                <br/>
                                {
                                    room_users.length === 0
                                        ? <div style={styles.waiting}>
                                            <HourglassFullTwoToneIcon color={'secondary'} style={{fontSize: 60}}/>
                                            <br/>
                                            waiting for users
                                        </div>
                                        : null
                                }
                                <List>
                                    {_.toArray(room_users).map(function (element) {
                                        return (
                                            <ListItem
                                                key={element.id}
                                                primary={undefined === element.name ? '...' : element.name}
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
                                <br />
                            </Paper>
                        </div>
                        <Footer renderRow={false} />
                    </div>
                </div>
            </div>
        );
    }
}

export default PreviewRoomSpectate;
