const { extractUserRole } = require('../src/DataUtils');

module.exports = async (userInstance, bot, joinID, attachmentType, attachmentLink) => {
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
        userInstance.getInstance(joinID).sendMessage({
            text: `${userID} gửi đính kèm...`,
            roomId: roomID,
            attachment: {
                link: attachmentLink,
                type: attachmentType
            }
        }).catch(err => {
            chat.say(`Không gửi được tin nhắn!\nuser.sendMessage_error`);
            console.log(`user.sendMessage_error:`, error.info.error);
        })
    } else {
        bot.say(joinID, `Bạn không thể gửi tin nhắn!`);
    }
};