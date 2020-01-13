'use strict';

import React from 'react';
import {Link} from 'react-router'

import {CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Cookies from 'cookies-js';
import Footer from '../components/Footer';
import UserStore from '../stores/UserStore';
import RoomConstants from '../constants/RoomConstants';
import StatesConstants from "../constants/StatesConstants";
import Socket from '../handlers/SocketSession'

const styles = {
    paper_welcome: {
        marginBottom: 20,
        padding: 20
    },
    text_box_welcome: {
        height: '100%',
        textAlign: 'justify'
    },
    button_welcome: {
        width: '100%',
        marginTop: 15,
        marginBottom: 15
    }
};

const texts = {
    button_new_room: 'Create room',
    button_join_room: 'Join room',
    button_display_room: 'Display room',
    button_existing_user: 'Use existing details',
    button_continue_as_part_1: 'Continue as ',
    button_spectate: 'Spectate',
    welcome_header: 'Scrum Poker (by SarcaStrix.com)',
    welcome_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pretium, lorem id imperdiet.',
    info: '<b>Planning poker</b>, <br /> also called <b>Scrum poker</b>, is a consensus-based, gamified technique for estimating, ' +
        'mostly used to estimate effort or relative size of development goals in software development. <br /><br />In planning poker, ' +
        'members of the group make estimates by playing numbered cards face-down to the table, instead of speaking them aloud. ' +
        'The cards are revealed, and the estimates are then discussed. <br /><br />By hiding the figures in this way, the group can avoid the ' +
        'cognitive bias of anchoring, where the first number spoken aloud sets a precedent for subsequent estimates.' +
        '<br /><br />source <a href="https://en.wikipedia.org/wiki/Planning_poker" target="_blank"><i>Wikipedia</i></a>'
};

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: ''//UserStore.getUserName()
        };

        this.listeners = {};
        // this.listeners.user_details = UserStore.registerListener(RoomConstants.EVENT_USER_DETAILS, this.onChangeUserDetails.bind(this));
    }

    componentWillUnmount() {
        for (let k in this.listeners) {
            if (undefined !== this.listeners[k].deregister) {
                this.listeners[k].deregister()
            }
        }
    }

    onChangeUserDetails() {
        this.setState({user_name: UserStore.getUserName()});
    }

    render() {
        Socket.session.emit('terefere');
        return (
            <div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <Paper style={styles.paper_welcome} zDepth={1}>
                                <div style={styles.text_box_welcome}>
                                    <h4>{texts.welcome_header}</h4>
                                </div>
                            </Paper>
                        </div>
                    </div>
                </div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box-row">
                            <center>
                                <Paper style={styles.paper_welcome} zDepth={1}>
                                    <Link to={StatesConstants.ROOM_CREATE}>
                                        <RaisedButton
                                            label={texts.button_new_room}
                                            primary={true}
                                            style={styles.button_welcome}/>
                                    </Link>
                                    <Link to={StatesConstants.ROOM_JOIN}>
                                        <RaisedButton
                                            label={texts.button_join_room}
                                            primary={true}
                                            style={styles.button_welcome}/>
                                    </Link>
                                    <Link to={StatesConstants.ROOM_DISPLAY}>
                                        <RaisedButton
                                            label={texts.button_display_room}
                                            primary={true}
                                            style={styles.button_welcome}/>
                                    </Link>
                                </Paper>
                            </center>
                        </div>
                    </div>
                </div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <center>
                                <Paper style={styles.paper_welcome} zDepth={1}>
                                    <div style={styles.text_box_welcome}>
                                        <p dangerouslySetInnerHTML={{__html: texts.info}}></p>
                                    </div>
                                </Paper>
                            </center>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Welcome;
