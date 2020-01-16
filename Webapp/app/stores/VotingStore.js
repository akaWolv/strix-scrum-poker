import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import VotingConstants from '../constants/VotingConstants';
import StoreMixin from '../mixins/StoreMixin';
import Socket from '../handlers/SocketSession'
import UserStore from "./UserStore";

var _votingDetails = {
    id: undefined,
    //status: VotingConstants.STATUS_PENDING,
    sequence: [
        {value: 1},
        {value: 2},
        {value: 3},
        {value: 5},
        {value: 8},
        {value: 13},
        {value: 21}
    ],
    vote: undefined,
    users_already_voted: [],
    users_votes: {},
    previous_users_votes: {}
};
_votingDetails['priorities'] = ['cafe', ..._votingDetails.sequence.map(i => i.value), 'big', '?'];

var VotingStore = Object.assign({}, StoreMixin, EventEmitter.prototype, {

    getVotingDetails: function () {
        return _votingDetails;
    },

    getStatus: function () {
        return _votingDetails.status;
    },

    getSequence: function () {
        return _votingDetails.sequence;
    },

    getUsersAlreadyVoted: function () {
        return _votingDetails.users_already_voted;
    },

    getUsersVotesSorted: function () {
        const {users_votes, priorities} = _votingDetails,
            votes = Object.values(users_votes);
        votes.sort((a, b) => priorities.indexOf(a) > priorities.indexOf(b) ? 1 : -1);
        return votes;
    },

    getUsersVotes: function () {
        return _votingDetails.users_votes;
    },

    getLowestVote: function () {
        const sorted = this.getUsersVotesSorted();
        return sorted.slice(0, 1)[0];
    },

    getHighestVote: function () {
        const sorted = this.getUsersVotesSorted();
        return sorted.slice(-1)[0];
    },

    getUserPreviousVote: function () {
        if (undefined !== _votingDetails.previous_users_votes[UserStore.getUserId()]) {
            return _votingDetails.previous_users_votes[UserStore.getUserId()];
        }
        return undefined;
    },

    getUserVote: function () {
        return _votingDetails.vote;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {

        switch (payload.action) {
            case VotingConstants.ACTION_START_NEW_VOTING:
                Socket.session.emit('change_voting_status', {status: VotingConstants.STATUS_IN_PROCESS});
                break;
            case VotingConstants.ACTION_FINISH_VOTING:
                Socket.session.emit('change_voting_status', {status: VotingConstants.STATUS_FINISHED});
                break;
            case VotingConstants.ACTION_CONTINUE_VOTING:
                Socket.session.emit('change_voting_status', {status: VotingConstants.STATUS_CONTINUE});
                break;
            case VotingConstants.ACTION_STOP_VOTING:
                Socket.session.emit('change_voting_status', {status: VotingConstants.STATUS_PENDING});
                break;
            case VotingConstants.ACTION_VOTE:
                if ('cancel' === payload.details.value) {
                    _votingDetails.vote = undefined;
                    Socket.session.emit('cancel_vote');
                } else {
                    _votingDetails.vote = payload.details.value;
                    Socket.session.emit('vote', {vote: payload.details.value});
                }
                break;
        }

        return true;
    })
});

//SocketSession.on('voting_status_changed', function (msg) {
//    console.log('voting_status_changed', msg);
//
//    switch (msg) {
//        case 'voting started':
//            _votingDetails.status = VotingConstants.STATUS_IN_PROCESS;
//            break;
//        case 'voting finished':
//            _votingDetails.status = VotingConstants.STATUS_FINISHED;
//            break;
//        case 'voting continued':
//            _votingDetails.status = VotingConstants.STATUS_IN_PROCESS;
//            break;
//        default:
//            _votingDetails.status = VotingConstants.STATUS_PENDING;
//            break;
//    }
//
//    VotingStore.emit(VotingConstants.EVENT_VOTING_STATUS_CHANGED);
//});

Socket.session.on('users_already_voted', function (msg) {
    _votingDetails.users_already_voted = msg;
    VotingStore.emit(VotingConstants.EVENT_USERS_ALREADY_VOTED);
});

Socket.session.on('users_votes', function (msg) {
    _votingDetails.users_votes = msg;
    VotingStore.emit(VotingConstants.EVENT_USERS_VOTES);
});

Socket.session.on('user_last_vote', function (msg) {
    _votingDetails.vote = msg;
    VotingStore.emit(VotingConstants.EVENT_USER_VOTE);
});

Socket.session.on('keep_previous_users_votes', function () {
    _votingDetails.previous_users_votes = _votingDetails.users_votes;
});

Socket.session.on('forget_previous_users_votes', function () {
    _votingDetails.previous_users_votes = {};
});


export default VotingStore;
