const { roomChatAll } = require('../Chat/Utils');
const { Player } = require('../MainGame/Game');

module.exports = (gamef, bot) => {
    const joinCallback = (payload, chat) => {
        let joinID = payload.sender.id;
        let userRoom = gamef.getUserRoom(joinID);
        if (userRoom != undefined) {
            chat.say(`\`\`\`\nBạn đã tham gia phòng ${(userRoom + 1)} rồi!\nĐể rời phòng chơi, chọn menu Tham gia > Rời phòng chơi!\n\`\`\``);
            return;
        }
        let joinUser;
        let page = 0;
        let roomListView = gamef.getRoomListView(page);
        let enableGreetingTxt = true;

        const askRoom = (convo) => {
            convo.ask({
                text: enableGreetingTxt?'Cảm ơn bạn đã tham gia chơi thử nghiệm Quản trò Ma sói Bot!\nBot vẫn hiện đang phát triển\nMọi lỗi phát sinh vui lòng comment trên fanpage để được fix sớm nhất có thể!\n\nVui lòng lựa chọn phòng:':'Chọn phòng:',
                quickReplies: roomListView,
            }, (payload, convo) => {  
                if (payload.message && payload.message.text.match(/\<|\>/g)) {
                    enableGreetingTxt = false;
                    if (payload.message.text.match(/\>/g)) { //next page
                        page += 3;
                    } else { // prev page
                        page -= 3;
                    }
                    roomListView = gamef.getRoomListView(page);
                    askRoom(convo);
                    return;
                }
                let roomIDTxt = payload.message ? payload.message.text.match(/[0-9]+/g) : [];
                if (!(payload.message) || !roomIDTxt || isNaN(parseInt(roomIDTxt[0])) || !gamef.room[parseInt(roomIDTxt[0]) - 1]) {
                    convo.say(`\`\`\`\nPhòng bạn vừa nhập không hợp lệ!\n\`\`\``);
                    convo.end();
                    return;
                }
                let roomID = parseInt(roomIDTxt[0]) - 1;

                if (gamef.getRoom(roomID).ingame) {
                    convo.say(`\`\`\`\nPhòng đã vào chơi rồi! Bạn sẽ được thông báo khi trò chơi kết thúc!\n\`\`\``);
                    gamef.getRoom(roomID).subscribe(joinID);
                    convo.end();
                    return;
                } else {
                    // save room number for user
                    gamef.setUserRoom(joinID, roomID);
                    // add new player to room
                    gamef.getRoom(roomID).addPlayer(new Player({
                        id: gamef.getRoom(roomID).newPlayerID(),
                        joinID: joinID,
                        last_name: joinUser.last_name,
                        first_name: joinUser.first_name,
                        avatar: joinUser.profile_pic
                    }));

                    // notice new player to everyone in room
                    let playerListView = gamef.getRoomPlayerView(roomID);
                    roomChatAll(bot, gamef.getRoom(roomID).players, 0, [{
                        cards: playerListView
                    }, `${joinUser.first_name} đã tham gia phòng!`]);

                    convo.end();
                    console.log(`$ ROOM ${(roomID + 1)} > JOIN > ${joinUser.first_name} > ${joinID}`);
                }
            });
        };

        chat.getUserProfile().then((user) => {
            console.log(`$ JOIN > ${joinID} : ${user.last_name + ' ' + user.first_name}`);
            joinUser = user;
            chat.conversation((convo) => {
                askRoom(convo);
            });
        })
    };
    // listen JOIN ROOM
    bot.on('postback:JOIN_ROOM', joinCallback);
    bot.hear(/\/join/i, joinCallback);
};