const { mainNightRole, doWitchRole } = require('./mainNightRole');
const { roleName, roleImage, extractUserRole, isAlive } = require('./DataUtils');

module.exports = function goStage(bot, joinID, gameData, userID, playerList) {
    var userRole = extractUserRole(gameData, userID);
    var names = gameData.players.names;
    var roomID = gameData.roomChatID;
    let coupleID = gameData.players.coupleID;
    let coupleIndex = coupleID.indexOf(userID);
    switch (gameData.state.dayStage) {
        case 'readyToGame':
            // bot.say(joinID, {
            //     text: roleName[userRole],
            //     image: roleImage[userRole]
            // })
            break;
        case 'cupid':
            if (userRole == 7) {
                bot.say(joinID, {
                    text: `👼GHÉP ĐÔI\n#cupid <người 1> <người 2>\nVD: #cupid 9 7`,
                    quickReplies: Object.values(playerList)
                })
            } else {
                bot.say(joinID, `👼THẦN TÌNH YÊU đang phân vân...`);
            }
            break;
        case 'night':
            let nightNotify = ``;
            if (coupleIndex != -1) {
                nightNotify += `💕Bạn cặp đôi với ${names[coupleID[coupleIndex == 1 ? 0 : 1]]}\n`;
            }
            if (isAlive(gameData, userID)) { // còn sống
                mainNightRole(bot, joinID, roomID, gameData, userID, userRole, playerList, nightNotify);
            } else {
                bot.say(joinID, `💀ĐÊM RỒI!\nĐêm nay bạn đã chết!`);
            }
            break;
        case 'superwolf':
            if (userRole == -3) {
                if (gameData.roleInfo.superWolfVictimID == "") {
                    if (gameData.roleInfo.victimID != "") {
                        bot.say(joinID, `🐺SÓI NGUYỀN\n${gameData.players.names[gameData.roleInfo.victimID]} đã chết\n#nguyen để nguyền!\n#0nguyen để bỏ nguyền!`);
                    } else {
                        bot.say(joinID, `🐺SÓI NGUYỀN\nKhông có ai chết cả! Buồn ghê :v`);
                    }
                } else {
                    bot.say(joinID, `🐺SÓI NGUYỀN\nBạn đã nguyền 1 lần rồi!`);
                }
            } else {
                bot.say(joinID, `🐺SÓI NGUYỀN đang suy tính...`);
            }
            break;
        case 'witch':
            if (userRole == 5) {
                doWitchRole(bot, joinID, roomID, gameData, playerList);
            } else {
                bot.say(joinID, `🧙‍PHÙ THỦY đang phù phép...`);
            }
            break;
        case 'discuss':
            let notifyDeath = ``;
            // let notifyDeath = `☀TRỜI SÁNG RỒI!\n`;
            let superWolfVictimID = gameData.roleInfo.superWolfVictimID;
            if (superWolfVictimID === userID) {
                notifyDeath += `🐺Nhớ rằng bạn là sói!\n`
            }
            if (coupleIndex != -1) {
                notifyDeath += `💕Bạn cặp đôi với ${names[coupleID[coupleIndex == 1 ? 0 : 1]]}\n`;
            }
            // notifyDeath += gameData.roleInfo.lastDeath.length === 0 ? `Đêm qua không ai chết cả` : gameData.roleInfo.lastDeath.map((deathID) => {
            //     return `⚔${names[deathID]} đã chết`;
            // }).join('\n');
            bot.say(joinID, `${notifyDeath}`);
            break;
        case 'vote':
            bot.say(joinID, {
                text: `VOTE\n#vote <người>\nVD: #vote 0`,
                quickReplies: Object.values(playerList),
            });
            break;
        // case 'voteResult':
        //     let voteResult = `KẾT QUẢ VOTE\n`;
        //     let voteArr = {};
        //     Object.keys(gameData.roleTarget.voteList).forEach((userID, index) => {
        //         targetID = gameData.roleTarget.voteList[userID];
        //         voteArr[targetID] ? voteArr[targetID]++ : voteArr[targetID] = 1;
        //     });
        //     voteResult += Object.keys(voteArr).map((targetID, index) => {
        //         return `${index + 1}: ${names[targetID]} (${voteArr[targetID]} phiếu)`;
        //     }).join('\n')
        //     voteResult += `\n`;
        //     if (gameData.roleInfo.victimID !== "") {
        //         voteResult += `${names[gameData.roleInfo.victimID]} có số vote nhiều nhất!`;
        //     } else {
        //         voteResult += `Không ai bị treo cổ!`;
        //     }
        //     bot.say(joinID, voteResult);
        //     break;
        // case 'lastWord':
        //     if (gameData.roleInfo.victimID !== "") {
        //         bot.say(joinID, `${names[gameData.roleInfo.victimID]} LÊN THỚT!\nBạn có 1 phút thanh minh`);
        //     } else {
        //         bot.say(joinID, `Người chơi lên thớt không hợp lệ!\nnull_victim_invalid_error`);
        //     }
        //     break;
        case 'voteYesNo':
            bot.say(joinID, {
                text: `TREO HAY THA?`,
                quickReplies: ["#treo", "#tha"],
            });
            break;
        // case 'voteYesNoResult':
        //     let listTreo = [];
        //     let listTha = [];
        //     let victimID = gameData.roleInfo.victimID;
        //     Object.keys(gameData.roleTarget.voteList).filter((userID, index) => {
        //         if (gameData.roleTarget.voteList[userID] === victimID) {
        //             listTreo = [...listTreo, names[userID]];
        //         } else {
        //             listTha = [...listTha, names[userID]];
        //         }
        //     });
        //     bot.say(joinID, `KẾT QUẢ THEO/THA:\n`
        //         + `${listTreo.length} Treo: ${listTreo.join(", ")}\n`
        //         + `${listTha.length} Tha: ${listTha.join(", ")}\n\n`
        //         + `${names[victimID]} ${listTreo.length > listTha.length ? `đã bị treo cổ theo số đông!` : `vẫn được mọi người tin tưởng!`}`
        //     );
    }
}