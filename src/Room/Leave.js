const { roomChatAll } = require('../Chat/Utils');
const nightDoneCheck = require('../Night/nightDoneCheck');
const dayVoteCheck = require('../Day/dayVoteCheck');
const yesNoVoteCheck = require('../Day/yesNoVoteCheck');

module.exports = (gamef, bot, joinID) => {
    const userRoom = gamef.getUserRoom(joinID);
    if (userRoom != undefined) {
        let user = gamef.getRoom(userRoom).getPlayer(joinID);
        let leaveRole;
        if (!gamef.getRoom(userRoom).ingame) {
            gamef.getRoom(userRoom).deletePlayer(joinID);
            gamef.setUserRoom(joinID, undefined);

            bot.say(joinID, `Bạn đã rời phòng chơi ${userRoom + 1}!`);
            // notice new player to everyone in room
            let playerListView = gamef.getSimpleRoomPlayerView(userRoom).join(`\n`);
            roomChatAll(bot, gamef.getRoom(userRoom).players, 0, playerListView);
        } else {
            gamef.getRoom(userRoom).killAction(user.id);
            leaveRole = user.role;
            bot.say(joinID, `Bạn đã tự sát!`);
            roomChatAll(bot, gamef.getRoom(userRoom).players, joinID, `${user.first_name} đã tự sát với vai trò là: ${gamef.roleTxt[leaveRole]}`);
            gamef.getRoom(userRoom).newLog(`${user.first_name} đã tự sát với vai trò là: ${gamef.roleTxt[leaveRole]}`);
            if (gamef.getRoom(userRoom).isNight) {
                gamef.getRoom(userRoom).roleIsDone((isDone) => {
                    if (isDone) {
                        gamef.func(nightDoneCheck, bot, userRoom);
                    }
                });
            } else if (gamef.getRoom(userRoom).isMorning) {
                gamef.getRoom(userRoom).roleIsDone((isDone) => {
                    if (isDone) {
                        gamef.func(dayVoteCheck, bot, userRoom);
                    }
                });
            } else {
                gamef.getRoom(userRoom).roleIsDone((isDone) => {
                    if (isDone) {
                        gamef.func(yesNoVoteCheck, bot, userRoom);
                    }
                });
            }
        }
        console.log(`$ ROOM ${userRoom + 1} > LEAVE > ${joinID} : ${user.first_name}`);
    } else {
        bot.say(joinID, 'Bạn chưa tham gia phòng nào!');
    }
};