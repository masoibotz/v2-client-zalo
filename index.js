const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
var schedule = require('node-schedule')
var ZaloOA = require('zalo-sdk').ZaloOA;
 
var zaConfig = {
    oaid: '3143856013449793558',
    secretkey: '0DHbJHF76STPd6D2cMd4'
}
var ZOAClient = new ZaloOA(zaConfig);

const { Game, Room, Player } = require('./src/MainGame/Game.js');

//module import
const botSetup = require('./src/botSetup');
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
  console.log(req.query);
  switch (req.query.event) {
    case 'sendmsg':
      let message = req.query.message;
      switch (message) {
        case 'hello':
          replyMessage(req.query.fromuid, 'Chào mừng bạn đến với Phạm Ngọc Duy Bot!');
          break;
        case 'image':
          replyImage(req.query.fromuid, 'https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/37812890_1872137736415276_2253761986674294784_n.png?_nc_cat=0&oh=c66c9db1a9e5d72edb88931cadeff204&oe=5C07D275');
          break;
      }
  }
  res.sendStatus(200);
})

function replyMessage(joinID, messageTxt) {
  ZOAClient.api('sendmessage/text', 'POST', { uid: joinID, message: messageTxt }, function (response) {
    console.log(response);
  })
}

function replyImage(joinID, imgURL, messageTxt = 'Bot đã gửi 1 hình ảnh!') {
  ZOAClient.api('upload/image', 'POST', { file: imgURL }, function (response) {
    ZOAClient.api('sendmessage/image', 'POST', { uid: joinID, message: messageTxt, 'imageid': response.data.imageId }, function (response) {
      console.log(response);
    })
  })
}

app.listen(app.get('port'), function () {
  console.log('Started on port', app.get('port'))
})
