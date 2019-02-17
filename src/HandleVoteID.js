const { extractUserRole } = require('./DataUtils');
const { sendVote, sendSee, sendFire, sendWitchKill } = require('../src/sendRole');

module.exports = async (chatInstance, gameData, userID, targetID, actionName = "") => {
    var roomID = gameData.roomChatID;
    var userRole = extractUserRole(gameData, userID);
    switch (gameData.state.dayStage) {
        case 'night':
            if (actionName == "vote" && gameData.players.wolfsID.indexOf(userID) != -1) { // là sói
                console.log("Vote", targetID);
                chatInstance.sendMessage({
                    text: JSON.stringify([{
                        targetID: targetID,
                        text: `🎯${gameData.players.names[targetID]}`
                    }]),
                    roomId: roomID,
                }).catch(err => {
                    chat.say(`Không gửi được tin nhắn!\nuser.sendMessage error`);
                    console.log(`user.sendMessage error:`, err);
                })
                return await sendVote(roomID, gameData, targetID, userID); break;
            }
            switch (userRole) {
                case "1":
                    if (gameData.roleTarget.seeID != "") {
                        gameData.roleTarget.seeID = targetID;
                        return await sendSee(roomID, gameData, targetID, userID); break;
                    } else {
                        return `Bạn chỉ được tiên tri 1 lần mỗi đêm!`;
                    }

                case "2": return await sendSave(roomID, targetID); break;
                case "3":
                    if (actionName == "ghim") { // ghim
                        return await sendFire(roomID, targetID, false);
                    } else if (actionName == "ban") { // bắn
                        return await sendFire(roomID, targetID, true);
                    }
            } break;
        case 'witch':
            if (userRole == 5 && gameData.roleInfo.witchKillRemain) {
                return await sendWitchKill(roomID, targetID);
            }
            break;
        case 'discuss':
            console.log("Vote", targetID);
            chatInstance.sendMessage({
                text: JSON.stringify([{
                    targetID: targetID,
                    text: `🎯${gameData.players.names[targetID]}`
                }]),
                roomId: roomID,
            }).catch(err => {
                chat.say(`Không gửi được tin nhắn!\nuser.sendMessage error`);
                console.log(`user.sendMessage error:`, error.info.error);
            })
            return await sendVote(roomID, gameData, targetID, userID); break;
        case 'vote':
            console.log("Vote", targetID);
            chatInstance.sendMessage({
                text: JSON.stringify([{
                    targetID: targetID,
                    text: `🎯${gameData.players.names[targetID]}`
                }]),
                roomId: roomID,
            }).catch(err => {
                chat.say(`Không gửi được tin nhắn!\nuser.sendMessage error`);
                console.log(`user.sendMessage error:`, error.info.error);
            })
            return await sendVote(roomID, gameData, targetID, userID); break;
        case 'voteYesNo':
            console.log("VoteYesNo", targetID);
            chatInstance.sendMessage({
                text: JSON.stringify([{
                    targetID: targetID,
                    text: `${targetID ? "👎Treo" : "👍Tha"}`
                }]),
                roomId: roomID,
            }).catch(err => {
                chat.say(`Không gửi được tin nhắn!\nuser.sendMessage error`);
                console.log(`user.sendMessage error:`, error.info.error);
            })
            return await sendVote(roomID, gameData, targetID, userID); break;
    }
}