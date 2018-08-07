async function asyncForEach(array, mapCallback, /*callback*/) {
    // for (let index = 0; index < array.length; index++) {
    //     await callback(array[index], index, array)
    // }
    let each = array.map(mapCallback);
    each.forEach(async (action, index) => {
        try {
            await action
            // console.log('##  ROOM ROLE CHAT : ', index);
        } catch (e) {
            console.error('## ForEach ERR at Utils.js : ', e)
        }
    })
}
async function roomChatAll(bot, players, sendID, content) {
    let each = players.map(p => {
        if (p.joinID != sendID) {
            return bot.say(p.joinID, content)
        }
    });
    each.forEach(async (sendAction, index) => {
        try {
            await sendAction
            //console.log('## Messenger sent to ', players[index].first_name)
        } catch (e) {
            console.error('## Messenger ERR : ', e)
        }
    })
}
async function roomWolfChatAll(bot, wolfsID, sendID, content) {
    let each = wolfsID.map(wID => {
        if (wID != sendID) {
            return bot.say(wID, content)
        }
    });
    each.forEach(async (sendAction, index) => {
        try {
            await sendAction
            //console.log('## Messenger sent to ', index)
        } catch (e) {
            console.error('## Messenger ERR : ', e)
        }
    })
}

module.exports = {
    asyncForEach: asyncForEach,
    roomChatAll: roomChatAll,
    roomWolfChatAll: roomWolfChatAll,
}

// async function roomChatAll(bot, players, sendID, content) {
//     await asyncForEach(players, async (m) => {
//         if (m && m.joinID != sendID) {
//             await bot.say(m.joinID, content);
//         }
//     })
// }
// async function roomWolfChatAll(bot, wolfsID, sendID, content) {
//     await asyncForEach(wolfsID, async (m) => {
//         if (m != sendID) {
//             await bot.say(m, content);
//         }
//     })
// }