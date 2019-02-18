const { ChatManager, TokenProvider } = require('@pusher/chatkit-client');
const goStage = require('../src/goStage');
const { isAlive, isWolf, phe, extractUserRole } = require('../src/DataUtils');
const { checkReceiveChat } = require("./ChatUtils");

module.exports = class UserInstance {
    constructor() {
        this.users = [];
        this.userIDs = [];
        this.datas = [];
        this.playerLists = [];
        this.roomIDs = [];
        this.readys = [];
    }
    setInstance(joinID, userInstance) {
        this.users[joinID] = userInstance;
    }
    getInstance(joinID) {
        return this.users[joinID];
    }
    setData(joinID, data) {
        this.datas[joinID] = data;
    }
    getData(joinID) {
        return this.datas[joinID];
    }
    setUserID(joinID, userID) {
        this.userIDs[joinID] = userID;
    }
    getUserID(joinID) {
        return this.userIDs[joinID];
    }
    setPlayerList(joinID, playerList) {
        this.playerLists[joinID] = playerList;
    }
    getPlayerList(joinID) {
        return this.playerLists[joinID];
    }
    getRoomID(joinID) {
        return this.roomIDs[joinID];
    }
    setRoomID(joinID, roomID) {
        this.roomIDs[joinID] = roomID;
    }
    getReady(joinID) {
        return !!this.readys[joinID];
    }
    invertReady(joinID) {
        this.readys[joinID] = !this.readys[joinID];
    }
    module(factory, bot) {
        return factory.apply(this, [this, bot]);
    }
    connectChat(userID, joinID, bot) {
        var newChatMgr = new ChatManager({
            instanceLocator: "v1:us1:754dee8b-d6c4-41b4-a6d6-7105da589788",
            userId: userID,
            tokenProvider: new TokenProvider({
                url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/754dee8b-d6c4-41b4-a6d6-7105da589788/token"
            })
        });
        return newChatMgr.connect({
            onRemovedFromRoom: room => {
                console.log("kicked out room");
                bot.say(joinID, {
                    text: `Bạn đã rời phòng chơi!`,
                    buttons: [
                        { type: 'postback', title: 'Tham gia phòng khác', payload: 'JOIN_ROOM' },
                        { type: 'postback', title: 'Đăng xuất', payload: 'DISCONNECT' }
                    ]
                });
                this.setRoomID(joinID, undefined);
                this.leaveChat();
            }
        }).then(currentUser => {
            this.setUserID(joinID, userID);
            this.setInstance(joinID, currentUser);
            return currentUser;
        })
    }
    leaveChat(joinID) {
        var currentUser = this.getInstance(joinID);
        if (currentUser && currentUser.roomSubscriptions && currentUser.roomSubscriptions[this.getRoomID(joinID)]) {
            currentUser.roomSubscriptions[this.getRoomID(joinID)].cancel();
        }
    }
    timeLeftToString(timeLeft) {
        if (isNaN(timeLeft) || timeLeft < 0) return "";
        var minute = Math.floor(timeLeft / 60);
        var second = timeLeft % 60;
        return `[⏱${minute > 0 ? `${minute}:` : "0:"}${second < 10 ? `0${second}` : `${second}`}] `;
    }
    chatSayMessage(bot, joinID, userID, message, timeLeft = -1) {
        if (message.sender.id !== userID) {
            if (message.attachment && message.attachment.type && message.attachment.link) {
                // attachment
                console.log(`${message.sender.name}: attachment`);
                bot.say(joinID, [`${this.timeLeftToString(timeLeft)}${message.sender.name} đã gửi một file đính kèm`, {
                    attachment: message.attachment.type,
                    url: message.attachment.link
                }])
            } else {
                // text
                console.log(`${message.sender.name}: ${message.text}`);
                bot.say(joinID, `${this.timeLeftToString(timeLeft)}${message.sender.name}:\n${message.text}`);
            }
        } else {
            // bot.sendAction('mark_seen');
        }
    }
    subscribeChat(roomID, joinID, bot) {
        var currentUser = this.getInstance(joinID);
        if (!currentUser) {
            bot.say(joinID, {
                text: `Vui lòng đăng nhập!\nsubcribe_error_not_connected`,
                buttons: [
                    { type: 'postback', title: 'Đăng nhập', payload: 'CONNECT' },
                    { type: 'postback', title: 'Đăng kí', payload: 'REGISTER' }
                ]
            });
            return;
        }
        if (this.getRoomID(joinID)) {
            this.leaveChat();
            bot.say(joinID, `ℹ️Bạn đã rời phòng ${this.getRoomID(joinID)} để tham gia phòng ${roomID}!`);
        }
        currentUser.subscribeToRoom({
            roomId: roomID,
            hooks: {
                onMessage: message => {
                    let userID = this.getUserID(joinID);
                    var data = this.getData(joinID);
                    var userRole = data && data.setup ? extractUserRole(data, userID) : 4;
                    var userAlive = data ? isAlive(data, userID) : false;
                    if (message.text[0] === '{' && message.sender.id === "botquantro") {
                        // data from server
                        try {
                            var res = JSON.parse(message.text);
                            data = res.data;
                            let action = res.action;
                            let text = res.text;
                            if (action == "ready") {
                                let userListTxt = Object.keys(data.players.ready).map((u, i) => {
                                    return `${data.players.ready[u] ? `🌟` : `☆`}${i + 1}: ${data.players.names[u]}`;
                                }).join("\n");
                                bot.say(joinID, {
                                    text: `PHÒNG ${roomID}\n${userListTxt}`,
                                    buttons: [
                                        { type: 'postback', title: '🌟Sẵn sàng', payload: 'READY' },
                                        { type: 'postback', title: 'Rời phòng', payload: 'LEAVE_ROOM' },
                                        { type: 'postback', title: '▶Bắt đầu game', payload: 'START' }
                                    ]
                                });
                                return;
                            }
                            this.setData(joinID, data); // lưu gameData
                            let fullList = data.players.allID.filter((id) => { // lọc người còn sống
                                return isAlive(data, id);
                            });
                            let userIsWolf = isWolf(data, userID);
                            let coupleIndex = data.players.coupleID.indexOf(userID); //user_index
                            coupleIndex = coupleIndex != -1 ? (coupleIndex == 0 ? 1 : 0) : -1; //partner_index
                            var playerList = fullList.reduce((plist, p, index) => { // chuyển sang mảng vote [id: name]
                                plist[p] = `${userIsWolf ? (isWolf(data, p) ? "🐺" : "🎅") : ""}${data.players.coupleID[coupleIndex] == p ? "❤" : ""}${index}: ${data.players.names[p]}`;
                                return plist;
                            }, {});
                            this.setPlayerList(joinID, playerList); // lưu lại mạng vote
                            console.log("text=", text);
                            if (text != "") {
                                bot.say(joinID, `${text}`).then(() => {
                                    goStage(bot, joinID, data, userID, playerList);
                                })
                            } else {
                                goStage(bot, joinID, data, userID, playerList);
                            }
                        } catch (e) {
                            console.log(e);
                            bot.say(joinID, `MÀN HÌNH XANH HIỆN LÊN\nLiên hệ ngay admin về lỗi này!\nJSON_invalid_error`);
                        }
                    } else if (message.text[0] === '[') {
                        try {//is voteList from other
                            let content = JSON.parse(message.text)
                            var dayStage = data.state.dayStage;
                            if (dayStage == 'night' || dayStage == 'vote' || dayStage == 'voteYesNo') {
                                data = {
                                    ...data, roleTarget: {
                                        ...data.roleTarget,
                                        voteList: {
                                            ...data.roleTarget.voteList,
                                            [message.sender.id]: content[0].targetID
                                        }
                                    }
                                }
                                this.setData(joinID, data); // lưu gameData
                            }
                            if (checkReceiveChat(data, userID, userRole, userAlive)) {
                                let timeLeft = -1;
                                if (data && data.state && data.state.stageEnd != "") {
                                    timeLeft = (new Date(data.state.stageEnd) - new Date(Date.now())) / 1000;
                                    timeLeft = Math.floor(timeLeft);
                                }
                                this.chatSayMessage(bot, joinID, currentUser.id, {
                                    text: content[0].text,
                                    sender: {
                                        id: message.sender.id,
                                        name: message.sender.name
                                    }
                                }, timeLeft);
                            }
                        } catch (err) {
                            // console.log("receive_JSON_err", err);
                        }
                    } else {
                        // chat from other
                        if (checkReceiveChat(data, userID, userRole, userAlive)) {
                            let timeLeft = -1;
                            if (data && data.state && data.state.stageEnd != "") {
                                timeLeft = (new Date(data.state.stageEnd) - new Date(Date.now())) / 1000;
                                timeLeft = Math.floor(timeLeft);
                            }
                            this.chatSayMessage(bot, joinID, currentUser.id, message, timeLeft);
                            // if (message.sender.id !== currentUser.id) {
                            //     if (message.attachment && message.attachment.type && message.attachment.link) {
                            //         // attachment
                            //         bot.say(joinID, [`${message.sender.name} đã gửi...`, {
                            //             attachment: message.attachment.type,
                            //             url: message.attachment.link
                            //         }])
                            //     } else {
                            //         // text
                            //         bot.say(joinID, `${message.sender.name}:\n${message.text}`);
                            //         console.log(`${message.sender.name}: ${message.text}`);
                            //     }
                            // } else {
                            //     bot.sendAction('mark_seen');
                            // }
                        }
                    }
                }
            },
            messageLimit: 0
        }).catch(error => {
            console.log("user.subscribeToRoom error:", error);
            bot.say(joinID, {
                text: `ℹ️Tham gia phòng thất bại\nuser.subscribeToRoom_error`,
                buttons: [
                    { type: 'postback', title: 'Thử lại', payload: 'JOIN_ROOM' },
                ]
            });
        });
        this.setRoomID(joinID, roomID);
    }
}