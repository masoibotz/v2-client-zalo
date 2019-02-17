const { postRequest } = require('../src/sendRole');

function login(userInstance, bot, joinID, userID) {
    userInstance.connectChat(userID, joinID, bot).then(currentUser => {
        console.log(`Login: ${userID}`);
        bot.say(joinID, {
            text: `Bạn đã đăng nhập thành công!\nHãy tham gia 1 phòng chơi!`,
            buttons: [
                { type: 'postback', title: 'Tham gia phòng chơi', payload: 'JOIN_ROOM' },
                { type: 'postback', title: 'Đăng xuất', payload: 'DISCONNECT' }
            ]
        });
    }).catch(error => {
        if (error.info && error.info.error && error.info.error == "services/chatkit/not_found/user_not_found") {
            bot.say(joinID, {
                text: `Tên đăng nhập chưa được đăng kí\nBạn có muốn đăng kí?`,
                buttons: [
                    { type: 'postback', title: 'Đăng nhập lại', payload: 'CONNECT' },
                    { type: 'postback', title: 'Đăng kí', payload: 'REGISTER' }
                ]
            });
            return;
        }
        console.log("chatMgr.connect error:", error.info.error);
        bot.say(joinID, {
            text: `Đăng nhập thất bại\nchatMgr.connect_err`,
            buttons: [
                { type: 'postback', title: 'Đăng nhập lại', payload: 'CONNECT' },
                { type: 'postback', title: 'Đăng kí', payload: 'REGISTER' }
            ]
        });
    })
}
function logout(userInstance, bot, joinID) {
    var currentUser = userInstance.getInstance(joinID);
    if (currentUser) {
        currentUser.disconnect();
        userInstance.setInstance(joinID, null);
        userInstance.setData(joinID, null);
        userInstance.setUserID(joinID, null);
        userInstance.setRoomID(joinID, null);
        bot.say(joinID, `Bạn đã đăng xuất thành công!`);
    } else {
        bot.say(joinID, `Bạn chưa đăng nhập!`);
    }
}
function register(userInstance, bot, joinID, userID) {
    var currentUser = userInstance.getInstance(joinID);
    if (!currentUser) {
        bot.getProfile(joinID).then((user) => {
            console.log("REG: ", { id: userID, name: `${user.first_name} ${user.last_name}`, avatar: user.profile_pic });
            postRequest(`/reg`, { id: userID, name: `${user.first_name} ${user.last_name}`, avatar: user.profile_pic }).then(data => {
                if (data.success) {
                    bot.say(joinID, {
                        text: `Bạn đã đăng kí thành công!\nVui lòng đăng nhập!`,
                        buttons: [
                            { type: 'postback', title: 'Đăng nhập', payload: 'CONNECT' },
                            { type: 'postback', title: 'Tải app cho android', payload: 'DOWNLOAD_APP' }
                        ]
                    })
                } else {
                    bot.say(joinID, {
                        text: `Vui lòng thử lại với tên khác!`,
                        buttons: [
                            { type: 'postback', title: 'Thử lại', payload: 'REGISTER' }
                        ]
                    })
                }
            }).catch(err => {
                bot.say(joinID, {
                    text: `Vui lòng thử lại!\nregister_request_error`,
                    buttons: [
                        { type: 'postback', title: 'Thử lại', payload: 'REGISTER' }
                    ]
                })
            })
        });
    } else {
        bot.say(joinID, `Bạn đã đăng nhập rồi!`);
    }
}

module.exports = {
    login: login,
    logout: logout,
    register: register
}