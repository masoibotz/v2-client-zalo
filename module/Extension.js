module.exports = (userInstance, bot) => {
    const downloadAppCallback = async (payload, chat) => {
        const joinID = payload.sender.id;
        console.log(`${joinID} download app...`);
        var currentUser = userInstance.getInstance(joinID);
        chat.say({
            cards: [
                {
                    title: `Mời bạn tải xuống app`,
                    image_url: "https://sites.google.com/site/masoibot/user/MaSoiLogo.png",
                    subtitle: `💡Chia sẻ link với bạn bè: http://bit.ly/masoiapk`,
                    default_action: {
                        "type": "web_url",
                        "url": "http://bit.ly/masoiapk",
                    },
                    buttons: [
                        {
                            type: "web_url",
                            url: "http://bit.ly/masoiapk",
                            title: "Tải xuống apk"
                        }
                    ]
                }
            ]
        });
    }

    bot.hear(/^\/tải_app$/, downloadAppCallback);
    bot.on('postback:DOWNLOAD_APP', downloadAppCallback);
};