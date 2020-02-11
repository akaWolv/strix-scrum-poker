'use strict';

import React from "react";
import PropTypes from "prop-types";

import _ from 'underscore';

import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import VotingConstants from "../constants/VotingConstants";

import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import StarsIcon from '@material-ui/icons/Stars';
import LockOpenIcon from '@material-ui/icons/LockOpen';

const styles = {
    info_box_root: {
        root: {
            width: '100%',
            maxWidth: 360
        },
    },
    paper: {
        padding: 20,
        marginBottom: 10,
        textAlign: 'left',
    },
};

const texts = {
    password: 'password',
    box_title: 'room',
    users_in_room: 'users connected',
    admin_name: 'room admin',
    voting_status_text: {},
    voting_status: 'voting status',
};
texts.voting_status_text[VotingConstants.STATUS_PENDING] = 'pending';
texts.voting_status_text[VotingConstants.STATUS_IN_PROCESS] = 'in_process';
texts.voting_status_text[VotingConstants.STATUS_FINISHED] = 'finished';

class RoomInfoBox extends React.Component {
    render() {
        const {
            voting_status,
            room_name,
            room_users,
            room_admin,
            room_password
        } = this.props;

        let admin_record = _.filter(room_users, elem => elem.id === room_admin),
            admin_name = admin_record.length > 0 ? admin_record[0].name : undefined;

        return <div className="box">
            <Paper style={styles.paper} elevation={1}>
                <List styles={styles.info_box_root}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <MeetingRoomIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={room_name}
                            secondary={texts.box_title}/>
                    </ListItem>
                    {
                        undefined === room_password
                            ? null
                            : <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <LockOpenIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={room_name}
                                    secondary={texts.password}/>
                            </ListItem>
                    }
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <StarsIcon  />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={undefined !== admin_name ? admin_name : 'unknown'}
                            secondary={texts.admin_name}/>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <HowToVoteIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={texts.voting_status_text[voting_status]}
                            secondary={texts.voting_status}/>
                    </ListItem>
                </List>
            </Paper>
        </div>;
    }
}

RoomInfoBox.propTypes = {
    voting_status: PropTypes.string,
    room_name: PropTypes.string,
    room_users: PropTypes.array,
    room_admin: PropTypes.string,
    room_password: PropTypes.string,
};

export default RoomInfoBox;
