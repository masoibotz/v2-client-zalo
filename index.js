const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
var schedule = require('node-schedule')
var ZaloBot = require('./ZaloBot');
const { JSDOM } = require('jsdom');

// app src import
const UserInstance = require('./src/userInstance');
const route = require('./route');

//config
const { window } = new JSDOM();
global.window = window;
global.navigator = {};

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app src use
const bot = new ZaloBot();
const userInstance = new UserInstance();

app.get('/webhook/', function (req, res) {
  //console.log(req.query);
  let message = req.query.message;
  let joinID = req.query.fromuid;
  switch (req.query.event) {
    case 'sendmsg':
      route(userInstance, bot, joinID, message);
      break;
    case 'sendstickermsg':
      attachmentChat(userInstance, bot, joinID, 'sticker', { stickerID: req.query.stickerid });
      break;
    case 'sendimagemsg':
      bot.say(joinID, `Bạn không thể gửi ảnh do Zalo giới hạn số lượng ảnh bot được gửi mỗi ngày!`);
      break;
    case 'sendlinkmsg':
      attachmentChat(userInstance, bot, joinID, 'link', {
        link: req.query.href,
        linktitle: req.query.message != '' ? req.query.message : 'Bot đã gửi liên kết',
        linkdes: req.query.description != '' ? req.query.description : 'Bấm vào để mở liên kết',
        linkthumb: req.query.thumb
      });
      break;
    case 'sendgifmsg':
      bot.say(joinID, `Bạn không thể gửi ảnh do Zalo giới hạn số lượng ảnh bot được gửi mỗi ngày!`);
      break;
    default:
      bot.say(joinID, `Bạn đã gửi nội dung không được hỗ trợ!`);
      console.log('unsupported message:\n', req.query);
  }
  res.sendStatus(200);
})

app.listen(app.get('port'), function () {
  console.log('Zalo bot started on port', app.get('port'))
})
