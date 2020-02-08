'use strict';

import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import PokerActions from '../actions/PokerActions';
import StatesConstants from '../constants/StatesConstants';
import BackBox from '../components/BackBox.jsx';
import PokerStore from "../stores/PokerStore";

const styles = {
    paper: {
        height: 225,
        marginBottom: 10,
        padding: 20
    },
    button: {
        width: '100%'
    },
    form_box: {
        height: '70%',
        width: '100%',
        textAlign: 'left'
    },
    text_input: {
        width: '100%'
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
    box_title: 'User details',
    input_label_user_name: 'Your name',
    user_name_invalid: 'Invalid name',
    save_button: 'Save',
    user_name_already_exists: 'User already exists'
};

class UserDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user_name:  '',
            user_name_error: false
        };
        this.listeners = {};

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
        stateToSet.user_name_valid = false;
        this.setState(stateToSet);
    }

    handleSave() {
        let stateToSet = {};

        stateToSet.user_name_error = this.state.user_name.length > 0 ? false : texts.user_name_invalid;

        if (false !== stateToSet.user_name_error) {
            this.setState(stateToSet);
        } else {
            PokerActions.registerNewUser(this.state.user_name, PokerStore.getRoomId());
        }
    }

    render() {
        return (
            <div>
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        <div className="box">
                            <center>
                                <Paper style={styles.paper} zDepth={1}>
                                    <div style={styles.form_box}>
                                        <h4>{texts.box_title}</h4>
                                        <TextField
                                            floatingLabelText={texts.input_label_user_name}
                                            hintText={texts.input_label_user_name}
                                            style={styles.text_input}
                                            name="user_name"
                                            value={this.state.user_name}
                                            onChange={this.collectInputValue.bind(this)}
                                            errorText={this.state.user_name_error} />
                                    </div>
                                    <RaisedButton
                                        label={texts.save_button}
                                        primary={true}
                                        style={styles.button}
                                        onClick={this.handleSave.bind(this)} />
                                </Paper>
                            </center>
                        </div>
                    </div>
                </div>
                <BackBox backLink={StatesConstants.WELCOME} backText="Back to main page"/>
            </div>
        );
    }
}

UserDetails.contextTypes = {
    room_id: function() { return React.PropTypes.number.isRequired; }
};

export default UserDetails;
