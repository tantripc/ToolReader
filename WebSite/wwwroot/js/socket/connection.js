////window.addEventListener('load', function () {


////    var connection = _connection(WEBSOCKET_URL, WEBSOCKET_PATH, window.location.hostname, { room: room.virtualroom, user: user.code, username: user.name, useremail: user.email, useravatar: user.avatar }, function () { });
////    window.connection = connection;

////});

function _connection(socketio_domain, socketio_path, socketio_namespace, options, callback) {
    if (!socketio_domain) {
        return;
    }

    if (!options) {
        return;
    }

    if (typeof io !== 'function') {
        return;
    }

    var roomid = options.room;

    var connection = io(socketio_domain + socketio_namespace, {
        path: socketio_path || '',
        query: {
            roomid: roomid || '',
            userid: options.user || '',
            username: options.username || '',
            useremail: options.useremail || '',
            useravatar: options.useravatar || ''
        }
        
    });
    connection.room = {
        users: []
    };

    connection.on('connection', function (room) {
        connection.room = typeof room === "object" ? room : {};

        //if (window.location.hostname === 'localhost')
        //    console.log('connection', room);

        if (typeof callback === "function") {
            callback();
        }
    });

    connection.onJoin = function (user, users) {
        /*if (window.location.hostname === 'localhost') console.log(user, users);*/
    };
    connection.on('join', function (user) {
        if (typeof user !== "object") {
            return;
        }

        if (typeof connection.room.users !== "object") {
            connection.room.users = [];
        }

        if (!connection.room.users.filter(function (f) { return f.id === user.id; }).length) {
            connection.room.users.push(user);
        }

        if (typeof connection.onJoin === "function") {
            connection.onJoin(user, connection.room.users);
        }
    });

    connection.onLeave = function (user, users) {
        /*if (window.location.hostname === 'localhost') console.log(user, users);*/
    };
    connection.on('leave', function (user) {
        if (typeof user !== "object") {
            return;
        }

        if (typeof connection.room.users !== "object") {
            connection.room.users = [];
        }

        if (typeof connection.onLeave === "function") {
            connection.onLeave(user, connection.room.users);
        }
    });

    //SEND
    connection.send = function (data) {
        data.roomid = roomid;
        connection.emit('send-data', data);
    };

    //RECEIVE
    var handleReceive = [];
    connection.receive = function (fn) {
        if (typeof fn === "function") {
            handleReceive.push(fn);
        }
    };
    connection.on('receive-data', function (data) {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        if (typeof data !== "object") {
            return;
        }

        if (data.roomid !== roomid) {
            return;
        }

        handleReceive.forEach(function (fn) {
            fn(data);
        });

        //if (window.location.hostname === 'localhost')
        //    console.log('receive-data', data);
    });

    //CUSTOM
    connection.updateUser = function (data) {
        if (!data || typeof data !== "object") {
            return;
        }

        data.roomid = roomid;
        connection.emit('update-user', data);

        connection.room.users.filter(function (f) {
            if (f.id === data.id) {
                Object.assign(f, data);
            }
        });
    };

    connection.onUpdate = function (data) {
        /*if (window.location.hostname === 'localhost')console.log(data);*/
    };
    connection.on('receive-user', function (data) {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        if (typeof data !== "object") {
            return;
        }

        if (connection.room) {
            connection.room.users.filter(function (f) {
                if (f.id === data.id) {
                    Object.assign(f, data);
                }
            });
        }

        if (typeof connection.onUpdate === "function") {
            connection.onUpdate(data);
        }
    });

    connection.updateRoomStatus = function (data) {
        if (!data || typeof data !== "object") {
            return;
        }

        data.roomid = roomid;
        connection.emit('update-room-status', data);

        if (connection.room.status) {
            Object.assign(connection.room.status, data);
        }
        else {
            connection.room.status = data;
        }
    };

    connection.on('receive-room-status', function (data) {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        if (typeof data !== "object") {
            return;
        }

        if (connection.room.status) {
            Object.assign(connection.room.status, data);
        }
        else {
            connection.room.status = data;
        }
    });

    //DELETE ROOM
    connection.deleteRoom = function () {
        if (MANAGER !== "1") {
            return;
        }
        connection.emit('delete-room', { roomid: roomid });
    };

    return connection;
}
