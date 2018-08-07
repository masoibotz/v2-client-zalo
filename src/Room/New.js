module.exports = (gamef, bot) => {
    const newCallback = (payload, chat) => {
        let newRoomID = gamef.newRoom();
        chat.say(`Đã tạo phòng chơi ${newRoomID}!`);
    };
    // listen JOIN ROOM
    bot.on('postback:NEW_ROOM', newCallback);
    bot.hear(/\/new/i, newCallback);
};