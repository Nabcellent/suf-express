
module.exports = alertMessage = (req, messageType, messageIntro, messageText) => {
    req.session.message = {
        type: messageType,
        intro: messageIntro,
        message: messageText
    }
}