'use strict';

import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import PokerActions from '../actions/PokerActions';
import StatesConstants from '../constants/StatesConstants';

import BackBox from '../components/BackBox.jsx';
import RoomConstants from "../constants/RoomConstants";
import PokerStore from "../stores/PokerStore";

const styles = {
    paper: {
        height: 350,
        padding: 20,
        marginBottom: 10
    },
    paper_footer: {
        marginTop: 10,
        padding: 20,
        textAlign: 'left'
    },
    button: {
        width: '100%'
    },
    form_box: {
        height: '80%',
        width: '100%',
        textAlign: 'left'
    },
    text_input: {
        width: '100%',
        marginBottom: 20
    },
    select_input: {
        width: '100%',
        marginTop: 20
    },
    hint_under_select: {
        color: '#bbb',
        textAlign: 'center',
        fontSize: '0.8em',
        marginTop: 5
    }
};

const texts = {
    input_label_room_name: 'Room name',
    input_label_room_password: 'Room password',
    input_label_room_admin_password: 'Admin password',
    save_button: 'Continue',
    box_title: 'Join room for preview a.k.a. TV mode',
    room_name_invalid: 'Invalid name...',
    room_password_invalid: '...or password'
};

class PreviewRoomJoin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room_name: '',
            room_password: '',
            room_name_valid: true,
            room_password_valid: true,
            room_id: undefined
        };

        this.listeners = [
            PokerStore.registerListener(RoomConstants.EVENT_ROOM_NOT_FOUND, this.onRoomNotFound.bind(this))
        ];
    }

    componentWillUnmount() {
        for (let k in this.listeners) {
            if (undefined !== this.listeners[k].deregister) {
                this.listeners[k].deregister()
            }
        }
    }

    onRoomNotFound() {
        this.setState({room_name_valid: false, room_password_valid: false});
    }

    collectInputValue(event) {
        let stateToSet = {};
        stateToSet[event.target.name] = event.target.value;
        stateToSet['room_name_valid'] = true;
        stateToSet['room_password_valid'] = true;
        this.setState(stateToSet);
    };

    handleJoin() {
        PokerActions.previewRoomByNameAndPassword(this.state.room_name, this.state.room_password);
    }

    render() {
        return (
            <div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <Paper style={styles.paper} elevation={1}>
                                <div style={styles.form_box}>
                                    <h4>{texts.box_title}</h4>
                                    <TextField
                                        variant="outlined"
                                        label={texts.input_label_room_name}
                                        style={styles.text_input}
                                        name="room_name"
                                        value={this.state.room_name}
                                        onChange={this.collectInputValue.bind(this)}
                                        error={!this.state.room_name_valid}
                                        helperText={this.state.room_name_valid ? '' : texts.room_name_invalid}/>
                                    <TextField
                                        variant="outlined"
                                        label={texts.input_label_room_password}
                                        style={styles.text_input}
                                        name="room_password"
                                        type="password"
                                        value={this.state.room_password}
                                        onChange={this.collectInputValue.bind(this)}
                                        error={!this.state.room_password_valid}
                                        helperText={this.state.room_password_valid ? '' : texts.room_password_invalid}/>
                                    <p style={styles.hint_under_select}>{this.state.sequence_hint}</p>
                                </div>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    style={styles.button}
                                    onClick={this.handleJoin.bind(this)}>
                                    {texts.save_button}
                                </Button>
                            </Paper>
                        </div>
                    </div>
                </div>
                <BackBox backLink={StatesConstants.WELCOME} backText="Back to main page"/>
            </div>
        );
    }
}

export default PreviewRoomJoin;
