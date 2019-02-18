var ZaloOA = require('zalo-sdk').ZaloOA;

const buttonPayload = {
    "CONNECT": "login",
    "REGISTER": "register",
    "DISCONNECT": "logout",
    "JOIN_ROOM": "join",
    "LEAVE_ROOM": "leave",
    "READY": "ready",
    "START": "start",
    "VOTE": "vote",
    "DOWNLOAD_APP": "download"
}

class ZaloBot {
    constructor() {
        this.imageCache = {};
        var zaConfig = {
            oaid: '3143856013449793558',
            secretkey: '0DHbJHF76STPd6D2cMd4'
        }
        this.ZOAClient = new ZaloOA(zaConfig);
    }
    sendTextMessage(recipientId, messageTxt) {
        return new Promise((resolve, reject) => {
            this.ZOAClient.api('sendmessage/text', 'POST', { uid: recipientId, message: messageTxt }, response => {
                if (response.errorMsg == 'Success') {
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
    }
    uploadImage(imgURL) {
        return new Promise((resolve, reject) => {
            if (this.imageCache[imgURL]) {
                resolve(this.imageCache[imgURL]);
                return;
            }
            this.ZOAClient.api('upload/image', 'POST', { file: imgURL }, response => {
                if (response.errorMsg == 'Success') {
                    console.log(imgURL + ' => ' + response.data.imageId);
                    this.imageCache[imgURL] = response.data.imageId;
                    resolve(response.data.imageId);
                } else {
                    reject(response);
                }
            });
        });
    }
    sendImageMessage(recipientId, imageid, messageTxt = 'Bot đã gửi 1 hình ảnh!') {
        return new Promise((resolve, reject) => {
            this.ZOAClient.api('sendmessage/image', 'POST', { uid: recipientId, message: messageTxt, 'imageid': imageid }, function (response) {
                if (response.errorMsg == 'Success') {
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
    }
    sendStickerMessage(recipientId, stickerID) {
        return new Promise((resolve, reject) => {
            this.ZOAClient.api('sendmessage/sticker', 'POST', { uid: recipientId, stickerid: stickerID }, function (response) {
                if (response.errorMsg == 'Success') {
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
    }
    //sendLinkMessage(links = {
    //     link: "https://go.to/#this-link",
    //     linktitle: 'Title',
    //     linkdes: `Subtitle`,
    //     linkthumb: "https://source.img/images.png"
    // })
    sendLinkMessage(recipientId, links) {
        var params = {
            uid: recipientId,
            links: Array.isArray(links) ? links : [links]
        }
        return new Promise((resolve, reject) => {
            this.ZOAClient.api('sendmessage/links', 'POST', params, function (response) {
                if (response.errorMsg == 'Success') {
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
    }
    sendActionList(recipientId) {
        var params = {
            uid: recipientId,
            actionlist: [{
                action: 'oa.open.inapp',
                title: 'Send interactive messages',
                description: 'This is a test for API send interactive messages',
                thumb: 'https://developers.zalo.me/web/static/images/bg.jpg',
                href: 'https://developers.zalo.me',
                data: 'https://developers.zalo.me',
                popup: {
                    title: 'Open Website Zalo For Developers',
                    desc: 'Click ok to visit Zalo For Developers and read more Document',
                    ok: 'ok',
                    cancel: 'cancel'
                }
            }]
        }
        this.ZOAClient.api('sendmessage/actionlist', 'POST', params, function (response) {
            console.log(response.errorMsg);
        })
    }
    getProfile(recipientId) {
        return new Promise((resolve, reject) => {
            this.ZOAClient.api('getprofile', { uid: recipientId }, function (response) {
                response.data ? resolve(response.data) : reject(response);
            });
        });
    }
    say(recipientId, message) {
        if (typeof message === 'string') {
            return this.sendTextMessage(recipientId, message);
        } else {
            if (message.buttons && message.buttons.length > 0) {// buttons
                return this.sendTextMessage(recipientId, `${message.text}\n__________________\n${message.buttons.map(b => `#${buttonPayload[b.payload]} ${b.title}`).join("\n")}`);
            } else if (message.quickReplies) { // quickReplies
                return this.sendTextMessage(recipientId, `${message.text}\n${message.quickReplies.join("\n")}`);
            } else if (message.image && message.text) { //image is imageURL
                return this.uploadImage(message.image).then((imageid) => {
                    this.sendImageMessage(recipientId, imageid, message.text);
                });
            } else if (message.imageID && message.text) { //send image already uploaded
                return this.sendImageMessage(recipientId, message.imageID, message.text);
            } else if (message.stickerID && message.attachment == 'sticker') { //zalo sticker
                return this.sendStickerMessage(recipientId, message.stickerID);
            } else if (message.attachment == 'image' && message.url != "") { // send image
                return this.uploadImage(message.url).then((imageid) => {
                    this.sendImageMessage(recipientId, imageid, message.text);
                });
            } else if (message.attachment == 'link') { // send link card
                return this.sendLinkMessage(recipientId, message.links);
            } else if (Array.isArray(message)) { // multi messages support
                return message.reduce((promise, msg) => {
                    return promise.then(() => this.say(recipientId, msg));
                }, Promise.resolve());
            } else {
                console.error('Invalid format for .say() message.');
            }
        }
    }
}

module.exports = ZaloBot;