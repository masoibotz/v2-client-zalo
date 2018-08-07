const { roomChatAll } = require('../Chat/Utils');
const roomRoleChat = require('../Night/roomRoleChat');
const gameIsNotEndCheck = require('../MainGame/gameIsNotEndCheck');
const yesNoVoteCheck = require('../Day/yesNoVoteCheck');

// module này thực hiện khi vote xong!
module.exports = (gamef, bot, userRoom) => {
  gamef.getRoom(userRoom).roleIsDone(async (isDone) => {
    gamef.getRoom(userRoom).findOutDeathID();
    gamef.getRoom(userRoom).cancelSchedule();
    let deathID = gamef.getRoom(userRoom).deathID;
    if (deathID != -1 && gamef.getRoom(userRoom).alivePlayer[gamef.getRoom(userRoom).players[deathID].joinID]) { // mời 1 người lên giá treo cổ
      gamef.getRoom(userRoom).afternoonSwitch();
      let deathTxt = gamef.getRoom(userRoom).playersTxt[deathID];
      roomChatAll(bot, gamef.getRoom(userRoom).players, 0, `\`\`\`\n🎓Xin mời ${deathTxt} bước lên giá treo cổ!\n⏰Bạn có 1 phút để trăn trối\n\`\`\``);
      // 1 phút trăn trối
      let time = new Date(Date.now() + 1 * 60 * 1000);
      gamef.getRoom(userRoom).addSchedule(time, () => {
        // hết giờ, vote treo cổ nào!
        roomChatAll(bot, gamef.getRoom(userRoom).players, 0, `⏰Hết giờ! Mọi người có 1 PHÚT để vote!\n👎TREO CỔ hay 👍THA?\n/treo hoặc /tha`);
        console.log(`$ ROOM ${userRoom + 1} > END OF TRĂN TRỐI :))`);
        // timer để vote treo cổ
        gamef.getRoom(userRoom).players.forEach((p, index, players) => {
          if (p && gamef.getRoom(userRoom).alivePlayer[p.joinID] && !gamef.getRoom(userRoom).roleDone[p.joinID]) {
            let time = new Date(Date.now() + 60 * 1000);
            players[index].addSchedule(time, () => {
              roomChatAll(bot, gamef.getRoom(userRoom).players, 0, `👍👎${p.first_name} đã không kịp vote (-20 uy tín)`);
              gamef.getRoom(userRoom).roleDoneBy(p.joinID, true);
              gamef.func(yesNoVoteCheck, bot, userRoom);
            });
          }
        });
      });
    } else {
      await roomChatAll(bot, gamef.getRoom(userRoom).players, 0, `😇Không ai bị treo cổ do có số vote bằng nhau hoặc người bị vote treo đã tự sát! Mọi người đi ngủ`);
      gamef.getRoom(userRoom).newLog(`😇Không ai bị treo cổ do có số vote bằng nhau hoặc người bị vote treo đã tự sát!`);
      gameIsNotEndCheck(gamef, bot, userRoom, () => {
        // Đêm tiếp theo
        gamef.getRoom(userRoom).dayNightSwitch();
        roomChatAll(bot, gamef.getRoom(userRoom).players, 0, `🌛Đêm thứ ${gamef.getRoom(userRoom).day}🌛`);
        gamef.getRoom(userRoom).newLog(`\n🌛Đêm thứ ${gamef.getRoom(userRoom).day}🌛\n`);
        gamef.func(roomRoleChat, bot, userRoom);
      });
    }
  });
}