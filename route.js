const preJoinRoom = require('./src/Room/preJoin');
const joinRoom = require('./src/Room/Join');
const readyRoom = require('./src/Room/Ready');
const leaveRoom = require('./src/Room/Leave');
const newRoom = require('./src/Room/New');
const helpMenu = require('./src/Menu/Help');
const renameMenu = require('./src/Menu/TienIch').rename;
const renameAction = require('./src/Menu/TienIch').renameAction;
const infoMenu = require('./src/Menu/TienIch').info;
const adminMenu = require('./src/Menu/Admin').admin;
const kickPlayer = require('./src/Menu/Admin').kick;
const resetAll = require('./src/Menu/Admin').resetAll;

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
    } else if (message == '#new') {
        newRoom(gamef, bot, joinID);
        return true;
    } else if (message == '#help') {
        helpMenu(bot, joinID);
        return true;
    } else if (/#rename.*/g.test(message)) {
        if (message == '#rename') {
            renameMenu(gamef, bot, joinID);
        } else {
            let newName = message.match(/(?<=#rename\s).*/g)
            renameAction(gamef, bot, joinID, newName);
        }
        return true;
    } else if (message == '#info') {
        infoMenu(gamef, bot, joinID);
        return true;
    } else if (message == '#admin') {
        adminMenu(bot, joinID);
        return true;
    } else if (/\/kick.[0-9]+.[0-9]+/g.test(message)) {
        let userRoom = message.match(/[0-9]+/g)[0] - 1;
        let userID = message.match(/[0-9]+/g)[1];
        kickPlayer(gamef, bot, joinID, userRoom, userID);
        return true;
    } else if (message == '#resetAll') {
        resetAll(gamef, bot, joinID);
        return true;
    }
    return false;
}