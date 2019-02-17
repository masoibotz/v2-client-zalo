function checkReceiveChat(data, userID, userRole, userAlive) {
    // console.log("checkReceiveChat");
    return !data || (data && data.state.status === 'waiting') || // phòng chờ / vừa join phòng
        !userAlive || // chết rồi :v
        (data && (
            (data.state.dayStage === 'night' && (userRole == -1 || userRole == -3 || userID == data.roleInfo.superWolfVictimID)) // đêm là sói
            || data.state.dayStage === 'discuss' // thảo luận 
            || data.state.dayStage === 'vote' // vote
            || data.state.dayStage === 'voteYesNo' // vote
            || data.state.dayStage === 'lastWord' // vote
        ))
}
function checkDisableChat(data, userID, userRole, userAlive) {
    // console.log("checkDisableChat");
    if (!userAlive) return true;
    return !(!data || (data && data.state.status === 'waiting') || // phòng chờ / vừa join phòng
        (data && (
            (data.state.dayStage === 'night' && (userRole == -1 || userRole == -3 || userID == data.roleInfo.superWolfVictimID)) || // đêm là sói
            data.state.dayStage === 'discuss' || // thảo luận
            (data.state.dayStage === 'lastWord' && userID == data.roleInfo.victimID)// trăn trối / giẫy
        ))
    )
}
module.exports = {
    checkReceiveChat: checkReceiveChat,
    checkDisableChat: checkDisableChat
}