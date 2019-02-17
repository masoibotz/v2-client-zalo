function extractUserRole(gameData, userID) {
    let setup = gameData.setup;
    let ret = 0;
    Object.keys(setup).every((roleCode) => {
        if (setup[roleCode].indexOf(userID) != -1) {
            ret = roleCode;
            return false;
        }
        return true;
    })
    return ret;
}
function isAlive(gameData, userID) {
    if (!gameData || !gameData.roleInfo || !gameData.roleInfo.deathList) return true;
    return gameData.roleInfo.deathList.indexOf(userID) == -1;
}
function isWolf(gameData, userID) {
    if (!gameData || !gameData.players || !gameData.players.wolfsID) return false;
    return gameData.players.wolfsID.indexOf(userID) != -1;
}
const roleName = {
    // PHE SÓI
    "-1": '🐺SÓI',
    "-2": '🐺BÁN SÓI',
    "-3": '🐺SÓI NGUYỀN',

    // PHE DÂN
    "1": '👁TIÊN TRI',
    "2": '🛡BẢO VỆ',
    "3": '🏹THỢ SĂN',
    "4": '🎅DÂN',
    "5": '🧙‍PHÙ THỦY',
    "6": '👴GIÀ LÀNG',
    "7": '👼THẦN TÌNH YÊU',
    "8": '👽NGƯỜI HÓA SÓI',
    "9": '🧚‍THIÊN SỨ',
}
const roleImage = {
    // PHE SÓI
    "-1": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1889278418034541',
    "-2": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1889278411367875',
    "-3": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1897745170521199',

    // PHE DÂN
    "1": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1889278528034530',
    "2": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1889278331367883',
    "3": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1889278518034531',
    "4": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1889278298034553',
    "5": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1889278464701203',
    "6": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1889278381367878',
    "7": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1889278324701217',
    "8": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1891874781108238',
    "9": 'https://www.facebook.com/masoibot/photos/pcb.1889279921367724/1903763679919348',
}
const phe = {
    "9": "Thiên sứ",
    "3": "Cặp đôi",
    "-1": "Sói",
    "1": "DÂN",
}

const nextStageArr = {
    "readyToGame": "cupid",
    "cupid": "night",
    "night": "superwolf",
    "superwolf": "witch",
    "witch": "discuss",
    "discuss": "vote",
    "vote": "voteResult",
    "voteResult": "lastWord",
    "lastWord": "voteYesNo",
    "voteYesNo": "voteYesNoResult",
    "voteYesNoResult": "cupid"
}

module.exports = {
    extractUserRole: extractUserRole,
    roleName: roleName,
    roleImage: roleImage,
    nextStageArr: nextStageArr,
    isAlive: isAlive,
    isWolf: isWolf,
    phe: phe
}