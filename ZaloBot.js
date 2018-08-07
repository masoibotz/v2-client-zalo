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
        this.ZOAClient.api('sendmessage/text', 'POST', { uid: recipientId, message: messageTxt }, function (response) {
            console.log(response.errorMsg);
        })
    }
    sendImageMessage(recipientId, imgURL, messageTxt = 'Bot đã gửi 1 hình ảnh!') {
        // main logo ID: 222d2fdd2cdcc5829ccd
        this.ZOAClient.api('upload/image', 'POST', { file: imgURL }, function (response) {
            console.log(response.data.imageId);
            let imageid = /*'222d2fdd2cdcc5829ccd'; */response.data.imageId;
            this.ZOAClient.api('sendmessage/image', 'POST', { uid: recipientId, message: messageTxt, 'imageid': imageid }, function (response) {
                console.log(response.errorMsg);
            })
        }.bind(this))
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
    getProfile(recipientId, callback) {
        this.ZOAClient.api('getprofile', { uid: recipientId }, function (response) {
            callback(response.data);
        });
    }
    say(recipientId, message) {
        if (typeof message === 'string') {
            return this.sendTextMessage(recipientId, message);
        } else {
            if (message.image && message.text) {
                return this.sendImageMessage(recipientId, message.image, message.text)
            }
        }
        console.error('Invalid format for .say() message.');
    }
}

module.exports = ZaloBot;