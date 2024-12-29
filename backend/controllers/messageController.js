const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const Chat = require('../models/chat')
const Message = require('../models/message')

router.post('/new-message', authMiddleware, async (req, res)=>{
    try {
        const message = new Message(req.body)
        const savedMessage = await message.save()

        // const currentChat = await Chat.findById(req.body.chatId)
        // currentChat.lastMessage = savedMessage._id
        // await currentChat.save()
        const currentChat = await Chat.findOneAndUpdate({
            _id: req.body.chatId
        },{
            lastMessage: savedMessage._id,
            $inc: {unreadMessageCount: 1}
        })

        res.status(201).send({
            message: 'message sent',
            success: true,
            data: savedMessage
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.get('/all-messages/:chatId', authMiddleware, async (req, res)=>{
    try {
        const currentChatId = req.params.chatId
        const messages = await Message.find({chatId: currentChatId}).sort({createdAt: 1})
        res.send({
            message: 'messages fetched',
            success: true,
            data: messages
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

module.exports = router