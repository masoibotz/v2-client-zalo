const request = require('request');
const { roleName, extractUserRole } = require('./DataUtils');

const serverHost = 'https://masoiapp.herokuapp.com';

async function postRequest(url, body) {
    return new Promise((resolve, reject) => {
        request.post({ url: `${serverHost + url}`, form: body }, (err, res, body) => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve({ success: 'false', err: "post_request_failed" });
            }
        });
    })
}

async function sendRequest(url) {
    return new Promise((resolve, reject) => {
        request.get(`${serverHost + url}`, (err, res, body) => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve({ success: 'false', err: "get_request_failed" });
            }
        });
    })
}
async function sendVoteRequest(roomID, action, successTxt, failedTxt) {
    return sendRequest(`/play/${roomID}/do?action=${action}`).then((data) => {
        if (data.success === true) {
            return successTxt;
        } else {
            return failedTxt;
        }
    })
}
async function sendVote(roomID, gameData, targetID, userID) {
    console.log(`send Vote ${userID} => ${targetID}`);
    return await sendVoteRequest(roomID, `{"roleTarget.voteList.${userID}":"${targetID}"}`, `Đã vote!`, `sendVote_error`);
}
async function sendFire(roomID, targetID, fireToKill) {
    console.log(`send Fire ${fireToKill ? 'GIẾT' : 'GHIM'} ${targetID}`);
    return await sendVoteRequest(roomID, `{ "roleTarget.fireID": "${targetID}", "roleTarget.fireToKill": ${fireToKill}} `, `Xong!`, `sendFire_error`);
}
async function sendCupid(roomID, target1ID, target2ID) {
    console.log(`SEND CUPID ${target1ID} vs ${target2ID} `);
    return await sendVoteRequest(roomID, `{"roleTarget.coupleList":["${target1ID}","${target2ID}"]}`, `Đã ghép đôi!`, `sendCupid_error`);
}
async function sendSuperWolf(roomID, targetID) {
    console.log(`SEND SUPERWOLF ${targetID}`);
    return await sendVoteRequest(roomID, `{"roleTarget.superWolfVictimID":"${targetID}"}`, `Đã nguyền!`, `sendSuperWolf_error`);
}
async function sendWitchSave(roomID, value = true) {
    console.log(`send WitchSave`);
    return await sendVoteRequest(roomID, `{"roleTarget.witchUseSave":${value}}`, `Đã cứu!`, `sendWitchSave_error`);
}
async function sendWitchKill(roomID, targetID) {
    console.log(`send WitchKill ${targetID}`);
    return await sendVoteRequest(roomID, `{"roleTarget.witchKillID":"${targetID}"}`, `Đã giết!`, `sendWitchKill_error`);
}
async function sendSave(roomID, targetID) {
    console.log(`SEND Save ${targetID} `);
    return await sendVoteRequest(roomID, `{"roleTarget.saveID":"${targetID}"}`, `Đã bảo vệ!`, `sendSave_error`);
}
function sendSee(roomID, gameData, targetID, userID) {
    console.log(`SEE ${targetID}`);
    sendVoteRequest(roomID, `{"roleTarget.seeID":"${targetID}"}`, `DONE`, `sendSee_error`);
    let userRole = extractUserRole(gameData, targetID);
    if (userRole == -1 || userRole == -3 || userRole == 8 || targetID == gameData.roleInfo.superWolfVictimID) { // là sói hoặc người hóa sói
        return `🐺${gameData.players.names[targetID]} là PHE SÓI!`;
    } else {
        return `🎅${gameData.players.names[targetID]} là PHE DÂN!`;
    }
}
module.exports = {
    postRequest: postRequest,
    sendRequest: sendRequest,
    sendVote: sendVote,
    sendSee: sendSee,
    sendSave: sendSave,
    sendFire: sendFire,
    sendCupid: sendCupid,
    sendSuperWolf: sendSuperWolf,
    sendWitchSave: sendWitchSave,
    sendWitchKill: sendWitchKill
}