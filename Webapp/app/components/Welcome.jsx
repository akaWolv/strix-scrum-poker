'use strict';

import React from 'react';
import LinkButton from '../components/LinkButton.jsx';

import Paper from '@material-ui/core/Paper';
import Footer from '../components/Footer';
import PokerStore from '../stores/PokerStore';
import StatesConstants from "../constants/StatesConstants";
import InfoIcon from '@material-ui/icons/Info';
import TvIcon from '@material-ui/icons/Tv';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const styles = {
    paper_welcome: {
        marginTop: 5,
        marginBottom: 15,
        padding: 20,
        paddingTop: 10
    },
    text_box_welcome: {
        height: '100%',
        textAlign: 'center'
    },
    text_box_info: {
        height: '100%',
        textAlign: 'left'
    },
    button_welcome: {
        width: '100%',
        marginTop: 15,
        marginBottom: 15
    }
};

const texts = {
    hello_again: 'Hello again',
    button_new_room: 'Create room',
    button_join_room: 'Join room',
    button_room_preview: 'Preview room (TV)',
    button_existing_user: 'Use existing details',
    button_continue_as_part_1: 'Continue as ',
    button_spectate: 'Spectate',
    welcome_header: 'Scrum Poker',
    welcome_sub: 'by SarcaStrix.com',
    welcome_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pretium, lorem id imperdiet.',
    info: '<b>Planning poker</b> <br /><br /> also called <b>Scrum poker</b>, is a consensus-based, gamified technique for estimating, ' +
        'mostly used to estimate effort or relative size of development goals in software development. <br /><br />In planning poker, ' +
        'members of the group make estimates by playing numbered cards face-down to the table, instead of speaking them aloud. ' +
        'The cards are revealed, and the estimates are then discussed. <br /><br />By hiding the figures in this way, the group can avoid the ' +
        'cognitive bias of anchoring, where the first number spoken aloud sets a precedent for subsequent estimates.' +
        '<br /><br />source <a href="https://en.wikipedia.org/wiki/Planning_poker" style="color: #03a9f4" target="_blank"><i>Wikipedia</i></a>'
};

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: PokerStore.getUserName()
        };

        this.listeners = [];
    }

    componentWillUnmount() {
        for (let k in this.listeners) {
            if (undefined !== this.listeners[k].deregister) {
                this.listeners[k].deregister()
            }
        }
    }

    // onChangeUserDetails() {
    //     this.setState({user_name: PokerStore.getUserName()});
    // }

    render() {
        const {user_name} = this.state;
        return (
            <div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <Paper style={styles.paper_welcome} elevation={1}>
                                <div style={styles.text_box_welcome}>
                                    <h2>{texts.welcome_header}</h2>
                                    {/*<span style={{fontSize: '.8em'}}>{texts.welcome_sub}</span>*/}
                                </div>
                            </Paper>
                            {
                                undefined !== user_name ?
                                    <Paper style={styles.paper_welcome} elevation={1}>
                                        <br />
                                        <div>{texts.hello_again} <b>{this.state.user_name}</b></div>
                                    </Paper> : null
                            }
                        </div>
                    </div>
                </div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box-row">
                            <center>
                                <Paper style={styles.paper_welcome} elevation={1}>
                                    <LinkButton
                                        to={StatesConstants.ROOM_CREATE}
                                        color="primary"
                                        variant="contained"
                                        startIcon={<AddCircleOutlineIcon />}
                                        style={styles.button_welcome}>
                                        {texts.button_new_room}
                                    </LinkButton>
                                    <LinkButton
                                        to={StatesConstants.ROOM_JOIN}
                                        color="primary"
                                        variant="contained"
                                        startIcon={<GroupAddIcon />}
                                        style={styles.button_welcome}>
                                        {texts.button_join_room}
                                    </LinkButton>
                                    <LinkButton
                                        to={StatesConstants.ROOM_PREVIEW_JOIN}
                                        color="primary"
                                        variant="contained"
                                        startIcon={<TvIcon />}
                                        style={styles.button_welcome}>
                                        {texts.button_room_preview}
                                    </LinkButton>
                                </Paper>
                            </center>
                        </div>
                    </div>
                </div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <center>
                                <Paper style={styles.paper_welcome} elevation={1}>
                                    <div style={styles.text_box_info}>
                                        <InfoIcon style={{float: 'right'}}/>
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
