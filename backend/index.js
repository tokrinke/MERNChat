const express = require('express')
const app = express();
const authRouter = require('./controllers/authController')
const userRouter = require('./controllers/userController')
const chatRouter = require('./controllers/chatController')
const messageRouter = require('./controllers/messageController')

app.use(express.json({
    limit: '50mb'
}))
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET','POST']
    }
})

app.use('/', authRouter)
app.use('/users', userRouter)
app.use('/chats', chatRouter)
app.use('/messages', messageRouter)

const onlineUsers = []

io.on('connection', socket => {
    socket.on('join-room', userId => {
        socket.join(userId)
    })
    socket.on('send-message', (message) => {
        console.log('Emitting message to clients: (send-message)', message);
        io.to(message.members[0]).to(message.members[1])
        .emit('recieved-message', message)

        io.to(message.members[0]).to(message.members[1])
        .emit('set-message-count', message)
    })
    socket.on('clear-unread', data => {
        io.to(data.members[0]).to(data.members[1])
        .emit('cleared-unread-messages', data)
    })
    socket.on('user-typing', (data) => {
        io.to(data.members[0]).to(data.members[1])
        .emit('started-typing', data)
    })
    socket.on('user-is-online', userId => {
        if(!onlineUsers.includes(userId)){
            onlineUsers.push(userId)
        }
        socket.emit('online-users', onlineUsers);
    })
    socket.on('user-logout', userId => {
        onlineUsers.splice(onlineUsers.indexOf(userId), 1)
        io.emit('online-users-updated', onlineUsers)
    })
})

module.exports = server