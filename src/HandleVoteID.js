const { extractUserRole } = require('./DataUtils');
const { sendVote, sendSee, sendSave } = require('./sendRole')

module.exports = async (chatInstance, gameData, userID, targetID) => {
    var roomID = gameData.roomChatID;
    var userRole = extractUserRole(gameData, userID);
    switch (gameData.state.dayStage) {
        case 'night': switch (userRole) {
            case "-1": case "-3":
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
            // case "1": return await sendSee(roomID, gameData, targetID, userID); break;
            case "2": return await sendSave(roomID, targetID); break;
        } break;
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