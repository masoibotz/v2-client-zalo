const loginModule = require("./module/Login").login;
const logoutModule = require("./module/Login").logout;
const registerModule = require("./module/Login").register;

module.exports = (userInstance, bot, joinID, message) => {
    // JOIN MODULE
    if (/#login.*/g.test(message) || message == '#CONNECT') {
        if (message == '#login') {
            bot.say(joinID, `#login <tên đăng nhập>\nVD: #login phamngocduy98`)
        } else {
            let userID = message.match(/(?<=#login\s).*/g)[0];
            loginModule(userInstance, bot, joinID, userID);
        }
    } else if (/#register.*/g.test(message) || message == '#REGISTER') {
        if (message == '#register') {
            bot.say(joinID, `#register <tên đăng nhập>\nVD: #register phamngocduy98`)
        } else {
            let userID = message.match(/(?<=#register\s).*/g)[0];
            registerModule(userInstance, bot, joinID, userID);
        }
    } else if (message == '#logout' || message == '#DISCONNECT') {
        logoutModule(userInstance, bot, joinID);
    } else if (/#join.*/g.test(message)) {
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