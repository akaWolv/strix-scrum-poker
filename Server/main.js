require('dotenv').config();
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const crypto = require('crypto');
const uuid = require('uuid');
// var mongojs = require('mongojs');
const _ = require('underscore');
const repo = require('./repo');
const Table = require("terminal-table");

console.log('Starting app');
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// SYSTEM
const CONNECTION = 'connection';
const DISCONNECT = 'disconnect';

// USER
const REGISTER_NEW_USER = 'register_new_user';
const REGISTER_USER_BY_ID = 'register_user_by_id';
const EMIT_USER_DETAILS = 'user_details';
const EMIT_REGISTER_USER_FAIL = 'register_user_fail';
const EMIT_REGISTER_USER_SUCCESS = 'register_user_success';
const EMIT_USER_NOT_FOUND = 'user_not_found';

const EMIT_INTRODUCE_YOURSELF = 'hello';

// ROOM
const PREVIEW_ROOM = 'preview_room';
const CREATE_ROOM = 'create_room';
const EMIT_CREATE_ROOM_FAIL = 'create_room_fail';
const EMIT_CREATE_ROOM_SUCCESS = 'create_room_success';
const EMIT_ROOM_DETAILS = 'room_details';
const EMIT_ROOM_NOT_FOUND = 'room_not_found';
const EMIT_JOIN_ROOM_SUCCESS = 'join_room_success';
const EMIT_JOIN_ROOM_ANONYMOUS = 'join_room_anonymous';
const EMIT_JOIN_ROOM_PREVIEW = 'join_room_preview';
const JOIN_ROOM = 'join_room';
const JOIN_ROOM_BY_NAME_AND_PASS = 'join_room_by_name_and_pass';
const LEAVE_ROOM = 'leave_room';

// VOTING
const CHANGE_VOTING_STATUS = 'change_voting_status';
const VOTE = 'vote';
const CANCEL_VOTE = 'cancel_vote';
// VOTING STATUSES
const STATUS_PENDING = 'STATUS_PENDING';
const STATUS_IN_PROCESS = 'STATUS_IN_PROCESS';
const STATUS_FINISHED = 'STATUS_FINISHED';
const STATUS_CONTINUE = 'STATUS_CONTINUE';
//VOTING EMMITS
const EMIT_USERS_ALREADY_VOTED = 'users_already_voted';
const EMIT_USERS_VOTES = 'users_votes';
const EMIT_USER_LAST_VOTE = 'user_last_vote';
const EMIT_KEEP_PREVIOUS_USERS_VOTES = 'keep_previous_users_votes';
const EMIT_FORGET_PREVIOUS_USERS_VOTES = 'forget_previous_users_votes';

const CONNECTIONS_LOG = [];

