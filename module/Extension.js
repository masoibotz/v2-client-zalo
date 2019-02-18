function downloadApk(bot, joinID) {
    bot.sendLinkMessage(joinID, {
        link: "https://bit.ly/masoiapk",
        linktitle: 'Mời bạn tải xuống app',
        linkdes: `💡Chia sẻ link với bạn bè: http://bit.ly/masoiapk\n💡Bấm vào đây để tải ngay`,
        linkthumb: "https://sites.google.com/site/masoibot/user/MaSoiLogo.png"
    });
};
function setupGame(userInstance, bot, joinID) {
    var roomID = userInstance.getRoomID(joinID);
    bot.sendLinkMessage(joinID, {
        link: `https://phamngocduy98.github.io/masoibot/setup?roomID=${roomID}`,
        linktitle: 'Ma sói Setup',
        linkdes: `Set-up vai trò bằng tay`,
        linkthumb: "https://sites.google.com/site/masoibot/user/MaSoiLogo.png"
    });
};

module.exports = {
    downloadApk: downloadApk,
    setupGame: setupGame
}