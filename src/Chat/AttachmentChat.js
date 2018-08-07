const { roomChatAll, roomWolfChatAll } = require('../Chat/Utils');

module.exports = (gamef, bot) => {
    bot.on('attachment', (payload, chat) => {
        let joinID = payload.sender.id;
        const userRoom = gamef.getUserRoom(joinID);
        let img = payload.message.attachments[0];
        if (img.type != 'image') {
            chat.say(`\`\`\`\nNội dung bạn vừa gửi không được Bot hỗ trợ!\n\`\`\``);
            if (userRoom != undefined) {
                let user = gamef.getRoom(userRoom).getPlayer(joinID);
                console.log(`$ ROOM ${userRoom + 1} CHAT > ${user.first_name}: not support content`);
                console.log(JSON.stringify(payload.message.attachments));
                roomChatAll(bot, gamef.getRoom(userRoom).players, joinID, `*${user.first_name}* đã gửi nội dung không được hỗ trợ!`);
            }
        } else {
            if (userRoom != undefined) {
                let user = gamef.getRoom(userRoom).getPlayer(joinID);
                if (gamef.getRoom(userRoom).alivePlayer[joinID]) { // nếu còn sống
                    if (gamef.getRoom(userRoom).isNight) { // ban đêm
                        let userRole = gamef.getRoom(userRoom).getRole(joinID);
                        if (userRole == -1) {// là SÓI
                            if (gamef.getRoom(userRoom).chatON) {
                                roomWolfChatAll(bot, gamef.getRoom(userRoom).wolfsID, joinID, [`*${user.first_name}* đã gửi 1 sticker/ảnh/gif ...`, {
                                    attachment: 'image',
                                    url: img.payload.url
                                }]);
                            }
                        } else { // là các role khác
                            chat.say('```\nBạn không thể trò chuyện trong đêm!\n```');
                        }
                    } else {
                        // ban NGÀY, mọi người thảo luận
                        if (gamef.getRoom(userRoom).chatON || (gamef.getRoom(userRoom).deathID != -1 && gamef.getRoom(userRoom).deathID === gamef.getRoom(userRoom).getPlayer(joinID).id)) { //check xem còn bật chat không?
                            roomChatAll(bot, gamef.getRoom(userRoom).players, joinID, [`*${user.first_name}* đã gửi 1 sticker/ảnh/gif ...`, {
                                attachment: 'image',
                                url: img.payload.url
                            }]);
                        } else {
                            chat.say('```\nBạn không thể trò chuyện\n```');
                        }
                    }
                } else {
                    chat.say('```\nBạn đã chết! Xin giữ im lặng! \n```')
                }
                console.log(`$ ROOM ${userRoom + 1} CHAT > ${user.first_name}: IMAGE content`);
            }
        }
    });
};