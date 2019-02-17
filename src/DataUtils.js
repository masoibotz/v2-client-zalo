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
    "-1": 'http://hstatic.net/936/1000019936/10/2015/7-28/masoi.jpg',
    "-2": 'http://hstatic.net/936/1000019936/10/2015/7-28/phanboi.jpg',
    "-3": 'http://hstatic.net/936/1000019936/10/2015/7-28/baove.jpg',

    // PHE DÂN
    "1": 'http://hstatic.net/936/1000019936/10/2015/11-18/tien-tri.jpg',
    "2": 'http://hstatic.net/936/1000019936/10/2015/7-28/baove.jpg',
    "3": 'http://hstatic.net/936/1000019936/10/2015/7-28/thosan.jpg',
    "4": 'http://hstatic.net/936/1000019936/10/2015/7-28/danlang.jpg',
    "5": 'http://hstatic.net/936/1000019936/10/2015/7-28/phuthuy.jpg',
    "6": 'http://hstatic.net/936/1000019936/10/2015/7-28/gialang.jpg',
    "7": 'http://hstatic.net/936/1000019936/10/2015/7-28/cupid.jpg',
    "8": 'https://scontent.fhan2-4.fna.fbcdn.net/v/t1.0-9/39169487_1891874787774904_4152750801296556032_n.png?_nc_cat=104&_nc_oc=AQmA2DI_V8Fc8BO1-a_IN4sPTyG9Ib2g0IKinTt82Lk1FOHCCcXoRn2v2P4HCoZ_17k&_nc_ht=scontent.fhan2-4.fna&oh=6ca2fc02030867f433a9a0d7b19efac9&oe=5D24912F',
    "9": 'https://scontent.fhan2-4.fna.fbcdn.net/v/t1.0-9/40290177_1903763683252681_3340783201013465088_n.jpg?_nc_cat=105&_nc_oc=AQlArfRa8KkCNdP1WbYj4XOdf2kphfLxmsPz-fqxZf7hSQdIm0Rdkr7RDlgT0ylgUs4&_nc_ht=scontent.fhan2-4.fna&oh=4a8cf5c06b8266f27d3209be1263fdae&oe=5D28DB19',
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