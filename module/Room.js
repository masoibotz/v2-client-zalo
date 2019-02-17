const { ChatManager, TokenProvider } = require('@pusher/chatkit-client');
const { sendRequest } = require('../src/sendRole');

module.exports = (userInstance, bot) => {
    //join room
    const joinCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        let userID = userInstance.getUserID(joinID);
        if (!userID) {
            chat.say({
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
                let readyUserCount = Object.keys(r.players.ready).length;
                return `${r.state.status == 'waiting' ? '💤' : '🎮'}${r.roomChatID}`;
            })
            chat.conversation((convo) => {
                convo.ask({
                    text: `Chọn 1 phòng chơi: `,
                    quickReplies: ["/skip", ...rooms]
                }, (payload, convo) => {
                    let roomID = payload.message ? payload.message.text.match(/[0-9]+/g) : null;
                    roomID = roomID ? payload.message.text.match(/[0-9]+/g)[0] : null;
                    if (!roomID) {
                        convo.say({
                            text: `🚫Bạn chưa chọn phòng nào!`,
                            buttons: [
                                { type: 'postback', title: 'Thử lại', payload: 'JOIN_ROOM' },
                            ]
                        });
                        convo.end();
                        return;
                    }
                    sendRequest(`/play/${roomID}/join/${userID}`).then(data => {
                        if (data.success) {
                            // connect chat
                            userInstance.subscribeChat(roomID, joinID, chat, convo);
                            // get users
                            sendRequest(`/play/${roomID}/users`).then(users => {
                                let userListTxt = users.map((u, i) => {
                                    return `${data.ready[u.id] ? `🌟` : `☆`}${i + 1}: ${u.name}`;
                                }).join('\n');
                                convo.say({
                                    text: `PHÒNG ${roomID}\n${userListTxt}`,
                                    buttons: [
                                        { type: 'postback', title: '🌟Sẵn sàng', payload: 'READY' },
                                        { type: 'postback', title: 'Rời phòng', payload: 'LEAVE_ROOM' },
                                        { type: 'postback', title: '▶Bắt đầu game', payload: 'START' }
                                    ]
                                });
                            }).catch(err => {
                                console.log("ERR: get_users_error", err);
                                convo.say("ERR: get_users_error");
                            })
                            // get data
                            sendRequest(`/room/${roomID}/status`).then(data => {
                                userInstance.setData(joinID, data);
                            }).catch(err => {
                                console.log("ERR: get_data_error", err);
                                convo.say("ERR: get_data_error");
                            })
                            console.log(`Phòng ${roomID}: >> THAM GIA >> ${userID}`)
                            convo.end();
                        } else {
                            convo.say({
                                text: `🚫Phòng đang chơi!\nVui lòng thử lại sau!\njoin_room_err`,
                                buttons: [
                                    { type: 'postback', title: 'Thử lại', payload: 'JOIN_ROOM' },
                                ]
                            });
                            convo.end();
                        }
                    }).catch(err => {
                        console.log(`join_room_request_err:`, err);
                        convo.say({
                            text: "ERR: join_room_request_err",
                            buttons: [
                                { type: 'postback', title: 'Thử lại', payload: 'JOIN_ROOM' },
                            ]
                        });
                        convo.end();
                    })
                });
            });
        }).catch(err => {
            chat.say({
                text: `request_room_list_err:`,
                buttons: [
                    { type: 'postback', title: 'Thử lại', payload: 'JOIN_ROOM' },
                ]
            });
            console.log(`request_room_list_err:`, err);
        })
    };
    bot.hear(/^\/join$/, joinCallback);
    bot.on('postback:JOIN_ROOM', joinCallback);

    //leave room
    const leaveCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        let userID = userInstance.getUserID(joinID);
        let roomID = userInstance.getRoomID(joinID);
        if (userID && roomID) {
            sendRequest(`/play/${roomID}/leave/${userID}`).then(data => {
                if (data.success) {
                    // chat.say({
                    //     text: `Bạn đã rời phòng chơi!`,
                    //     buttons: [
                    //         { type: 'postback', title: 'Tham gia phòng khác', payload: 'JOIN_ROOM' },
                    //         { type: 'postback', title: 'Đăng xuất', payload: 'DISCONNECT' }
                    //     ]
                    // });
                    userInstance.leaveChat(joinID);
                }
            }).catch(err => {
                chat.say({
                    text: `Vui lòng thử lại!\nleave_room_request_err`,
                    buttons: [
                        { type: 'postback', title: 'Thử lại!', payload: 'LEAVE_ROOM' },
                    ]
                });
                console.log('leave_room_request_err:', err);
            })
        } else {
            chat.say({
                text: `Bạn chưa tham gia phòng nào!`,
                buttons: [
                    { type: 'postback', title: 'Tham gia phòng chơi', payload: 'JOIN_ROOM' },
                ]
            });
        }
        console.log(`${userID} leave room with ID: ${roomID}`)
    }
    bot.hear(/^\/leave$/, leaveCallback);
    bot.on('postback:LEAVE_ROOM', leaveCallback);

    //ready
    const readyCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        let userID = userInstance.getUserID(joinID);
        let roomID = userInstance.getRoomID(joinID);
        let isReady = userInstance.getReady(joinID);
        if (userID && roomID) {
            sendRequest(`/play/${roomID}/${isReady ? 'off' : 'on'}-ready/${userID}`).then(data => {
                if (data.success) {
                    chat.say({
                        text: `Bạn đã ${isReady ? 'bỏ ' : ''}sẵn sàng!`,
                        buttons: [
                            { type: 'postback', title: `${isReady ? 'Sẵn sàng' : 'Bỏ sẵn sàng'}`, payload: 'READY' },
                        ]
                    });
                    userInstance.invertReady(joinID);
                } else {
                    chat.say(`Vui lòng thử lại!\nready_request_error`);
                }
            }).catch(err => {
                chat.say(`Vui lòng thử lại!\nready_request_error`);
                console.log('ready_request_error:', err);
            })
        } else {
            chat.say(`Bạn chưa tham gia phòng nào!`);
        }
        console.log(`${userID} ${isReady ? 'off' : 'on'}-ready roomID: ${roomID}`);
    }
    bot.hear(/^\/ready$/, readyCallback);
    bot.on('postback:READY', readyCallback);

    //start
    const startCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        let userID = userInstance.getUserID(joinID);
        let roomID = userInstance.getRoomID(joinID);
        let isReady = userInstance.getReady(joinID);
        if (userID && roomID && isReady) {
            sendRequest(`/play/${roomID}/start`).then(data => {
                if (!data.success) {
                    chat.say({
                        text: `Không thể bắt đầu chơi\n${data.message}!\nstart_game_error`,
                        buttons: [
                            { type: 'postback', title: 'Thử lại!', payload: 'START' },
                        ]
                    });
                }
            }).catch(err => {
                chat.say({
                    text: `Vui lòng thử lại!\nstart_request_error`,
                    buttons: [
                        { type: 'postback', title: 'Thử lại!', payload: 'START' },
                    ]
                });
                console.log('ready_request_error:', err);
            })
        } else {
            chat.say({
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
    bot.hear(/^\/start$/, startCallback);
    bot.on('postback:START', startCallback);

    //start
    const voteCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        let userID = userInstance.getUserID(joinID);
        let gameData = userInstance.getData(joinID);
        let playerList = userInstance.getPlayerList(joinID);
        if (userID && playerList && gameData) {
            chat.say({
                text: `Lựa chọn 1 người:\n${Object.values(playerList).join('|')}`,
                quickReplies: Object.values(playerList),
            });
        } else {
            chat.say(`Bạn chỉ có thể vote khi game đã bắt đầu!`);
        }
    }
    bot.hear(/^\/vote$/, voteCallback);
    bot.on('postback:VOTE', voteCallback);
};