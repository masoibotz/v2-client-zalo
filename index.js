const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
var schedule = require('node-schedule')
var ZaloBot = require('./ZaloBot');

const { Game, Room, Player } = require('./src/MainGame/Game.js');

//module import
const route = require('./route');
const chatAndVote = require('./src/Chat/Chat');
const attachmentChat = require('./src/Chat/AttachmentChat');

const gamef = new Game();
const bot = new ZaloBot();

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/webhook/', function (req, res) {
  //console.log(req.query);
  let message = req.query.message;
  let joinID = req.query.fromuid;
  switch (req.query.event) {
    case 'sendmsg':
      if (!route(gamef, bot, joinID, message)) {
        chatAndVote(gamef, bot, joinID, message);
      }

      // switch (message) {
      //   case '#join':
      //     let pro = bot.getProfile(joinID);
      //     bot.say(joinID, `Chào mừng bạn đến với Phạm Ngọc Duy Game Bot! ${JSON.stringify(pro)}`);
      //     break;
      //   case '#ready':
      //     bot.say(joinID, {
      //       text: 'Ma sói bot image',
      //       image: 'https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/37812890_1872137736415276_2253761986674294784_n.png?_nc_cat=0&oh=c66c9db1a9e5d72edb88931cadeff204&oe=5C07D275',
      //     });
      //     break;
      //   case '#leave':
      //     bot.sendActionList(joinID);
      //     break;
      // }
      break;
    case 'sendstickermsg':
      attachmentChat(gamef, bot, joinID, 'sticker', { stickerID: req.query.stickerid });
      break;
    case 'sendimagemsg':
      bot.say(joinID, `Bạn không thể gửi ảnh do Zalo giới hạn số lượng ảnh bot được gửi mỗi ngày!`);
      break;
    case 'sendlinkmsg':
      attachmentChat(gamef, bot, joinID, 'link', {
        link: req.query.href,
        linktitle: req.query.message!=''?req.query.message:'Bot đã gửi liên kết',
        linkdes: req.query.description!=''?req.query.description:'send link',
        linkthumb: req.query.thumb
      });
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
