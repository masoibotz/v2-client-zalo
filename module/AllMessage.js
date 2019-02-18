const handleVoteID = require('../src/HandleVoteID');
const { extractUserRole } = require('../src/DataUtils');
const { sendCupid, sendSuperWolf, sendWitchSave } = require('../src/sendRole');

module.exports = async (userInstance, bot, joinID, text) => {
    var chatInstance = userInstance.getInstance(joinID);
    var data = userInstance.getData(joinID);
    var userID = userInstance.getUserID(joinID);
    var roomID = userInstance.getRoomID(joinID);
    // check
    if (!chatInstance || !userID) {
        bot.say(joinID, {
            text: `Vui lòng đăng nhập!`,
            buttons: [
                { type: 'postback', title: 'Đăng nhập', payload: 'CONNECT' },
                { type: 'postback', title: 'Đăng kí', payload: 'REGISTER' }
            ]
        });
        return;
    }
    if (!roomID) {
        bot.say(joinID, {
            text: `Vui lòng tham gia 1 phòng!`,
            buttons: [
                { type: 'postback', title: 'Tham gia phòng chơi', payload: 'JOIN_ROOM' },
                { type: 'postback', title: 'Đăng xuất', payload: 'DISCONNECT' }
            ]
        });
        return;
    }
    // main
    if (data && data.state.status == 'ingame') {
        var playerList = userInstance.getPlayerList(joinID);
        if (/[0-9]+:.+|-1/g.test(text) || /#[a-z]+\s[0-9]+|-1/g.test(text)) {
            // target_id
            let targetIndex = text.match(/[0-9]+/g)[0];
            let actionName = text.match(/[a-z]+/g)[0];
            let targetID = Object.keys(playerList)[targetIndex];
            let result = await handleVoteID(chatInstance, data, userID, targetID, actionName);
            if (result) {
                bot.say(joinID, `${result}`);
                return;
            }
        }
        switch (data.state.dayStage) {
            case "cupid": if (/#cupid\s[0-9]+\s[0-9]+/g.test(text)) {
                let targets = text.match(/[0-9]+/g);
                bot.say(joinID, `${await sendCupid(roomID, Object.keys(playerList)[targets[0]], Object.keys(playerList)[targets[1]])}`);
            } break;
            case "superwolf": if (/#0?nguyen/g.test(text)) {
                let nguyenOrNot = /#nguyen/g.test(text);
                bot.say(joinID, `${await sendSuperWolf(roomID, nguyenOrNot ? data.roleInfo.victimID : "")}`);
            } break;
            case "witch": if (/#0?cuu/g.test(text)) {
                let cuuOrNot = /#cuu/g.test(text);
                bot.say(joinID, `${await sendWitchSave(roomID, cuuOrNot)}`);
            } break;
            case "voteYesNo": if (/#(treo|tha)/g.test(text)) {
                // treo/tha
                let treoOrTha = /#treo/g.test(text)
                let targetID = data.roleInfo.victimID;
                bot.say(joinID, `${await handleVoteID(chatInstance, data, userID, treoOrTha ? targetID : "")}`);
            } break;
        }
    } else {
        // tin nhắn
        var userRole;
        if (!data || (data && data.state.status == 'waiting') || // phòng chờ / vừa join phòng
            (data && (userRole = extractUserRole(data, userID)) && (
                (data.state.dayStage == 'night' && (userRole == -1 || userRole == -3 || userID == data.roleInfo.superWolfVictimID)) || // đêm là sói
                data.state.dayStage == 'discuss' || // thảo luận
                (data.state.dayStage == 'lastWord' && userID == data.roleInfo.victimID)// trăn trối / giẫy
            ))
        ) {
            // message_content
            chatInstance.sendMessage({
                text: text,
                roomId: roomID,
            }).catch(err => {
                bot.say(joinID, `Không gửi được tin nhắn!\nuser.sendMessage error`);
                console.log(`user.sendMessage error: `, error.info.error);
            })
        } else {
            bot.say(joinID, `Bạn không thể gửi tin nhắn!`);
        }
    }
};