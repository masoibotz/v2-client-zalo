const preJoinRoom = require('./src/Room/preJoin');
const joinRoom = require('./src/Room/Join');

module.exports = (gamef, bot, joinID, message) => {
    // JOIN MODULE
    if (/#join\s?[0-9]*/g.test(message)) {
        if (/#join\s[0-9]+/g.test(message)) { //join room
            joinRoom(gamef, bot, joinID, message.match(/[0-9]+/g));
        } else {
            preJoinRoom(gamef, bot, joinID);
        }
        return true;
    }
    return false;
}