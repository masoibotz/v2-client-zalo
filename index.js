const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
var schedule = require('node-schedule')
var ZaloBot = require('./ZaloBot');

const { Game, Room, Player } = require('./src/MainGame/Game.js');

//module import
const route = require('./route');

const menuTienIch = require('./src/Menu/TienIch');
const menuHelp = require('./src/Menu/Help');
const attachmentChat = require('./src/Chat/AttachmentChat');
const joinRoom = require('./src/Room/Join');
const readyRoom = require('./src/Room/Ready');
const leaveRoom = require('./src/Room/Leave');
const newRoom = require('./src/Room/New');
const chatAndVote = require('./src/Chat/Chat');
const adminCMD = require('./src/Menu/Admin');

const gamef = new Game();
const bot = new ZaloBot();

// **** BOT MODULE ****
// setup GreetingText / GetStartedButton / PersistentMenu
// bot.module(botSetup);
// // help
// bot.module(menuHelp);
// // handle menu > tiện ích khi chơi
// gamef.module(menuTienIch, bot);
// // handle admin
// gamef.module(adminCMD, bot);
// // handle attachment chat
// gamef.module(attachmentChat, bot);
// // join room
// gamef.module(joinRoom, bot);
// // ready room
// gamef.module(readyRoom, bot);
// // leave room
// gamef.module(leaveRoom, bot);
// // new room
// gamef.module(newRoom, bot);
// // chat and vote
// gamef.module(chatAndVote, bot);

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/webhook/', function (req, res) {
  //console.log(req.query);
  let message = req.query.message;
  let joinID = req.query.fromuid;
  switch (req.query.event) {
    case 'sendmsg':
      if (!route(gamef, bot, joinID, message)){
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
      bot.say(joinID, `Đã nhận sticker!`);
      break;
  }
  res.sendStatus(200);
})

app.listen(app.get('port'), function () {
  console.log('Zalo bot started on port', app.get('port'))
})
