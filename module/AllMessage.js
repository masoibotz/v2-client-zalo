const handleVoteID = require('../src/HandleVoteID');
const { extractUserRole } = require('../src/DataUtils');

module.exports = (userInstance, bot) => {
    bot.on('message', async (payload, chat, data) => {
        if (data.captured) { return; }
        const joinID = payload.sender.id;
        const text = payload.message.text;

        var chatInstance = userInstance.getInstance(joinID);
        var data = userInstance.getData(joinID);
        var userID = userInstance.getUserID(joinID);
        var roomID = userInstance.getRoomID(joinID);
        // check
        if (!chatInstance || !userID) {
            chat.say({
                text: `Vui lòng đăng nhập!`,
                buttons: [
                    { type: 'postback', title: 'Đăng nhập', payload: 'CONNECT' },
                    { type: 'postback', title: 'Đăng kí', payload: 'REGISTER' }
                ]
            });
            return;
        }

        if (!roomID) {
            chat.say({
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
            chat.say(await handleVoteID(chatInstance, data, userID, treoOrTha ? targetID : ""));
        } else if (data && data.state.status == 'ingame' && /[0-9]+:.+|-1/g.test(text)) {
            // target_id
            let targetIndex = text.match(/[0-9]+/g)[0];
            let playerList = userInstance.getPlayerList(joinID);
            let targetID = Object.keys(playerList)[targetIndex];
            chat.say(await handleVoteID(chatInstance, data, userID, targetID));
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
                    chat.say(`Không gửi được tin nhắn!\nuser.sendMessage error`);
                    console.log(`user.sendMessage error:`, error.info.error);
                })
            } else {
                chat.say(`Bạn không thể gửi tin nhắn!`);
            }
        }

    });
    bot.on('attachment', (payload, chat) => {
        const joinID = payload.sender.id;
        let attachment = payload.message.attachments[0];

        var data = userInstance.getData(joinID);
        var userID = userInstance.getUserID(joinID);
        var roomID = userInstance.getRoomID(joinID);
        // check
        if (!userInstance.getInstance(joinID) || !userID) {
            chat.say({
                text: `Vui lòng đăng nhập!`,
                buttons: [
                    { type: 'postback', title: 'Đăng nhập', payload: 'CONNECT' },
                    { type: 'postback', title: 'Đăng kí', payload: 'REGISTER' }
                ]
            });
            return;
        }
        if (!roomID) {
            chat.say({
                text: `Vui lòng tham gia 1 phòng!`,
                buttons: [
                    { type: 'postback', title: 'Tham gia phòng chơi', payload: 'JOIN_ROOM' },
                    { type: 'postback', title: 'Đăng xuất', payload: 'DISCONNECT' }
                ]
            });
            return;
        }
        //main
        var userRole;
        if (!data || (data && data.state.status === 'waiting') || // phòng chờ / vừa join phòng
            (data && (userRole = extractUserRole(data, userID)) && (
                (data.state.dayStage === 'night' && (userRole == -1 || userRole == -3 || userID == data.roleInfo.superWolfVictimID)) || // đêm là sói
                data.state.dayStage === 'discuss' || // thảo luận
                (data.state.dayStage === 'lastWord' && userID == data.roleInfo.victimID)// trăn trối / giẫy
            ))
        ) {
            // message_content
            userInstance.getInstance(joinID).sendMessage({
                text: `${userID} gửi đính kèm...`,
                roomId: roomID,
                attachment: {
                    link: attachment.payload.url,
                    type: attachment.type
                }
            }).catch(err => {
                chat.say(`Không gửi được tin nhắn!\nuser.sendMessage_error`);
                console.log(`user.sendMessage_error:`, error.info.error);
            })
        } else {
            chat.say(`Bạn không thể gửi tin nhắn!`);
        }
    });
};