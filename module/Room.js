const { sendRequest } = require('../src/sendRole');

function listRoom(userInstance, bot, joinID) {
    let userID = userInstance.getUserID(joinID);
    if (!userID) {
        bot.say(joinID, {
            text: `Vui lòng đăng nhập!`,
            buttons: [
                { type: 'postback', title: 'Đăng nhập', payload: 'CONNECT' },
                { type: 'postback', title: 'Đăng kí', payload: 'REGISTER' }
            ]
        });
        return;
    }
    sendRequest(`/room`).then(data => {
        let count = 0;
        let rooms = data.filter((r, i) => {
            return count <= 10 && ++count;
        }).map((r) => {
            // let readyUserCount = Object.keys(r.players.ready).length;
            return `${r.state.status == 'waiting' ? '💤' : '🎮'}${r.roomChatID}`;
        })
        bot.say(joinID, {
            text: `#join <mã phòng> để tham gia phòng\nDanh sách phòng chơi:`,
            quickReplies: rooms
        })
    }).catch(err => {
        bot.say(joinID, {
            text: `request_room_list_err:`,
            buttons: [
                { type: 'postback', title: 'Thử lại', payload: 'JOIN_ROOM' },
            ]
        });
        console.log(`request_room_list_err:`, err);
    })
}
function joinRoom(userInstance, bot, joinID, roomID) {
    let userID = userInstance.getUserID(joinID);
    if (!userID) {
        bot.say(joinID, {
            text: `Vui lòng đăng nhập!`,
            buttons: [
                { type: 'postback', title: 'Đăng nhập', payload: 'CONNECT' },
                { type: 'postback', title: 'Đăng kí', payload: 'REGISTER' }
            ]
        });
        return;
    }
    sendRequest(`/play/${roomID}/join/${userID}`).then(data => {
        if (data.success) {
            // connect chat
            userInstance.subscribeChat(roomID, joinID, bot, bot);
            // get users
            sendRequest(`/play/${roomID}/users`).then(users => {
                let userListTxt = users.map((u, i) => {
                    return `${data.ready[u.id] ? `🌟` : `☆`}${i + 1}: ${u.name}`;
                }).join('\n');
                bot.say(joinID, {
                    text: `PHÒNG ${roomID}\n${userListTxt}`,
                    buttons: [
                        { type: 'postback', title: '🌟Sẵn sàng', payload: 'READY' },
                        { type: 'postback', title: 'Rời phòng', payload: 'LEAVE_ROOM' },
                        { type: 'postback', title: '▶Bắt đầu game', payload: 'START' }
                    ]
                });
            }).catch(err => {
                console.log("ERR: get_users_error", err);
                bot.say(joinID, "ERR: get_users_error");
            })
            // get data
            sendRequest(`/room/${roomID}/status`).then(data => {
                userInstance.setData(joinID, data);
            }).catch(err => {
                console.log("ERR: get_data_error", err);
                bot.say(joinID, "ERR: get_data_error");
            })
            console.log(`Phòng ${roomID}: >> THAM GIA >> ${userID}`)

        } else {
            bot.say(joinID, {
                text: `🚫Phòng đang chơi!\nVui lòng thử lại sau!\njoin_room_err`,
                buttons: [
                    { type: 'postback', title: 'Thử lại', payload: 'JOIN_ROOM' },
                ]
            });
        }
    }).catch(err => {
        console.log(`join_room_request_err:`, err);
        bot.say(joinID, {
            text: "ERR: join_room_request_err",
            buttons: [
                { type: 'postback', title: 'Thử lại', payload: 'JOIN_ROOM' },
            ]
        });
    })
}
function leaveRoom(userInstance, bot, joinID) {
    let userID = userInstance.getUserID(joinID);
    let roomID = userInstance.getRoomID(joinID);
    if (userID && roomID) {
        sendRequest(`/play/${roomID}/leave/${userID}`).then(data => {
            if (data.success) {
                // bot.say(joinID, {
                //     text: `Bạn đã rời phòng chơi!`,
                //     buttons: [
                //         { type: 'postback', title: 'Tham gia phòng khác', payload: 'JOIN_ROOM' },
                //         { type: 'postback', title: 'Đăng xuất', payload: 'DISCONNECT' }
                //     ]
                // });
                userInstance.leaveChat(joinID);
            }
        }).catch(err => {
            bot.say(joinID, {
                text: `Vui lòng thử lại!\nleave_room_request_err`,
                buttons: [
                    { type: 'postback', title: 'Thử lại!', payload: 'LEAVE_ROOM' },
                ]
            });
            console.log('leave_room_request_err:', err);
        })
    } else {
        bot.say(joinID, {
            text: `Bạn chưa tham gia phòng nào!`,
            buttons: [
                { type: 'postback', title: 'Tham gia phòng chơi', payload: 'JOIN_ROOM' },
            ]
        });
    }
    console.log(`${userID} leave room with ID: ${roomID}`)
}
function ready(userInstance, bot, joinID) {
    let userID = userInstance.getUserID(joinID);
    let roomID = userInstance.getRoomID(joinID);
    let isReady = userInstance.getReady(joinID);
    if (userID && roomID) {
        sendRequest(`/play/${roomID}/${isReady ? 'off' : 'on'}-ready/${userID}`).then(data => {
            if (data.success) {
                bot.say(joinID, {
                    text: `Bạn đã ${isReady ? 'bỏ ' : ''}sẵn sàng!`,
                    buttons: [
                        { type: 'postback', title: `${isReady ? 'Sẵn sàng' : 'Bỏ sẵn sàng'}`, payload: 'READY' },
                    ]
                });
                userInstance.invertReady(joinID);
            } else {
                bot.say(joinID, `Vui lòng thử lại!\nready_request_error`);
            }
        }).catch(err => {
            bot.say(joinID, `Vui lòng thử lại!\nready_request_error`);
            console.log('ready_request_error:', err);
        })
    } else {
        bot.say(joinID, `Bạn chưa tham gia phòng nào!`);
    }
    console.log(`${userID} ${isReady ? 'off' : 'on'}-ready roomID: ${roomID}`);
}
function start(userInstance, bot, joinID) {
    let userID = userInstance.getUserID(joinID);
    let roomID = userInstance.getRoomID(joinID);
    let isReady = userInstance.getReady(joinID);
    if (userID && roomID && isReady) {
        sendRequest(`/play/${roomID}/start`).then(data => {
            if (!data.success) {
                bot.say(joinID, {
                    text: `Không thể bắt đầu chơi\n${data.message}!\nstart_game_error`,
                    buttons: [
                        { type: 'postback', title: 'Thử lại!', payload: 'START' },
                    ]
                });
            }
        }).catch(err => {
            bot.say(joinID, {
                text: `Vui lòng thử lại!\nstart_request_error`,
                buttons: [
                    { type: 'postback', title: 'Thử lại!', payload: 'START' },
                ]
            });
            console.log('ready_request_error:', err);
        })
    } else {
        bot.say(joinID, {
            text: `Bạn không thể bắt đầu game!\nBạn phải đăng nhập, tham gia 1 phòng và sẵn sàng trước!\nnot_login_join_or_ready_error`,
            buttons: [
                { type: 'postback', title: 'Tham gia phòng chơi', payload: 'JOIN_ROOM' },
                { type: 'postback', title: 'Sẵn sàng', payload: 'READY' },
                { type: 'postback', title: 'Thử lại!', payload: 'START' },
            ]
        });
    }
    console.log(`${userID} start roomID: ${roomID}`);
}
function vote(userInstance, bot, joinID) {
    let userID = userInstance.getUserID(joinID);
    let gameData = userInstance.getData(joinID);
    let playerList = userInstance.getPlayerList(joinID);
    if (userID && playerList && gameData) {
        bot.say(joinID, {
            text: `Danh sách để lựa chọn:`,
            quickReplies: Object.values(playerList),
        });
    } else {
        bot.say(joinID, `Bạn chỉ có thể vote khi game đã bắt đầu!`);
    }
}

module.exports = {
    listRoom: listRoom,
    joinRoom: joinRoom,
    leaveRoom: leaveRoom,
    ready: ready,
    start: start,
    vote: vote
}