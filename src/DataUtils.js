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
    "-1": 'https://sites.google.com/site/masoibot/vai-tro/masoi.jpg',
    "-2": 'https://sites.google.com/site/masoibot/vai-tro/phanboi.jpg',
    "-3": 'https://sites.google.com/site/masoibot/vai-tro/soinguyen.jpg',

    // PHE DÂN
    "1": 'https://sites.google.com/site/masoibot/vai-tro/tien-tri.jpg',
    "2": 'https://sites.google.com/site/masoibot/vai-tro/baove.jpg',
    "3": 'https://sites.google.com/site/masoibot/vai-tro/thosan.jpg',
    "4": 'https://sites.google.com/site/masoibot/vai-tro/danlang.jpg',
    "5": 'https://sites.google.com/site/masoibot/vai-tro/phuthuy.jpg',
    "6": 'https://sites.google.com/site/masoibot/vai-tro/gialang.jpg',
    "7": 'https://sites.google.com/site/masoibot/vai-tro/cupid.jpg',
    "8": 'https://sites.google.com/site/masoibot/vai-tro/nguoi%20hoa%20soi.jpg',
    "9": 'https://sites.google.com/site/masoibot/vai-tro/thienSu.jpg',
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