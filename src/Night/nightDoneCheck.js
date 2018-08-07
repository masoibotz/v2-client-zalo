const dayNotify = require('../Night/dayNotify');

module.exports = (gamef, bot, userRoom) => {
    gamef.getRoom(userRoom).roleIsDone((isDone) => {
        if (isDone) {
            gamef.getRoom(userRoom).findOutDeathID();
            let deathID = gamef.getRoom(userRoom).deathID;
            let deathTxt;
            if (deathID != -1) {
                deathTxt = gamef.getRoom(userRoom).playersTxt[deathID];
            }

            const askForSave = (convo) => {
                convo.ask({
                    text: `🔪Đêm hôm qua: *${deathTxt}* đã CHẾT!\nBạn có 30 giây để cứu?\n/yes hay /no ?`,
                    quickReplies: ['/yes', '/no'],
                }, (payload, convo) => {
                    gamef.getRoom(userRoom).cancelSchedule();
                    if (!payload.message || !(payload.message.text.match(/\/yes/g) || payload.message.text.match(/\/no/g))) {
                        convo.say(`\`\`\`\nKhông hợp lệ!\nBạn đã không cứu!\n\`\`\``);
                        convo.end();
                        dayNotify(gamef, bot, userRoom, false);
                        return;
                    } else {
                        if (payload.message.text.match(/\/yes/g)) { // cứu
                            gamef.getRoom(userRoom).witchUseSave();
                            convo.say(`🔮Bạn đã cứu *${deathTxt}* thành công!`);
                            gamef.getRoom(userRoom).newLog(`🔮Phù thủy *${gamef.getRoom(userRoom).getPlayer(gamef.getRoom(userRoom).witchID).first_name}* đã cứu *${deathTxt}*!`);
                            convo.end();
                            dayNotify(gamef, bot, userRoom, true);
                        } else { // không cứu
                            convo.end();
                            dayNotify(gamef, bot, userRoom, false);
                        }
                    }
                });
            };

            //Call phù thủy khi: có người chết, người chết ko phải bán sói hay già làng, còn phù thủy, còn quyền cứu
            if (deathID != -1 && gamef.getRoom(userRoom).players[deathID].role != -2 && gamef.getRoom(userRoom).players[deathID].role != 6 && deathID != gamef.getRoom(userRoom).saveID && gamef.getRoom(userRoom).witchID != undefined && gamef.getRoom(userRoom).witchSaveRemain) { //phù thủy còn quyền cứu, nạn nhân không phải bán sói
                bot.conversation(gamef.getRoom(userRoom).witchID, (convo) => {
                    let time = new Date(Date.now() + 30 * 1000);
                    gamef.getRoom(userRoom).addSchedule(time, () => {
                        console.log(`$ ROOM ${userRoom + 1} > AUTO ROLE > WITCH`);
                        convo.say(`⏰Bạn đã ngủ quên, trời sáng mất rồi!\nBạn không còn cơ hội cứu nữa!`);
                        convo.end();
                        dayNotify(gamef, bot, userRoom, false);
                    });
                    askForSave(convo);
                });
            } else {
                dayNotify(gamef, bot, userRoom, false);
            }
        }
    });
}