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
import {blue, lime, cyan} from '@material-ui/core/colors';
import PokerStore from "../stores/PokerStore";
import RoomInfoBox from '../components/RoomInfoBox.jsx';
import BackBox from "../components/BackBox.jsx";
import UsersVotesList from "../components/UsersVotesList.jsx";
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

    users_list_status_icon_done: {
        float: 'right',
        fontSize: '1.5em',
        color: lime[500]
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

        if (undefined !== room_id && undefined === PokerStore.getRoomId()) {
            PokerActions.previewRoomById(room_id);
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
            VotingStore.registerListener(VotingConstants.EVENT_USERS_ALREADY_VOTED, this.onChangeUsersAlreadyVoted.bind(this)),
            VotingStore.registerListener(VotingConstants.EVENT_USERS_VOTES, this.onChangeUsersVotes.bind(this))
        ];

    }

    componentWillUnmount() {
        for (let k in this.listeners) {
            if (undefined !== this.listeners[k].deregister) {
                this.listeners[k].deregister()
            }
        }
    }

    onChangeRoomDetails() {
        const {voting_status} = this.state;
        let roomDetails = PokerStore.getRoomDetails();

        let newStatus = {
            room_id: roomDetails.id,
            room_name: roomDetails.name,
            room_sequence: roomDetails.sequence,
            room_admin: roomDetails.admin,
            room_password: roomDetails.password,
            voting_status: roomDetails.voting_status,
            user_id: PokerStore.getUserId(),
            user_name: PokerStore.getUserName()
        };

        // only during voting
        if (roomDetails.voting_status === VotingConstants.STATUS_IN_PROCESS) {
            newStatus['users_already_voted'] = VotingStore.getUsersAlreadyVoted();
        }

        // only when changing status OR status is not finished
        if (voting_status !== roomDetails.voting_status
            || roomDetails.voting_status !== VotingConstants.STATUS_FINISHED) {
            newStatus['room_users'] = roomDetails.users;
            newStatus['users_votes'] = VotingStore.getUsersVotes();
            newStatus['highest_vote'] = VotingStore.getHighestVote();
            newStatus['lowest_vote'] = VotingStore.getLowestVote();
        }

        this.setState(newStatus);
    }

    onChangeUsersVotes() {
        this.setState({users_votes: VotingStore.getUsersVotes()});
    }

    onChangeUsersAlreadyVoted() {
        const {voting_status} = this.state;

        if (voting_status === VotingConstants.STATUS_IN_PROCESS) {
            this.setState({users_already_voted: VotingStore.getUsersAlreadyVoted()});
        }
    }

    render() {
        const {
                room_id,
                room_users,
                room_password,
                room_admin,
                room_name,
                voting_status,
                users_already_voted,
                users_votes,
                highest_vote,
                lowest_vote
            } = this.state,
            {location} = window,
            qr_url = location.origin + '/room/' + room_id;

        return (
            <div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <Paper style={styles.paper} elevation={1}>
                                <center>
                                    <QRCode
                                        size={300}
                                        value={qr_url}/>
                                </center>
                            </Paper>
                        </div>
                        <RoomInfoBox
                            room_name={room_name}
                            room_password={room_password}
                            room_users={room_users}
                            room_admin={room_admin}
                            voting_status={voting_status}
                        />

                        <div className="row center-xs">
                            <div className="col-xs-12  col-sm-6  col-md-6">
                                <BackBox renderRow={false} />
                            </div>
                            <div className="col-xs-12  col-sm-6  col-md-6">
                                <BackBox
                                    backLink={StatesConstants.ROOM.replace(':room_id', room_id)}
                                    backText="Join voting"
                                    variant="contained"
                                    renderRow={false}
                                    icon={BackBox.icon.VOTE}
                                />
                            </div>
                        </div>
                        <Footer renderRow={false}/>
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
                                    undefined !== room_users && room_users.length === 0
                                        ? <div style={styles.waiting}>
                                            <HourglassFullTwoToneIcon color={'secondary'} style={{fontSize: 60}}/>
                                            <br/>
                                            waiting for users
                                        </div>
                                        : null
                                }
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
            </div>
        );
    }
}

export default PreviewRoomSpectate;
