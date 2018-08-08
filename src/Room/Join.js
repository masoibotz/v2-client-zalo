const { roomChatAll } = require('../Chat/Utils');
const { Player } = require('../MainGame/Game');

module.exports = (gamef, bot, joinID, roomNumberTxt) => {
    let userRoom = gamef.getUserRoom(joinID);
    if (userRoom != undefined) {
        bot.say(joinID, `Bạn đã tham gia phòng ${(userRoom + 1)} rồi!\nĐể rời phòng chơi, chọn menu Chơi > Rời/tự sát!`);
        return;
    }
    if (!roomNumberTxt || !gamef.room[parseInt(roomNumberTxt) - 1]) {
        bot.say(joinID, `Phòng bạn vừa nhập không hợp lệ!`);
        return;
    }
    let roomID = parseInt(roomNumberTxt) - 1;

    if (gamef.getRoom(roomID).ingame) {
        bot.say(joinID, `Phòng đã vào chơi rồi! Bạn sẽ được thông báo khi trò chơi kết thúc!`);
        gamef.getRoom(roomID).subscribe(joinID);
    } else {
        // save room number for user
        gamef.setUserRoom(joinID, roomID);
        // add new player to room
        bot.getProfile(joinID).then((joinUser) => {
            gamef.getRoom(roomID).addPlayer(new Player({
                id: gamef.getRoom(roomID).newPlayerID(),
                joinID: joinID,
                last_name: '',
                first_name: joinUser.displayName,
                avatar: joinUser.avatar
            }));
            // notice new player to everyone in room
            let playerListView = gamef.getSimpleRoomPlayerView(roomID).join(`\n`);
            roomChatAll(bot, gamef.getRoom(roomID).players, 0, playerListView);
            console.log(`$ ROOM ${(roomID + 1)} > JOIN > ${joinUser.displayName} > ${joinID}`);
        });
    }
};