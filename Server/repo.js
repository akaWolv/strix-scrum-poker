const storage = require('diskdb');

storage.connect('storage', ['users', 'users_connections', 'rooms', 'votings']);

const repo = {};

repo._functionizer = function(f) {
    return typeof f === "function" ? f : function() {}
};

repo.getRoomByAdmin = function(user_id, f) {
    let roomsFound = storage.rooms.find({admin: user_id});

    let roomDetails = undefined !== roomsFound[0] ? roomsFound[0] : {};

    if (undefined !== roomDetails.id) {
        let users = storage.users.find({room_id: roomDetails.id});
        roomDetails.users = undefined !== users ? users : [];
    }

    f = this._functionizer(f);
    f(null, roomDetails);
};

repo.getAllVotes = function(f) {
    let votesList = storage.votings.find();

    f = this._functionizer(f);
    f(null, votesList);
};

repo.saveVote = function(room_id, user_id, vote, f) {
    storage.votings.update({user_id}, {user_id, room_id, vote}, {upsert: true});

    f = this._functionizer(f);
    f(null, vote);
};

repo.removeVote = function(user_id, f) {
    storage.votings.remove({user_id}, true);

    f = this._functionizer(f);
    f(null,);
};

repo.removeVotings = function(room_id, f) {
    storage.votings.remove({room_id}, true);

    f = this._functionizer(f);
    f(null, room_id);
};

repo.getUserVote = function(room_id, user_id, f) {
    let vote = storage.votings.find({room_id, user_id});

    f = this._functionizer(f);
    f(null, vote);
};

repo.getVotesInRoom = function(room_id, f) {
    let voteList = storage.votings.find({room_id});

    f = this._functionizer(f);
    f(null, voteList);
};

repo.removeRoomConnectionFromUser = function(id, f) {
    storage.users.update({id}, {room_id: undefined});

    f = this._functionizer(f);
    f(null, id);
};

repo.getUsersInAnyRoom = function(f) {
    let userList = storage.users.find();

    userList = userList.filter(i => i.room_id !== undefined);

    f = this._functionizer(f);
    f(null, userList);
};

repo.saveRoom = function(details, f) {
    if (undefined === details.id) {
        return false;
    }

    details.users = [];

    storage.rooms.update({id: details.id}, details, {upsert: true});

    f = this._functionizer(f);
    f(null, details);
};

repo.saveUser = function(details, f) {
    if (undefined === details.id) {
        return false;
    }
    storage.users.update({id: details.id}, details, {upsert: true});

    f = this._functionizer(f);
    f(null, details);
};

repo.getUsersInRoom = function(room_id, f) {
    let users = storage.users.find({room_id: room_id});

    f = this._functionizer(f);
    f(null, users);
};

repo.getUserDetails = function(user_id, f) {
    let users = storage.users.find({id: user_id});

    f = this._functionizer(f);
    f(null, undefined !== users[0] ? users[0] : {});
};

repo.getAllRooms = function(f) {
    let roomList = storage.rooms.find();

    f = this._functionizer(f);
    f(null, roomList);
};

repo.getRoomDetails = function(room_id, f) {
    let roomsFound = storage.rooms.find({id: room_id});

    let roomDetails = undefined !== roomsFound[0] ? roomsFound[0] : {};
    if (undefined !== roomDetails.id) {
        let users = storage.users.find({room_id: roomDetails.id});
        roomDetails.users = undefined !== users ? users : [];
    }

    f = this._functionizer(f);
    f(null, roomDetails);
};

repo.getRoomByNameAndPass = function(name, password, f) {
    let roomsFound = storage.rooms.find({name: name, password: password});

    let roomDetails = undefined !== roomsFound[0] ? roomsFound[0] : {};
    if (undefined !== roomDetails.id) {
        let users = storage.users.find({room_id: roomDetails.id});
        roomDetails.users = undefined !== users ? users : [];
    }

    f = this._functionizer(f);
    f(null, roomDetails);
};


module.exports = repo;
