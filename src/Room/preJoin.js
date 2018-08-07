module.exports = (gamef, bot, joinID) => {
    let userRoom = gamef.getUserRoom(joinID);
    if (userRoom != undefined) {
        bot.say(joinID, `Bạn đã tham gia phòng ${(userRoom + 1)} rồi!\nĐể rời phòng chơi, chọn menu Chơi > Rời/tự sát!`);
        return;
    }
    let roomListView = gamef.getRoomListView();
    bot.say(joinID, `Danh sách phòng:\n${roomListView.join(" ; ")}\n/join <id> để tham gia`);
};