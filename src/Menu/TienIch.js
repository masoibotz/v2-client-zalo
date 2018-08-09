const { roomChatAll } = require('../Chat/Utils');

const infoCallback = (gamef, bot, joinID) => {
    let userRoom = gamef.getUserRoom(joinID);
    if (userRoom != undefined) {
        if (gamef.getRoom(userRoom).ingame) {
            let playersInRoomTxt = gamef.getRoom(userRoom).playersTxt.join(' ; ');
            bot.say(joinID, `👨‍👩‍👦‍👦Danh sách dân và sói làng ${userRoom + 1}: \n${playersInRoomTxt}`);
        } else {
            let roomView = gamef.getSimpleRoomPlayerView(userRoom).join(`\n`);
            bot.say(joinID, roomView);
        }
    } else {
        bot.say(joinID, '```\nBạn chưa tham gia phòng chơi nào!\n```');
    }
};

const renameCallback = (gamef, bot, joinID) => {
    let userRoom = gamef.getUserRoom(joinID);
    if (userRoom == undefined) {
        bot.say(joinID, '```\nBạn cần tham gia 1 phòng chơi trước khi đổi tên!\n```');
        return;
    }
    if (gamef.getRoom(userRoom).ingame) {
        bot.say(joinID, '```\nBạn không thể đổi tên trong khi đang chơi!\n```');
        return;
    }
    let user = gamef.getRoom(userRoom).getPlayer(joinID);

    bot.say(joinID, `Tên hiện tại của bạn: ${user.first_name}\n#rename <tên mới>`);
 
};

const renameActionCallback = (gamef, bot, joinID, newName) => {
    let userRoom = gamef.getUserRoom(joinID);
    if (userRoom == undefined) {
        bot.say(joinID, '```\nBạn cần tham gia 1 phòng chơi trước khi đổi tên!\n```');
        return;
    }
    if (gamef.getRoom(userRoom).ingame) {
        bot.say(joinID, '```\nBạn không thể đổi tên trong khi đang chơi!\n```');
        return;
    }
    let user = gamef.getRoom(userRoom).getPlayer(joinID);

    roomChatAll(bot, gamef.getRoom(userRoom).players, 0, `${user.first_name} đã đổi tên thành ${newName}!`)
    user.setFirstName(newName);

};

module.exports = {
    info: infoCallback,
    rename: renameCallback,
    renameAction: renameActionCallback
}