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
                    console.log('imageID:'+response.data.imageId);
                    resolve(response.data.imageId);
                } else {
                    reject(response);
                }
            });
        });
    }
    sendImageMessage(recipientId, imgURL, messageTxt = 'Bot đã gửi 1 hình ảnh!') {
        // main logo ID: 222d2fdd2cdcc5829ccd
        // sói: 27fe82aa81ab68f531ba
        // tiên tri: 9266265b5b5ab204eb4b
        let start = async () => {
            let imageid = await this.uploadImage(imgURL);
            return await new Promise((resolve, reject) => {
                this.ZOAClient.api('sendmessage/image', 'POST', { uid: recipientId, message: messageTxt, 'imageid': imageid }, function (response) {
                    if (response.errorMsg == 'Success') {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                });
            });
        }
        return start();
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