'use strict';

import React from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PokerStore from '../stores/PokerStore';

import PokerActions from '../actions/PokerActions';

import RoomConstants from '../constants/RoomConstants';
import StateActions from '../actions/StateActions';
import StatesConstants from '../constants/StatesConstants';
import BackBox from '../components/BackBox.jsx';
import PropTypes from 'prop-types';

const styles = {
    paper: {
        padding: 20,
        height: 450,
        marginBottom: 20
    },
    button: {
        width: '100%'
    },
    form_box: {
        height: '85%',
        width: '100%',
        textAlign: 'left'
    },
    text_input: {
        width: '100%',
        marginTop: 20
    },
    select_input: {
        width: '100%',
        marginTop: 20
    },
    hint_under_select: {
        color: '#bbb',
        fontSize: '0.8em',
        marginTop: 5
    }
};

const texts = {
    input_label_room_name: 'Room name',
    input_label_room_password: 'Password',
    save_button: 'Create',
    room_name_invalid: 'Invalid name',
    room_password_invalid: 'Invalid password',
    box_title: 'Create new room'
};

class RoomCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room_name:  '',
            room_password:  '',
            sequence:  props.available_sequences[0].value,
            room_name_valid: true,
            room_password_valid: true,
            sequence_hint:  props.available_sequences[0].hint
        };

        this.listeners = [
            PokerStore.registerListener(RoomConstants.EVENT_ROOM_DETAILS_UPDATE, RoomCreate.onJoinedRoom)
        ];
    }

    static onJoinedRoom() {
        StateActions.changeState(StatesConstants.ROOM.replace(':room_id', PokerStore.getRoomId()));
    }

    componentWillUnmount() {
        for (let k in this.listeners) {
            if (undefined !== this.listeners[k].deregister) {
                this.listeners[k].deregister()
            }
        }
    }

    collectInputValue(event) {
        let stateToSet = {};
        stateToSet[event.target.name] = event.target.value;
        stateToSet.room_name_valid = true;
        stateToSet.room_password_valid = true;
        this.setState(stateToSet);
    }

    handleSequenceChange(event, index, sequence) {
        let sequence_hint = '';

        for (let k in this.props.available_sequences) {
            if (sequence === this.props.available_sequences[k].value) {
                sequence_hint = this.props.available_sequences[k].hint;
                break;
            }
        }

        this.setState({sequence, sequence_hint});
    }

    handleSave() {
        let stateToSet = {};

        stateToSet.room_name_valid = this.state.room_name.length > 0;
        stateToSet.room_password_valid = this.state.room_password.length > 0;

        if (false === stateToSet.room_name_valid || false === stateToSet.room_password_valid) {
            this.setState(stateToSet);
        } else {
            // if (undefined === this.listeners.join_room) {
            //     this.listeners.join_room = PokerStore.registerListener(RoomConstants.EVENT_JOINED_ROOM, this.onJoinedRoom.bind(this));
            // }

            PokerActions.create({
                name: this.state.room_name,
                password: this.state.room_password,
                sequence: this.state.sequence
            });
        }
    }

    render() {
        return (
            <div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <center>
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
                                            helperText={this.state.room_name_valid ? '' : texts.room_name_invalid}
                                            error={!this.state.room_name_valid} />
                                        <TextField
                                            variant="outlined"
                                            label={texts.input_label_room_password}
                                            style={styles.text_input}
                                            name="room_password"
                                            value={this.state.room_password}
                                            onChange={this.collectInputValue.bind(this)}
                                            helperText={this.state.room_password_valid ? '' : texts.room_password_invalid}
                                            error={!this.state.room_password_valid} />
                                        <Select
                                            variant="outlined"
                                            name='sequence'
                                            value={this.state.sequence}
                                            onChange={this.handleSequenceChange.bind(this)}
                                            style={styles.select_input} >
                                            {
                                                this.props.available_sequences.map(function (elem) {
                                                    return <MenuItem key={elem.value} value={elem.value}>{elem.text}</MenuItem>;
                                                })
                                            }
                                        </Select>
                                        <p style={styles.hint_under_select}>{this.state.sequence_hint}</p>
                                    </div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={styles.button}
                                        onClick={this.handleSave.bind(this)}>
                                        {texts.save_button}
                                    </Button>
                                </Paper>
                            </center>
                        </div>
                    </div>
                </div>
                <BackBox backLink={StatesConstants.WELCOME} backText="Back to dashboard"/>
            </div>
        );
    }
}

RoomCreate.contextTypes = {
    router:  PropTypes.object
};
RoomCreate.defaultProps = {
    available_sequences: [
        {
            value: 'fibonacci-1-21',
            text: 'Fibbonacci 1-21',
            hint: '1, 3, 5, 8, 13, 21'
        }
    ]
};

export default RoomCreate;
