module.exports = (bot) => {
    const helpCallback = (payload, chat) => {
        chat.getUserProfile().then((user) => {
            chat.say(`Xin chào ${user.last_name + ' ' + user.first_name}! \n` +
                `Để bắt đầu, bạn hãy mở MENU (nút 3 dấu gạch ngang) bên dưới.\n` +
                `Chọn menu: *🎮Chơi... > 🌝Tham gia phòng chơi* \n` +
                `Chọn một phòng chơi từ danh sách để tham gia một phòng!\n` +
                `Bạn có thể chat với các người chơi khác trong phòng! Bạn đừng quên: *🎮Chơi... > 🌟Sẵn sàng!*\n` +
                `Nếu không chơi hãy *🎮Chơi... > 🌚Rời phòng/Tự sát* để tránh ảnh hưởng người chơi khác\n` +
                `Khi tất cả mọi người đã sẵn sàng (ít nhất 4 người), trò chơi sẽ bắt đầu! \n` +
                `Trong khi chơi, bạn sẽ phải làm quen với lệnh: /vote <id> /save <id> /see <id>\n` +
                `VD: /save 1 để bảo vệ người chơi số 1\n` +
                `VD: /cupid 0 1 để ghép đôi 2 bạn trẻ số 0 và số 1 :D\n` +
                `VD: /vote 1 để bỏ phiếu CẮN (nếu là sói ban đêm) hoặc TREO CỔ (ban ngày) người chơi số 1\n` +
                `Cặp đôi có thể chat riêng: VD: /p xin chào để chào người bạn cặp đôi với mình\n` + 
                `Nếu quên <id> người chơi, vào menu: *🔧Tiện ích... > 🚪Tiện ích phòng chơi... > 👥Xem DS người chơi* \n` +
                `Nếu trong phòng có 2 người chơi cùng tên, hãy đổi tên của mình: *🔧Tiện ích... > 👼Tiện ích người chơi... > 🃏Đổi tên* \n` +
                `Nếu đã hết phòng chơi trống, hãy tạo 1 cái: *🔧Tiện ích... > 🚪Tiện ích phòng chơi... > ➕Thêm phòng chơi*`
            );
        })
    };
    // listen HELP button
    bot.on('postback:HELP', helpCallback);
    bot.hear(['help', 'hướng dẫn', 'trợ giúp', 'giúp', /\/help/i], helpCallback);
};