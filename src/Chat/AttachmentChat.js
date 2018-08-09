const { roomChatAll, roomWolfChatAll } = require('../Chat/Utils');

module.exports = (gamef, bot, joinID, type, data) => {
    let sendMsg;
    if (type == 'sticker') {
        sendMsg = {
            attachment: 'sticker',
            stickerID: data.stickerID,
        }
    } else if (type == 'link') {
        sendMsg = {
            attachment: 'link',
            links: data
        }
    }
    const userRoom = gamef.getUserRoom(joinID);
    if (userRoom != undefined) {
        let user = gamef.getRoom(userRoom).getPlayer(joinID);
        if (type=='link' && sendMsg.links.linktitle) {
            sendMsg.links.linktitle = `${user.first_name} đã gửi liên kết`;
        }
        if (gamef.getRoom(userRoom).alivePlayer[joinID]) { // nếu còn sống
            if (gamef.getRoom(userRoom).isNight) { // ban đêm
                let userRole = gamef.getRoom(userRoom).getRole(joinID);
                if (userRole == -1) {// là SÓI
                    if (gamef.getRoom(userRoom).chatON) {
                        roomWolfChatAll(bot, gamef.getRoom(userRoom).wolfsID, joinID, [`*${user.first_name}* đã gửi...`, sendMsg]);
                    }
                } else { // là các role khác
                    bot.say(joinID, '```\nBạn không thể trò chuyện trong đêm!\n```');
                }
            } else {
                // ban NGÀY, mọi người thảo luận
                if (gamef.getRoom(userRoom).chatON || (gamef.getRoom(userRoom).deathID != -1 && gamef.getRoom(userRoom).deathID === gamef.getRoom(userRoom).getPlayer(joinID).id)) { //check xem còn bật chat không?
                    roomChatAll(bot, gamef.getRoom(userRoom).players, joinID, [`*${user.first_name}* đã gửi...`, sendMsg]);
                } else {
                    bot.say(joinID, '```\nBạn không thể trò chuyện\n```');
                }
            }
        } else {
            bot.say(joinID, '```\nBạn đã chết! Xin giữ im lặng! \n```')
        }
        console.log(`$ ROOM ${userRoom + 1} CHAT > ${user.first_name}: ATTACHMENT content`);
    } else {
        bot.say(joinID, '```\nBạn chưa tham gia phòng nào!\n```')
    }
};