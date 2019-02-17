function downloadApk(bot, joinID) {
    bot.sendLinkMessage(joinID, {
        link: "https://bit.ly/masoiapk",
        linktitle: 'Mời bạn tải xuống app',
        linkdes: `💡Chia sẻ link với bạn bè: http://bit.ly/masoiapk\n💡Bấm vào đây để tải ngay`,
        linkthumb: "https://sites.google.com/site/masoibot/user/MaSoiLogo.png"
    });
};

module.exports = {
    downloadApk: downloadApk
}