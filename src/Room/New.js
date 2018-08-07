module.exports = (gamef, bot, joinID) => {
    let newRoomID = gamef.newRoom();
    bot.say(joinID, `Đã tạo phòng chơi ${newRoomID}!`);
};