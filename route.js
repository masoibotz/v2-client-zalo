const preJoinRoom = require('./src/Room/preJoin');
const joinRoom = require('./src/Room/Join');
const readyRoom = require('./src/Room/Ready');
const leaveRoom = require('./src/Room/Leave');

module.exports = (gamef, bot, joinID, message) => {
    // JOIN MODULE
    if (/#join.*/g.test(message)) {
        if (/#join\s[0-9]+/g.test(message)) { //join room
            joinRoom(gamef, bot, joinID, message.match(/[0-9]+/g));
        } else {
            preJoinRoom(gamef, bot, joinID);
        }
        return true;
    } else if (message == '#ready') {
        readyRoom(gamef, bot, joinID);
        return true;
    } else if (message == '#leave') {
        leaveRoom(gamef, bot, joinID);
        return true;
    }
    return false;
}