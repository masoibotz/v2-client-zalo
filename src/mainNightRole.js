const { sendVote, sendSee, sendFire, sendCupid, sendSuperWolf, sendWitchSave, sendWitchKill } = require('./sendRole');
const { roleName } = require('./DataUtils');
var schedule = require('node-schedule')

// part of 2-step vote
function startConvo(convo, askSeq, index) {
    var askItem = askSeq[index];
    convo.ask(askItem.qreply ? {
        text: askItem.txt,
        quickReplies: askItem.qreply,
    } : askItem.txt, (payload, convo) => {
        let resTxt = payload.message ? payload.message.text : undefined;
        if (resTxt) {
            let result = askItem.callback(convo, index, resTxt);
            if (result) {
                convo.set(`data[${index}]`, result);
                if (index + 1 < askSeq.length) {
                    startConvo(convo, askSeq, index + 1);
                } else {
                    convo.end();
                }
            } else {
                convo.say(`Thao tác sai! Vui lòng thử lại!`);
                startConvo(convo, askSeq, index);
            }
        } else {
            convo.say(`Vui lòng thử lại!`);
            startConvo(convo, askSeq, index);
        }
    })
}
// start 2-step vote
function voteConvo(chat, askSeq, timeout) {
    let convoTimeout = new Date(timeout) + 6000;
    chat.conversation((convo) => {
        schedule.scheduleJob(convoTimeout, () => {
            convo.say(`Hết giờ!`);
            convo.end();
        })
        let len = askSeq.length;
        if (len <= 0) return;
        startConvo(convo, askSeq, 0);
    });
}
// all_vote
function doNightRole(roomID, gameData, chat, userID, userRole, playerList, preText = '') {
    let pre_txt = `ĐÊM THỨ ${gameData.state.day}\n${preText}`;
    if (userRole == 1) { // là tiên tri
        voteConvo(chat, [{
            txt: `${pre_txt}Tiên tri muốn soi ai?`,
            qreply: Object.values(playerList),
            callback: (convo, index, resTxt) => {
                let targetID = resTxt.match(/[0-9]+/g)[0];
                let result = sendSee(roomID, gameData, Object.keys(playerList)[targetID], userID);
                convo.say(`=>${result}`);
                return 1;
            }
        }], gameData.state.stageEnd);
    } else if (userRole == -1 || userRole == -3) {// là SÓI / SÓI NGUYỀN
        chat.say({
            text: `${pre_txt}Sói muốn cắn ai?`,
            quickReplies: Object.values(playerList),
        });
    } else if (userRole == 2) { // là bảo vệ
        chat.say({
            text: `${pre_txt}Bảo vệ muốn bảo vệ ai?`,
            quickReplies: Object.values(playerList),
        });
    } else if (userRole == 3) { // là thợ săn
        voteConvo(chat, [{
            txt: `${pre_txt}Thợ săn muốn ghim hãy bắn chết luôn?`,
            qreply: ["ghim", "giết"],
            callback: (convo, index, resTxt) => {
                if (/^ghim$/.test(resTxt)) {
                    return 1;
                } else if (/^giết$/.test(resTxt)) {
                    return 2;
                } else {
                    return null;
                }
            }
        }, {
            txt: "Thợ săn muốn ghim ai?",
            qreply: Object.values(playerList),
            callback: (convo, index, resTxt) => {
                let type = convo.get(`data[${index - 1}]`);
                let voteID;
                if (/[0-9]+:.+|-1/g.test(resTxt)) {
                    voteID = resTxt.match(/-?[0-9]+/g)[0];
                } else {
                    return null;
                }
                if (type == 1) { // ghim
                    sendFire(roomID, Object.keys(playerList)[voteID], false);
                    convo.say("Xong!");
                    return true;
                } else if (type == 2) { // bắn
                    sendFire(roomID, Object.keys(playerList)[voteID], true);
                    convo.say("Xong!");
                    return true;
                } else {
                    return null;
                }
            }
        }], gameData.state.stageEnd)
    } else {
        chat.say(`${pre_txt}Bạn là ${roleName[userRole]}, ngủ đi bạn!`);
    }
}
// MAIN
function mainNightRole(chat, roomID, gameData, userID, userRole, playerList, preText = '') {
    let pre_txt = `ĐÊM THỨ ${gameData.state.day}\n${preText}`;
    if (gameData.roleInfo.superWolfVictimID == userID) { // kẻ bị sói nguyền
        voteConvo(chat, [{
            txt: `${pre_txt}Sói muốn cắn ai?`,
            qreply: Object.values(playerList),
            callback: (convo, index, resTxt) => {
                let targetID = resTxt.match(/[0-9]+/g)[0];
                var doAsync = async () => {
                    let result = await sendVote(roomID, gameData, Object.keys(playerList)[targetID], userID);
                    convo.say(`=>${result}`);
                };
                doAsync();
                doNightRole(roomID, gameData, chat, userID, userRole, playerList, preText);
                return 1;
            }
        }], gameData.state.stageEnd);
    } else {
        doNightRole(roomID, gameData, chat, userID, userRole, playerList, preText);
    }
};
// cupid stage
function doCupidRole(chat, roomID, gameData, playerList) {
    let pre_txt = `ĐÊM THỨ ${gameData.state.day}: `;
    voteConvo(chat, [{
        txt: `${pre_txt}GHÉP ĐÔI\nChọn người thứ nhất:`,
        qreply: Object.values(playerList),
        callback: (convo, index, resTxt) => {
            if (/[0-9]+:.+/g.test(resTxt)) {
                return resTxt.match(/[0-9]+/g)[0];
            } else {
                return null;
            }
        }
    }, {
        txt: "GHÉP ĐÔI: Chọn người thứ hai:",
        qreply: Object.values(playerList),
        callback: (convo, index, resTxt) => {
            let user1ID = convo.get(`data[${index - 1}]`);
            if (!user1ID) return null;
            if (/[0-9]+:.+/g.test(resTxt)) {
                let user2ID = resTxt.match(/[0-9]+/g)[0];
                var doAsync = async () => {
                    let result = await sendCupid(roomID, Object.keys(playerList)[user1ID], Object.keys(playerList)[user2ID]);
                    convo.say(`=>${result}`);
                };
                doAsync();
                return true;
            } else {
                return null;
            }

        }
    }], gameData.state.stageEnd)
}
function doSuperWolfRole(chat, roomID, gameData) {
    let victimID = gameData.roleInfo.victimID;
    if (victimID != "") {
        voteConvo(chat, [{
            txt: `SÓI NGUYỀN\n${gameData.players.names[victimID]} đã chết`,
            qreply: ["nguyen", "khong"],
            callback: (convo, index, resTxt) => {
                if (/^nguyen$/.test(resTxt)) {
                    var doAsync = async () => {
                        let result = await sendSuperWolf(roomID, victimID);
                        convo.say(`=>${result}`);
                    };
                    doAsync();
                    return 1;
                } else if (/^khong$/.test(resTxt)) {
                    return 1;
                } else {
                    return null;
                }
            }
        }], gameData.state.stageEnd);
    } else {
        if (gameData.roleInfo.superWolfVictimID != "") {
            chat.say(`SÓI NGUYỀN\nBạn đã nguyền rồi!`);
        } else {
            chat.say(`SÓI NGUYỀN\nKhông có ma nào chết cả :v`);
        }
    }
}
function doWitchRole(chat, roomID, gameData, playerList) {
    let victimID = gameData.roleInfo.victimID;
    let convoArr = [];
    if (victimID != "" && gameData.roleInfo.witchSaveRemain) {
        convoArr = [...convoArr, {
            txt: `PHÙ THỦY\n${gameData.players.names[victimID]} đã chết`,
            qreply: ["cuu", "khong"],
            callback: (convo, index, resTxt) => {
                if (/^cuu$/.test(resTxt)) {
                    var doAsync = async () => {
                        let result = await sendWitchSave(roomID);
                        if (!gameData.roleInfo.witchKillRemain) {
                            convo.say(`=>${result}`);
                        }
                    };
                    doAsync();
                    return 1;
                } else if (/^khong$/.test(resTxt)) {
                    if (!gameData.roleInfo.witchKillRemain) {
                        convo.say(`=>Bạn đã chọn không cứu!`);
                    }
                    return 1;
                } else {
                    return null;
                }
            }
        }];
    }
    if (gameData.roleInfo.witchKillRemain) {
        convoArr = [...convoArr, {
            txt: "PHÙ THỦY\nBạn muốn giết ai không?\nĐể không giết ai, ko bấm gì hết và đợi hết giờ!",
            qreply: ["-1: Không", ...Object.values(playerList)],
            callback: (convo, index, resTxt) => {
                let voteID;
                if (/-?[0-9]+:.+/g.test(resTxt)) {
                    voteID = resTxt.match(/-?[0-9]+/g)[0];
                    if (voteID != -1) {
                        var doAsync = async () => {
                            let result = await sendWitchKill(roomID, Object.keys(playerList)[voteID]);
                            convo.say(`=>${result}`);
                        };
                        doAsync();
                    }
                    return 1;
                } else {
                    convo.say(`=>Bạn chưa quyết định giết ai!`);
                    return null;
                }
            }
        }];
    }
    voteConvo(chat, convoArr, gameData.state.stageEnd);
}

module.exports = {
    mainNightRole: mainNightRole,
    doCupidRole: doCupidRole,
    doSuperWolfRole: doSuperWolfRole,
    doWitchRole: doWitchRole
}