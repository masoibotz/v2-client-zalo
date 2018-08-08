var ZaloOA = require('zalo-sdk').ZaloOA;

class ZaloBot {
    constructor() {
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
            this.ZOAClient.api('upload/image', 'POST', { file: imgURL }, response => {
                if (response.errorMsg == 'Success') {
                    console.log(imgURL + ' => ' + response.data.imageId);
                    resolve(response.data.imageId);
                } else {
                    reject(response);
                }
            });
        });
    }
    sendImageMessage(recipientId, imageid, messageTxt = 'Bot đã gửi 1 hình ảnh!') {
        // main logo ID: 222d2fdd2cdcc5829ccd
        // sói: c3c4e96a976b7e35277a
        // tiên tri: 45d1697f177efe20a76f
        /// thợ săn: 96f36f981299fbc7a288
        /// phản bội: 5e8da6e6dbe732b96bf6
        /// bảo vệ: bba5a005de04375a6e15
        // già làng: e13adc74a175482b1164
        // dân: 39d3189d659c8cc2d58d
        // phủ thủy: 2e250d6b706a9934c07b
        // cupid: b71e9750ea51030f5a40

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
            if (message.image && message.text) {
                return this.uploadImage(message.image).then((imageid) => {
                    this.sendImageMessage(recipientId, imageid, message.text);
                });
            } else if (message.imageID && message.text) {
                return this.sendImageMessage(recipientId, message.imageID, message.text);
            } else if (Array.isArray(message)) {
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