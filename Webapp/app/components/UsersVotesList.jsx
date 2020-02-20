import React from 'react';

import VotingConstants from '../constants/VotingConstants';
import Fab from '@material-ui/core/Fab';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ActionDone from '@material-ui/icons/Done';
import ActionHourGlass from '@material-ui/icons/HourglassEmpty';
import ActionEventSeat from '@material-ui/icons/EventSeat';
import ContentClear from '@material-ui/icons/Clear';
import MapsLocalCafe from '@material-ui/icons/LocalCafe';
import ActionAccessibility from '@material-ui/icons/Accessibility';
import ActionHelpOutline from '@material-ui/icons/HelpOutline';
import Person from '@material-ui/icons/Person';
import {lime, grey, red, lightBlue, amber, blue} from '@material-ui/core/colors';
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";

const styles = {
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
};

class UsersVotesList extends React.Component {

    static stringToColour(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colour = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    static voteDecorator(vote) {
        const iconDecorate = function (icon) {
            return <i style={{lineHeight: '60px'}}>{icon}</i>;
        };

        switch (vote) {
            case 'cafe':
                return iconDecorate(<MapsLocalCafe/>);
            case 'big':
                return iconDecorate(<ActionAccessibility/>);
            case '?':
                return iconDecorate(<ActionHelpOutline/>);
            default:
                return vote;
        }
    }

    static renderVoteStatusIcon(
        users_id,
        voting_status,
        users_already_voted,
        users_votes,
        highest_vote,
        lowest_vote
    ) {
        let icon_to_return,
            color = grey[700];

        if (VotingConstants.STATUS_IN_PROCESS === voting_status) {
            if (undefined !== users_already_voted && -1 < users_already_voted.indexOf(users_id)) {
                icon_to_return = <ActionDone style={styles.users_list_status_icon_done}/>;
            } else {
                icon_to_return = <ActionHourGlass style={styles.users_list_status_icon}/>;
            }
        } else if (VotingConstants.STATUS_FINISHED === voting_status) {
            if (undefined !== users_votes[users_id]) {
                if (lowest_vote === highest_vote) {
                    color = lime[800];
                } else if (lowest_vote === users_votes[users_id]) {
                    color = amber[900];
                } else if (highest_vote === users_votes[users_id]) {
                    color = red[700];
                }
                icon_to_return = <span style={styles.users_list_status_icon}>
                    <b style={{color: grey[100]}}>{UsersVotesList.voteDecorator(users_votes[users_id])}</b>
                </span>;
            } else {
                icon_to_return = <span style={styles.users_list_status_icon}>
                    <i style={{opacity: '0.4', lineHeight: '60px'}}>
                        <ContentClear/>
                    </i>
                </span>;
            }
        }

        if (undefined === icon_to_return) {
            icon_to_return = <ActionEventSeat style={styles.users_list_status_icon}/>
        }

        return <ListItemSecondaryAction>
            <Fab disabled={true}
                 size='medium'
                 style={{backgroundColor: color}}>
                {icon_to_return}
            </Fab>
        </ListItemSecondaryAction>;
    }

    render() {
        const {
            room_users,
            voting_status,
            users_already_voted,
            users_votes,
            highest_vote,
            lowest_vote
        } = this.props;

        return <List>
            {room_users.map(function (element) {
                return (
                    <ListItem key={element.id}>
                        <ListItemIcon>
                            <Avatar
                                variant="rounded"
                                style={{
                                    backgroundColor: grey[900],
                                    color: UsersVotesList.stringToColour(element.name)
                                }}>
                                <Person/>
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText
                            primary={undefined === element.name ? '...' : element.name}/>
                            {
                                UsersVotesList.renderVoteStatusIcon(
                                    element.id,
                                    voting_status,
                                    users_already_voted,
                                    users_votes,
                                    highest_vote,
                                    lowest_vote
                                )
                            }
                    </ListItem>
                )
            }.bind(this))}
        </List>
    }
}

UsersVotesList.propTypes = {
    room_users: PropTypes.array,
    voting_status: PropTypes.string,
    users_already_voted: PropTypes.array,
    users_votes: PropTypes.object,
    highest_vote: PropTypes.number,
    lowest_vote: PropTypes.number
};


export default UsersVotesList;
