const preJoinRoom = require('./src/Room/preJoin');
const joinRoom = require('./src/Room/Join');
const readyRoom = require('./src/Room/Ready');
const leaveRoom = require('./src/Room/Leave');
const newRoom = require('./src/Room/New');

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
    } else if (message == 'upload') {
        bot.sendImageMessage(joinID, 'http://hstatic.net/936/1000019936/10/2015/7-28/masoi.jpg');
        bot.sendImageMessage(joinID, 'http://hstatic.net/936/1000019936/10/2015/11-18/tien-tri.jpg');
        bot.sendImageMessage(joinID, 'http://hstatic.net/936/1000019936/10/2015/7-28/baove.jpg');
        bot.sendImageMessage(joinID, 'http://hstatic.net/936/1000019936/10/2015/7-28/thosan.jpg');
        bot.sendImageMessage(joinID, 'http://hstatic.net/936/1000019936/10/2015/7-28/phanboi.jpg');
        bot.sendImageMessage(joinID, 'http://hstatic.net/936/1000019936/10/2015/7-28/phuthuy.jpg');
        bot.sendImageMessage(joinID, 'http://hstatic.net/936/1000019936/10/2015/7-28/gialang.jpg');
        bot.sendImageMessage(joinID, 'http://hstatic.net/936/1000019936/10/2015/7-28/cupid.jpg');
        bot.sendImageMessage(joinID, 'http://hstatic.net/936/1000019936/10/2015/7-28/danlang.jpg');
    }
    return false;
}