function application() {

    io.on(CONNECTION, function (socket) {

        socket.user_details = {
            id: undefined,
            name: undefined,
            room_id: undefined
        };

        /**
         * CREATE_ROOM
         */
        socket.on(CREATE_ROOM, function (msg) {
            _infoLog(CREATE_ROOM);
            if (undefined !== msg.name && undefined !== msg.sequence) {
                let roomsDetails = {
                    id: uuid.v4(),
                    name: msg.name,
                    password: msg.password,
                    sequence: msg.sequence,
                    users: {},
                    admin: socket.user_details.id,
                    voting_status: STATUS_PENDING
                };

                // save room
                repo.saveRoom(
                    roomsDetails,
                    function (err, roomsDetails) {
                        // join created room
                        joinRoom(roomsDetails);
                    }
                );

                return true;
            }

            emitter(socket, EMIT_CREATE_ROOM_FAIL);
            return false;
        });

        /**
         * REGISTER_USER_BY_ID
         */
        socket.on(REGISTER_USER_BY_ID, function (msg) {
            _infoLog(' [>>>>>] ' + REGISTER_USER_BY_ID, msg);
            if (undefined !== msg.id) {
                _registerUser(msg.id)
            }
        });

        /**
         * REGISTER_NEW_USER
         */
        socket.on(REGISTER_NEW_USER, function (msg) {
            _infoLog(REGISTER_NEW_USER);
            if (undefined !== msg.name) {
                socket.user_details = {
                    id: uuid.v4(),
                    name: msg.name,
                    room_id: msg.room_id
                };

                repo.saveUser(
                    socket.user_details,
                    function (err, userDetails) {
                        _registerUser(userDetails.id);
                    }
                );

            } else {
                emitter(socket, EMIT_REGISTER_USER_FAIL);
            }
        });

        /**
         * JOIN_ROOM_BY_NAME_AND_PASS
         */
        socket.on(JOIN_ROOM_BY_NAME_AND_PASS, function (msg) {
            if (undefined !== msg.name && undefined !== msg.password) {
                joinRoomByNameAndPass(msg.name, msg.password);
            } else {
                emitter(socket, EMIT_ROOM_NOT_FOUND);
            }
        });

        /**
         * PREVIEW_ROOM
         */
        socket.on(PREVIEW_ROOM, function (msg) {
            if (undefined !== msg.id) {
                joinRoomById(msg.id, true);
            } else if (undefined !== msg.name && undefined !== msg.password) {
                joinRoomByNameAndPass(msg.name, msg.password, true);
            } else {
                emitter(socket, EMIT_ROOM_NOT_FOUND);
            }
        });

        /**
         * JOIN_ROOM
         */
        socket.on(JOIN_ROOM, function (msg) {
            _infoLog(' [>>>>>] JOIN_ROOM: ' + msg.id + ' | ' + msg.user_id);
            if (undefined !== msg.user_id) {
                // register user
                _registerUser(msg.user_id);
            }
            if (undefined !== msg.id) {
                // find and join room
                joinRoomById(msg.id);
            }
        });

        /**
         * LEAVE_ROOM
         */
        socket.on(LEAVE_ROOM, function () {
            _infoLog(' [>>>>>] LEAVE_ROOM: ');
            _disconnectUser();
        });

        /**
         * DISCONNECT
         */
        socket.on(DISCONNECT, function () {
            _infoLog(' [>>>>>] DISCONNECT: ');
            _disconnectUser();
        });

        //
        //
        //
        //
        //

        // function _pickAdmin(roomsDetails, afterWaitPeriod) {
        //     _infoLogGlobal('CHECKING ROOM ADMIN', roomsDetails);
        //     if (undefined !== roomsDetails.users[0]) {
        //         if (undefined === roomsDetails.admin) {
        //             _pickAdmin(roomsDetails, true);
        //         } else {
        //             // if admin present in room
        //             for (let a in roomsDetails.users) {
        //                 if (roomsDetails.admin === roomsDetails.users[a].id) {
        //                     _infoLogGlobal('CHECKING ROOM ADMIN | same admin');
        //                     return true;
        //                 }
        //             }
        //         }
        //     }
        //
        //     if (true === afterWaitPeriod) {
        //         // admin left - pick next user as admin
        //         if (undefined !== roomsDetails.users[0]) {
        //             _infoLogGlobal('CHECKING ROOM ADMIN | admin changed');
        //             let newRoomsDetails = roomsDetails;
        //             newRoomsDetails.admin = roomsDetails.users[0].id;
        //             repo.saveRoom(
        //                 newRoomsDetails,
        //                 function (err, roomDetails) {
        //                     roomEmitter(EMIT_ROOM_DETAILS, roomDetails)
        //                 });
        //             return true;
        //         }
        //     } else {
        //         // wait few seconds in case of reloading
        //         setTimeout(function () {
        //             repo.getRoomDetails(
        //                 roomsDetails.id,
        //                 function (err, roomsDetails) {
        //                     if (undefined !== roomsDetails.id) {
        //                         _pickAdmin(roomsDetails, true);
        //                     }
        //                 }
        //             )
        //         }, 5000);
        //     }
        // }

        function _disconnectUser() {
            _cancelVote();
            let room_id = socket.user_details.room_id;
            if (undefined !== room_id) {
                repo.removeRoomConnectionFromUser(
                    socket.user_details.id,
                    function () {
                        _emitRoomDetails(room_id);
                    }
                );
            }
        }

        function _emitUserDetails(user_id) {
            repo.getUserDetails(user_id, function (err, userDetails) {
                emitter(socket, EMIT_USER_DETAILS, userDetails);
            });
        }

        function _registerUser(user_id) {
            repo.getUserDetails(
                user_id,
                function (err, userDetails) {
                    if (undefined !== userDetails.id) {
                        let shouldUpdateUser = (socket.user_details.name !== userDetails.name
                            || socket.user_details.room_id !== userDetails.room_id);

                        socket.user_details.id = user_id;
                        socket.user_details.name = userDetails.name;

                        if (
                            undefined === socket.user_details.room_id
                            && undefined !== userDetails.room_id
                        ) {
                            socket.user_details.room_id = userDetails.room_id;
                        }

                        if (true === shouldUpdateUser) {
                            repo.saveUser(socket.user_details);
                        }

                        if (undefined !== socket.user_details.room_id) {
                            joinRoomById(socket.user_details.room_id);
                        }
                    } else {
                        emitter(socket, EMIT_USER_NOT_FOUND);
                    }

                    _emitUserDetails(user_id);
                }
            );
        }

        /**
         * join room by id
         * @param roomId
         * @param isPreview
         */
        function joinRoomById(roomId, isPreview) {
            repo.getRoomDetails(roomId, function (err, roomDetails) {
                if (undefined !== roomDetails.id) {
                    _infoLog('room found - joining');
                    joinRoom(roomDetails, isPreview);
                } else {
                    emitter(socket, EMIT_ROOM_NOT_FOUND);
                    socket.user_details.room_id = undefined;
                }
            });
        }

        /**
         * join room by id
         * @param name
         * @param password
         * @param isPreview
         */
        function joinRoomByNameAndPass(name, password, isPreview) {
            repo.getRoomByNameAndPass(
                name,
                password,
                function (err, roomDetails) {
                    if (undefined !== roomDetails.id) {
                        // join created room
                        joinRoom(roomDetails, isPreview);
                        _infoLog('room found and joined');
                    } else {
                        emitter(socket, EMIT_ROOM_NOT_FOUND);
                    }
                });
        }

        /**
         * join room
         * @param roomsDetails
         * @param isPreview
         */
        function joinRoom(roomsDetails, isPreview) {
            // join room socket
            socket.join('room_' + roomsDetails.id);

            socket.user_details.room_id = roomsDetails.id;
            if (true === (undefined === isPreview ? false : isPreview)) {
                socket.emit(EMIT_JOIN_ROOM_PREVIEW, roomsDetails);
                _infoLog('EMIT_JOIN_ROOM_PREVIEW');
            } else if (socket.user_details.id === undefined) {
                // roomsDetails.users = [];
                socket.emit(EMIT_JOIN_ROOM_ANONYMOUS, roomsDetails);
                _infoLog('EMIT_JOIN_ROOM_ANONYMOUS');
            } else {
                // save user
                repo.saveUser(
                    socket.user_details,
                    function (err, userDetails) {
                        // emit succes to user
                        emitter(socket, EMIT_JOIN_ROOM_SUCCESS, roomsDetails);
                        ensureCorrectAdmin(roomsDetails);
                    }
                );

                // _pickAdmin(roomsDetails);
            }

            // voting details if exists
            emitVotingDetails(roomsDetails);

            _emitRoomDetails(roomsDetails.id);

            _emitUsersThatAlreadyHaveVoted(roomsDetails.id);
        }

        ///////////////////////////
        ///////////////////////////
        /////////VOTING////////////
        ///////////////////////////
        ///////////////////////////

        /**
         * VOTE
         */
        socket.on(VOTE, function (msg) {
            if (
                undefined !== msg.vote
                && undefined !== socket.user_details.room_id
            ) {
                // @todo: check if vote in sequence
                repo.saveVote(
                    socket.user_details.room_id,
                    socket.user_details.id,
                    msg.vote,
                    (err, vote) => _emitUsersThatAlreadyHaveVoted()
                );
                emitter(socket, EMIT_USER_LAST_VOTE, msg.vote);
                _finishIfAllVotesCollected();
            }
        });

        /**
         * CANCEL_VOTE
         */
        socket.on(CANCEL_VOTE, function () {
            _cancelVote();
        });

        /**
         * CHANGE_VOTING_STATUS
         */
        socket.on(CHANGE_VOTING_STATUS, function (msg) {
            _infoLogGlobal('change_voting_status', msg);
            if (
                undefined !== msg.status
                && undefined !== socket.user_details.room_id
                && -1 < [STATUS_PENDING, STATUS_IN_PROCESS, STATUS_FINISHED, STATUS_CONTINUE].indexOf(msg.status)
            ) {
                forAdmin(function (roomDetails) {
                    _changeVotingSatus(msg.status, roomDetails);
                });
            }
        });

        function _changeVotingSatus(status, roomDetails) {
                roomDetails.voting_status = status === STATUS_CONTINUE ? STATUS_IN_PROCESS : status;
                repo.saveRoom(roomDetails);

                switch (status) {
                    case STATUS_PENDING:
                        clearVotes();
                        roomEmitter(EMIT_USER_LAST_VOTE, undefined);
                        forgetPreviousVotes();
                        break;
                    case STATUS_IN_PROCESS:
                        hideVotes();
                        roomEmitter(EMIT_USER_LAST_VOTE, undefined);
                        // repo.getUserVote(
                        //     roomsDetails.id,
                        //     socket.user_details.id,
                        //     (err, vote) => emitter(socket, EMIT_USER_LAST_VOTE, vote)
                        // );
                        break;
                    case STATUS_CONTINUE:
                        keepPreviousVotes();
                        clearVotes();
                        roomEmitter(EMIT_USER_LAST_VOTE, undefined);
                        // repo.getUserVote(
                        //     roomsDetails.id,
                        //     socket.user_details.id,
                        //     (err, vote) => emitter(socket, EMIT_USER_LAST_VOTE, vote)
                        // );
                        break;
                    case STATUS_FINISHED:
                        showVotes();
                        break;
                }

                _emitRoomDetails(roomDetails.id)
        }

        function _emitUsersThatAlreadyHaveVoted() {
            repo.getVotesInRoom(
                socket.user_details.room_id,
                function (err, voteList) {
                    let userList = [];
                    if (voteList.length > 0) {
                        userList = voteList.map(i => i.user_id)
                    }
                    roomEmitter(EMIT_USERS_ALREADY_VOTED, userList)
                }
            );
        }

        function _finishIfAllVotesCollected() {
            repo.getVotesInRoom(
                socket.user_details.room_id,
                function (err, voteList) {
                    repo.getUsersInRoom(socket.user_details.room_id, function (err, users) {
                        if (users.length === voteList.length) {
                            console.log('>>>>>>>>>>>>>');
                            withRoomDetails(function (roomDetails) {
                                _changeVotingSatus(STATUS_FINISHED, roomDetails);
                            });
                        }
                    })
                }
            );
        }

        function clearVotes() {
            repo.removeVotings(socket.user_details.room_id);
            roomEmitter(EMIT_USERS_VOTES, {});
            roomEmitter(EMIT_USERS_ALREADY_VOTED, []);
        }

        function hideVotes() {
            roomEmitter(EMIT_USERS_VOTES, {});
        }

        function keepPreviousVotes() {
            roomEmitter(EMIT_KEEP_PREVIOUS_USERS_VOTES, {});
        }

        function forgetPreviousVotes() {
            roomEmitter(EMIT_FORGET_PREVIOUS_USERS_VOTES, {});
        }

        function showVotes() {
            repo.getVotesInRoom(socket.user_details.room_id, function (err, votes) {
                let userVotes = {};
                if (undefined !== votes) {
                    for (let k in votes) {
                        userVotes[votes[k].user_id] = votes[k].vote;
                    }
                }
                roomEmitter(EMIT_USERS_VOTES, userVotes);
            });
        }

        /**
         * Emits voting details
         */
        function emitVotingDetails(roomsDetails) {
            repo.getVotesInRoom(roomsDetails.id, function (err, voteList) {
                if (voteList.length > 0) {
                    for (let k in voteList) {
                        // last user vote
                        if (voteList[k].id === socket.user_details.id) {
                            socket.emit(EMIT_USER_LAST_VOTE, voteList[k].vote);
                        }
                    }

                    // emitter(socket, EMIT_USER_LAST_VOTE, lastUserVote);

                    if (roomsDetails.voting_status === STATUS_FINISHED) {
                        showVotes();
                    }
                }
            });

            _emitUsersThatAlreadyHaveVoted();
        }

        ///////////////////////////
        ///////////////////////////
        //////////PRIVS////////////
        ///////////////////////////
        ///////////////////////////

        function _cancelVote() {
            console.log('CANCEL_VOTE');
            repo.removeVote(socket.user_details.id);
            _emitUsersThatAlreadyHaveVoted();
            emitter(socket, EMIT_USER_LAST_VOTE);
        }

        function forAdmin(f) {
            repo.getRoomDetails(socket.user_details.room_id, function (err, roomDetails) {
                if (undefined !== roomDetails.id && roomDetails.admin === socket.user_details.id) {
                    f(roomDetails);
                }
            });
        }

        function withRoomDetails(f) {
            repo.getRoomDetails(socket.user_details.room_id, function (err, roomDetails) {
                f(roomDetails);
            });
        }

        /**
         * Emit with logger to console
         * @param socket
         * @param name
         * @param message
         */
        function emitter(socket, name, message) {
            socket.emit(name, message);
            _infoLog(' [priv] | ' + name, message)
        }

        /**
         * Emit with logger to console
         * @param name
         * @param message
         * @param roomId
         */
        function roomEmitter(name, message, roomId) {
            io.to('room_' + socket.user_details.room_id).emit(name, message);
            _infoLogGlobal(' [ROOM] ' + socket.user_details.room_id + '| ' + name, message)
        }

        /**
         * INFO TO CONSOLE
         * @param log_name
         * @param log
         */
        function _infoLog(log_name, log) {
            let info_log = {};
            info_log.pipe = socket.picked_pipe;
            info_log.client_id = socket.client.id;
            info_log.ip = socket.handshake.address;
            // merge two objects
            if (undefined !== log && 'object' === typeof log) {
                for (let attr_name in log) {
                    info_log[attr_name] = log[attr_name];
                }
            }
            let logDate = new Date();
            logDate = logDate.toISOString().split('T').join(' ').split('Z').join('');
            console.log(logDate + '|' + log_name + '|' + JSON.stringify(info_log));
        }

        _infoLog(' [>>>>>] CONNECTION');
    });

    // ********
    // ********
    // ********
    // ********
    // ********

    function ensureCorrectAdmin(roomDetails) {
        if (
            roomDetails.admin === undefined
            && roomDetails.users !== undefined
            && roomDetails.users.length > 0
        ) {
            console.log('>>>>>>>>>>>>>>>>... NO ADMIN - but users');
            _changeAdmin(roomDetails.id);
        } else {
            // console.log('>>>>>>>>>>>>>>>>... ADMIN and USERS checking');
            let adminFound = roomDetails.users.filter(function (i) {
                return roomDetails.admin === i.id;
            }).length;
// console.log('>>>>>> adminFound: ' + adminFound);
            if (adminFound === 0) {
                _changeAdmin(roomDetails.id);
                // } else {
                //     console.log(roomDetails);
            }
        }
    }

    function _changeAdmin(room_id) {
        repo.getRoomDetails(room_id, function (err, roomDetails) {
            const adminBefore = undefined === roomDetails.admin ? undefined : roomDetails.admin;
            if (undefined === roomDetails.id) {
                return false;
            }

            let admin = roomDetails.users.slice(0, 1).shift();
            roomDetails.admin = undefined === admin ? undefined : admin.id;
            // console.log('>>>>>> roomDetails.admin' + roomDetails.admin);

            if (adminBefore !== roomDetails.admin) {
                repo.saveRoom(roomDetails, function (err, roomDetails) {
                    _emitRoomDetails(roomDetails.id)
                });
            }
        });
    }

    function cleanUpOrphansRoomConnections() {
        repo.getUsersInAnyRoom(function (err, userList) {
            for (let k in userList) {
                // if 'in-room' user not connected
                if (0 === CONNECTIONS_LOG.filter(i => i.id === userList[k].id).length) {
                    console.log('Remove: ' + userList[k].id);
                    repo.removeVote(userList[k].id);
                    repo.removeRoomConnectionFromUser(userList[k].id);
                    repo.getRoomDetails(userList[k].room_id, function (err, roomDetails) {
                        io.to('room_' + roomDetails.id).emit(EMIT_ROOM_DETAILS, roomDetails);
                        // _infoLogGlobal(' [ROOM] ' + roomDetails.id + '| ' + EMIT_ROOM_DETAILS, roomDetails)
                    });
                }
            }
        });

        repo.getAllRooms(function (err, roomList) {
            for (let k in roomList) {
                repo.getRoomDetails(
                    roomList[k].id,
                    function (err, roomDetails) {
                        ensureCorrectAdmin(roomDetails);
                    }
                );
            }
        });

        // repo.getAllVotes(function (err, votesList) {
        //     for (let k in votesList) {
        //         if (0 === CONNECTIONS_LOG.filter(i => i.id === votesList[k].user_id).length) {
        //             repo.removeVote(votesList[k].user_id);
        //             _emitRoomDetails(votesList[k].room_id);
        //         }
        //     }
        // });
    }

    /**
     * @param room_id
     * @private
     */
    function _emitRoomDetails(room_id) {
        repo.getRoomDetails(room_id, function (err, roomDetails) {
            io.to('room_' + room_id).emit(EMIT_ROOM_DETAILS, roomDetails);
            _infoLogGlobal(' [ROOM] ' + room_id + '| ' + EMIT_ROOM_DETAILS, roomDetails)
        });
    }

    function echoSockets() {
        if (_.values(io.sockets.connected).length === 0) {
            console.log('no connections');
            setTimeout(echoSockets, 1000)
        } else {
            CONNECTIONS_LOG.splice(0, CONNECTIONS_LOG.length);
            for (let k in io.sockets.connected) {
                let log = io.sockets.connected[k].user_details;
                log.socket_id = io.sockets.connected[k].id;
                CONNECTIONS_LOG.push(log);
            }

            let t = new Table({
                borderStyle: 2,
                horizontalLine: true,
                leftPadding: 1,
                rightPadding: 1
            });
            t.push([
                'CONNECTION',
                'ID',
                'NAME',
                'ROOM'
            ]);
            for (let k in CONNECTIONS_LOG) {
                t.push([
                    CONNECTIONS_LOG[k].socket_id || '?',
                    CONNECTIONS_LOG[k].id || 'anonymous',
                    CONNECTIONS_LOG[k].name || 'unnamed',
                    CONNECTIONS_LOG[k].room_id || 'not in room'
                ]);
            }

            // console.log("" + t);
            console.log('cleanUpOrphansRoomConnections');
            cleanUpOrphansRoomConnections();
            setTimeout(echoSockets, 5000)
        }

    }

    echoSockets();

    /**
     * INFO TO CONSOLE
     * @param log_name
     * @param log
     */
    function _infoLogGlobal(log_name, log) {
        let info_log = {};
        // merge two objects
        if (undefined !== log && 'object' === typeof log) {
            for (let attr_name in log) {
                info_log[attr_name] = log[attr_name];
            }
        }
        let logDate = new Date();
        logDate = logDate.toISOString().split('T').join(' ').split('Z').join('');
        console.log(logDate + '|' + log_name + '|' + JSON.stringify(info_log));
    }

    http.listen(3003, function () {
        console.log('listening on *:3003');
    });
}

application();


