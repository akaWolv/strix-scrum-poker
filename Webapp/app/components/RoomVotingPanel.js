import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import {lime, grey, deepOrange, orange, cyan, pink} from '@material-ui/core/colors';

import VotingStore from '../stores/VotingStore';
import VotingConstants from '../constants/VotingConstants';
import VotingActions from '../actions/VotingActions';

import ContentClear from '@material-ui/icons/Clear';
import MapsLocalCafe from '@material-ui/icons/LocalCafe';
import ActionHelpOutline from '@material-ui/icons/HelpOutline';
import ActionAccessibility from '@material-ui/icons/Accessibility';

const styles = {
    paper_info: {
        marginBottom: 10
    },

    paper_users_list_box: {
        padding: 20,
        height: '100%',
        textAlign: 'left'
    },

    header_text_pending: {
        textAlign: 'center',
        color: grey[400]
    },
    header_text_in_process: {
        textAlign: 'center',
        color: deepOrange[400]
    },
    header_text_voted: {
        textAlign: 'center',
        color: lime[500]
    },
    header_text_finished: {
        textAlign: 'center',
        color: cyan[500]
    },

    slide_box: {
        margin: '0 auto',
        width: '100%',
        height: 100,
    },
    slide_box_item: {
        border: 'solid 1px red',
        width: 100,
        height: 100
    },

    voting_box: {
        paddingTop: '3%',
        height: '100%',
        textAlign: 'left'
    },
    voting_box_list: {
        textAlign: 'center'
    },
    sequence_sign: {
        left: 8,
        backgroundColor: 'transparent',
        color: pink['A200']
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    gridList: {
        width: '100%',
        height: 'auto'
    },
    sequence_picker: {
        width: '100%',
        height: '100%',
        fontSize: '2em',
        backgroundColor: pink['A200'],
    },
    sequence_picker_special_cancel: {
        width: '100%',
        height: '100%',
        fontSize: '2em',
        backgroundColor: 'transparent'
    },
    sequence_picker_special: {
        width: '100%',
        height: '100%',
        fontSize: '2em',
        backgroundColor: grey[700],
        color: cyan[500]
    },
    sequence_picker_picked: {
        backgroundColor: orange[200],
        color: grey[800]
    }
};

const texts = {
    vote: 'Vote',
    pending: 'No voting right now. Waiting for admin to start it.',
    in_process: 'Voting in process',
    finished: 'Voting is finished',
    not_voted: 'You did not voted',
    you_voted: 'You have voted:'
};

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

class RoomVotingPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //voting_status: VotingStore.getStatus(),
            vote_picked: undefined
        };

        this.listeners = [
            VotingStore.registerListener(VotingConstants.EVENT_USER_VOTE, this.handleUserVote.bind(this))
        ];
    }

    componentWillUnmount() {
        for (let k in this.listeners) {
            this.listeners[k].deregister();
        }
    }

    handleUserVote() {
        this.setState({vote_picked: VotingStore.getUserVote()});
    }

    renderPending() {
        return (
            <div style={styles.paper_users_list_box}>
                <h4 style={styles.header_text_pending}>
                    {texts.pending}
                </h4>
            </div>
        );
    }

    renderInProcess() {
        const previousUserVote = VotingStore.getUserPreviousVote();

        return (
            <div style={styles.root}>
                <GridList
                    cols={3}
                    cellHeight={100}
                    padding={1}
                    style={styles.gridList} >
                    <GridListTile
                        key='cancel' >
                        <Button
                            style={this.sequenceStyle('cancel', styles.sequence_picker_special_cancel)}
                            onClick={this.handlePickVote.bind(this, 'cancel')}
                            color="primary">
                            {<ContentClear style={{width: '30%', height: '30%'}} />}
                        </Button>
                    </GridListTile>
                    {this.props.sequence.map((elem) => (
                        <GridListTile
                            style={elem.value === previousUserVote ? {filter: 'brightness(1.5)'} : {}}
                            key={elem.value}
                            title={undefined === elem.title || 0 === elem.title.length ? '' : elem.title} >
                            <Button
                                style={this.sequenceStyle(elem.value, styles.sequence_picker)}
                                onClick={this.handlePickVote.bind(this, elem.value)}
                                color="primary">
                                {elem.value}
                            </Button>
                        </GridListTile>
                    ))}
                    <GridListTile
                        style={'?' === previousUserVote ? {filter: 'brightness(1.5)'} : {}}
                        key='?' >
                        <Button
                            style={this.sequenceStyle('?', styles.sequence_picker_special)}
                            onClick={this.handlePickVote.bind(this, '?')}
                            color="primary">
                            {<ActionHelpOutline style={{width: '30%', height: '30%'}} />}
                        </Button>
                    </GridListTile>
                    <GridListTile
                        style={'big' === previousUserVote ? {filter: 'brightness(1.5)'} : {}}
                        key='big' >
                        <Button
                            style={this.sequenceStyle('big', styles.sequence_picker_special)}
                            onClick={this.handlePickVote.bind(this, 'big')}
                            color="primary">
                            {<ActionAccessibility style={{width: '30%', height: '30%'}} />}
                        </Button>
                    </GridListTile>
                    <GridListTile
                        style={'cafe' === previousUserVote ? {filter: 'brightness(1.5)'} : {}}
                        key='cafe' >
                        <Button
                            style={this.sequenceStyle('cafe', styles.sequence_picker_special)}
                            onClick={this.handlePickVote.bind(this, 'cafe')}
                            color="primary">
                            {<MapsLocalCafe style={{width: '30%', height: '30%'}} />}
                        </Button>
                    </GridListTile>
                </GridList>
            </div>
        );
    }
    sequenceStyle(value, style) {
        let returnStyle = {};
        if (undefined !== this.state.vote_picked && value === this.state.vote_picked) {
            Object.assign(returnStyle, style, styles.sequence_picker_picked);
        } else {
            returnStyle = style;
        }

        return returnStyle;
    }
    handlePickVote(picked) {
        this.setState({vote_picked: picked});
        VotingActions.vote(picked);
    }

    renderFinished() {
        return (
            <div style={styles.paper_users_list_box}>
                <h4 style={styles.header_text_finished}>
                    {texts.finished}
                </h4>
                <h4 style={styles.header_text_finished}>
                    {
                        undefined === this.state.vote_picked || 'cancel' === this.state.vote_picked
                        ? texts.not_voted
                        : texts.you_voted + ' \'' + this.state.vote_picked + '\''
                    }
                </h4>
            </div>
        );
    }

    renderByStatus() {
        switch (this.props.voting_status) {
            case VotingConstants.STATUS_PENDING:
                return this.renderPending();
            case VotingConstants.STATUS_IN_PROCESS:
                return this.renderInProcess();
            case VotingConstants.STATUS_FINISHED:
                return null; // this.renderFinished();
        }
    }

    render() {
        return (
            <Paper style={styles.paper_info} elevation={1}>
                {this.renderByStatus()}
            </Paper>
        );
    }
}

RoomVotingPanel.defaultProps = {
    sequence: VotingStore.getSequence()
};

export default RoomVotingPanel;
