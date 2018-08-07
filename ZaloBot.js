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
            console.log(response);
        })
    }
    sendImageMessage(recipientId, imgURL, messageTxt = 'Bot đã gửi 1 hình ảnh!') {
        this.ZOAClient.api('upload/image', 'POST', { file: imgURL }, function (response) {
            ZOAClient.api('sendmessage/image', 'POST', { uid: recipientId, message: messageTxt, 'imageid': response.data.imageId }, function (response) {
                console.log(response);
            })
        })
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