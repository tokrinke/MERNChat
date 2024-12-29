const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const Chat = require('../models/chat')
const Message = require('../models/message')

router.post('/create-new-chat', authMiddleware, async (req, res)=>{
    try {
        const chat = new Chat(req.body)
        const createdChat = await chat.save()
        res.status(201).send({
            message: 'chat created',
            success: true,
            data: createdChat
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.get('/all-chats', authMiddleware, async (req, res)=>{
    try {
        const currentUser = req.body.userId
        const chats = await Chat.find({members: {$in: currentUser}})
        .populate('members').populate('lastMessage').sort({updatedAt: -1});

        res.status(200).send({
            message: 'chats fetched',
            success: true,
            data: chats
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.post('/clear-unread', authMiddleware, async (req, res)=>{
    try {
        const chatId = req.body.chatId

        const chat = await Chat.findById(chatId)
        if(!chat){
            res.send({
                message: "No chat found with that chatId",
                success: false
            })
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {unreadMessageCount: 0},
            {new: true}
        ).populate('members').populate('lastMessage')

        await Message.updateMany(
            {chatId: chatId ,read: false},
            {read: true}
        )
        res.send({
            message: "Cleared unread messages",
            success: true,
            data: updatedChat
        })

    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})

module.exports = router