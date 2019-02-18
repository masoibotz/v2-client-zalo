// Login
const loginModule = require("./module/Login").login;
const logoutModule = require("./module/Login").logout;
const registerModule = require("./module/Login").register;
// Room
const joinRoomModule = require("./module/Room").joinRoom;
const listRoomModule = require("./module/Room").listRoom;
const leaveModule = require("./module/Room").leaveRoom;
const readyModule = require("./module/Room").ready;
const startRoomModule = require("./module/Room").start;
const voteModule = require("./module/Room").vote;
// AllMessages
const allMessageModule = require("./module/AllMessage");
// Extension
const downloadAppModule = require("./module/Extension").downloadApk;

module.exports = (userInstance, bot, joinID, message) => {
    // JOIN MODULE
    if (/#login.*/g.test(message)) {
        console.log("LOGIN ROUTE");
        if (message == '#login') {
            bot.say(joinID, `#login <tên đăng nhập>\nVD: #login phamngocduy98`)
        } else {
            let userID = message.match(/(?<=#login\s).*/g)[0];
            loginModule(userInstance, bot, joinID, userID);
        }
    } else if (/#register.*/g.test(message)) {
        console.log("REG ROUTE");
        if (message == '#register') {
            bot.say(joinID, `#register <tên đăng nhập>\nVD: #register phamngocduy98`)
        } else {
            let userID = message.match(/(?<=#register\s).*/g)[0];
            registerModule(userInstance, bot, joinID, userID);
        }
    } else if (/#join.*/g.test(message)) {
        console.log("JOIN ROUTE");
        if (/#join\s[0-9]+/g.test(message)) { //join room
            joinRoomModule(userInstance, bot, joinID, message.match(/[0-9]+/g)[0])
        } else {
            listRoomModule(userInstance, bot, joinID);
        }
    } else {
        switch (message) {
            case "#vote": console.log("VOTE ROUTE"); voteModule(userInstance, bot, joinID); break;
            case "#logout": console.log("LOGOUT ROUTE"); logoutModule(userInstance, bot, joinID); break;
            case "#leave": console.log("LEAVE ROUTE"); leaveModule(userInstance, bot, joinID); break;
            case '#ready': console.log("READY ROUTE"); readyModule(userInstance, bot, joinID); break;
            case '#start': console.log("START ROUTE"); startRoomModule(userInstance, bot, joinID); break;
            case '#new': console.log("NEW ROUTE"); bot.say(joinID, `Tính năng thêm phòng chưa sẵn sàng!`); break;
            case '#kick': console.log("KICK ROUTE"); bot.say(joinID, `Tính năng kick người chơi đang trong quá trình nghiên cứu!`); break; // regexp: /\/kick.[0-9]+.[0-9]+/g
            case '#download': console.log("DOWNLOAD ROUTE"); downloadAppModule(bot, joinID); break;
            case '#help': console.log("HELP ROUTE");
                bot.say(joinID, `TRỢ GIÚP\n#register <tên> để đăng kí\nVD để đăng kí với tên là duypro, nhập tin nhắn với nội dung:\n#register duypro\n\n`
                    + `#vote <người> để vote treo cổ\n1: Duy\n2: Ngọc\n3: Phạm\nVD để vote Duy, nhập tin nhắn với nội dung: #vote 1\n\n`
                    + `Các lệnh sẽ viết bắt đầu bằng dấu #. Trong khi chơi, hãy làm theo hướng dẫn để thực hiện vai trò của mình!\n Chúc các bạn may mắn!`)
                break;
            default: console.log("MESSAGE ROUTE"); allMessageModule(userInstance, bot, joinID, message); break;
        }
    }
}