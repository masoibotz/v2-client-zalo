const { roomChatAll } = require('../Chat/Utils');
const nightDoneCheck = require('../Night/nightDoneCheck');
const dayVoteCheck = require('../Day/dayVoteCheck');
const yesNoVoteCheck = require('../Day/yesNoVoteCheck');

const kickAction = (gamef, bot, joinID, userRoom, userID) => {
    if (['4859652260223801026'].indexOf(joinID) != -1) {
        console.log(`ADMIN ${joinID} (4859: DUY, 4666: Xa)!`);
        let leaveRole;
        let player = gamef.getRoom(userRoom).players[userID];
        let playerJoinID = player.joinID;
        if (!gamef.getRoom(userRoom).ingame) {
            gamef.getRoom(userRoom).deletePlayerByID(userID);
            gamef.setUserRoom(playerJoinID, undefined);
            bot.say(playerJoinID, '```\nBạn đã bị ADMIN kick ra khỏi phòng chơi do đã AFK quá lâu!\n```');
            roomChatAll(bot, gamef.getRoom(userRoom).players, playerJoinID, `\`\`\`\n${player.first_name} đã bị kick ra khỏi phòng chơi do đã AFK quá lâu!\n\`\`\``);
        } else {
            gamef.getRoom(userRoom).killAction(player.id);
            leaveRole = player.role;
            bot.say(playerJoinID, '```\nBạn đã bị ADMIN sát hại do đã AFK quá lâu!\n```');
            roomChatAll(bot, gamef.getRoom(userRoom).players, playerJoinID, `\`\`\`\n${player.first_name} đã bị ADMIN sát hại (do AFK quá lâu) với vai trò là: ${leaveRole == -1 ? '🐺SÓI' : leaveRole == 1 ? '🔍TIÊN TRI' : leaveRole == 2 ? '🗿BẢO VỆ' : leaveRole == 3 ? '🔫THỢ SĂN' : '💩DÂN THƯỜNG'}\n\`\`\``);
            gamef.getRoom(userRoom).newLog(`\`\`\`\n${user.first_name} đã bị ADMIN sát hại (do AFK quá lâu) với vai trò là: ${leaveRole == -1 ? '🐺SÓI' : leaveRole == 1 ? '🔍TIÊN TRI' : leaveRole == 2 ? '🗿BẢO VỆ' : leaveRole == 3 ? '🔫THỢ SĂN' : '💩DÂN THƯỜNG'}\n\`\`\``);
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
        bot.say(joinID, 'Thành công!');
        console.log(`$ ROOM ${userRoom} > KICK PLAYER ${player.first_name}`);
    } else {
        bot.say(joinID, '```\nBạn không có quyền thực hiện yêu cầu này!\n```');
    }
}

const resetAllAction = (gamef, bot, joinID) => {
    if (['4859652260223801026'].indexOf(joinID) != -1) {
        gamef.resetAllRoom();
        bot.say(joinID, 'Đã tạo lại các phòng chơi và xóa các người chơi!');
        console.log('$ ROOM > RESET_ALL');
    } else {
        bot.say(joinID, '```\nBạn không có quyền thực hiện yêu cầu này!\n```');
    }
}

const adminMenu = (bot, joinID) => {
    if (['4859652260223801026'].indexOf(joinID) != -1) {
        bot.say(joinID, `ADMIN CONSOLE:\n#kick <roomID> <userID> để kick người chơi có ID là userID ở phòng roomID\n#resetAll để xóa dữ liệu game!`);
    } else {
        bot.say(joinID, '```\nBạn không có quyền thực hiện yêu cầu này!\n```');
    }
}

module.exports = {
    resetAll: resetAllAction,
    kick: kickAction,
    admin: adminMenu
}