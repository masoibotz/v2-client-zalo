const { sendVote, sendSee, sendFire, sendCupid, sendSuperWolf, sendWitchSave, sendWitchKill } = require('./sendRole');
const { roleName } = require('./DataUtils');

// all_vote
function doNightRole(bot, joinID, roomID, gameData, userID, userRole, playerList, preText = '') {
    let pre_txt = preText;
    if (userRole == 1) { // là tiên tri
        bot.say(joinID, {
            text: `${pre_txt}Tiên tri muốn kiểm tra ai?\n#soi <người>\nVD: #soi 4`,
            quickReplies: Object.values(playerList),
        });
    } else if (userRole == -1 || userRole == -3) {// là SÓI / SÓI NGUYỀN
        bot.say(joinID, {
            text: `${pre_txt}Sói muốn cắn ai?\n#vote <người>\nVD: #vote 6`,
            quickReplies: Object.values(playerList),
        });
    } else if (userRole == 2) { // là bảo vệ
        bot.say(joinID, {
            text: `${pre_txt}Bảo vệ muốn bảo vệ ai?\n#baove <người>\nVD: #baove 6`,
            quickReplies: Object.values(playerList),
        });
    } else if (userRole == 3) { // là thợ săn
        bot.say(joinID, {
            text: `${pre_txt}Thợ săn\n#ghim <người> (bị động)\n#ban <người> (chủ động)\nVD: #ghim 3`,
            quickReplies: Object.values(playerList),
        });
    } else {
        bot.say(joinID, `${pre_txt}Bạn là ${roleName[userRole]}, ngủ đi bạn!`);
    }
}
// MAIN
function mainNightRole(bot, joinID, roomID, gameData, userID, userRole, playerList, preText = '') {
    let pre_txt = `ĐÊM THỨ ${gameData.state.day}\n${preText}`;
    if (gameData.roleInfo.superWolfVictimID == userID) { // kẻ bị sói nguyền
        pre_txt += `\nSói muốn cắn ai?\n#vote <người> để vote cắn!\nVD: #vote 6`;
        if (!(userRole <= 3 && userRole >= -3 && userRole != -2)) { // không có chức năng trong đêm
            pre_txt += Object.values(playerList).join("\n");
        }
    }
    doNightRole(bot, joinID, roomID, gameData, userID, userRole, playerList, pre_txt);
};
function doWitchRole(bot, joinID, roomID, gameData, playerList) {
    let victimID = gameData.roleInfo.victimID;
    let sayArr = [];
    if (victimID != "" && gameData.roleInfo.witchSaveRemain) {
        sayArr = [...sayArr, `🧙‍PHÙ THỦY\n${gameData.players.names[victimID]} đã chết\n#cuu để cứu\n#0cuu để bỏ cứu!`];
    }
    if (gameData.roleInfo.witchKillRemain) {
        sayArr = [...sayArr, {
            text: `🧙‍PHÙ THỦY\n#giet <người> để giết!\nVD: #giet 4\nĐợi hết giờ để không giết!`,
            quickReplies: Object.values(playerList)
        }]
    }
    if (sayArr.length > 0) {
        bot.say(joinID, sayArr);
    } else {
        bot.say(joinID, `🧙‍PHÙ THỦY\nBạn đã hết quyền năng!`);
    }

}

module.exports = {
    mainNightRole: mainNightRole,
    doWitchRole: doWitchRole
}