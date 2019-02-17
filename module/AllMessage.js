const handleVoteID = require('../src/HandleVoteID');
const { extractUserRole } = require('../src/DataUtils');

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
    if (data && data.state.status == 'ingame' && /\/(treo|tha)/.test(text)) {
        // treo/tha
        let treoOrTha = /\/treo/.test(text)
        let targetID = data.roleInfo.victimID;
        bot.say(joinID, await handleVoteID(chatInstance, data, userID, treoOrTha ? targetID : ""));
    } else if (data && data.state.status == 'ingame' && /[0-9]+:.+|-1/g.test(text)) {
        // target_id
        let targetIndex = text.match(/[0-9]+/g)[0];
        let playerList = userInstance.getPlayerList(joinID);
        let targetID = Object.keys(playerList)[targetIndex];
        bot.say(joinID, await handleVoteID(chatInstance, data, userID, targetID));
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
                console.log(`user.sendMessage error:`, error.info.error);
            })
        } else {
            bot.say(joinID, `Bạn không thể gửi tin nhắn!`);
        }
    }
};