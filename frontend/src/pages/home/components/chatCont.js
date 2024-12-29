import '../../../styles/home.css'
import '../../../styles/chat.css'
import {
    SmilePlus, Send, ImagePlus, CheckCheck
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewMessage, fetchAllMessages } from '../../../apiCalls/message';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { clearUnreadMessages } from '../../../apiCalls/chat';
import  store  from '../../../redux/store'
import { setAllChats } from '../../../redux/userSlice';
import EmojiPicker from 'emoji-picker-react';

const ChatContainer = ({ socket, allMessages, setAllMessages, onlineUsers}) => {
    const { user, selectedChat, allChats } = useSelector(state => state.userReducer)
    const selectedUser = selectedChat.members.find(u => u._id !== user._id) 
    const { enqueueSnackbar } = useSnackbar()
    const [message, setMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [data, setData] = useState(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const dispatch = useDispatch()


    const sendMessage = async (image) => {
        try {
            const newMessage = {
                chatId: selectedChat._id,
                sender: user._id,
                text: message,
                image: image
            }
            console.log('Sending message via socket:', newMessage);
            socket.emit('send-message', {
                ...newMessage,
                members: selectedChat.members.map(member => member._id),
                read: false,
                createdAt: new Date()
            })
            const response = await createNewMessage(newMessage)
                
            if(response.success){
                setMessage('')
                setShowEmojiPicker(false)
            }
        } catch (error) {
            enqueueSnackbar( error.message ,
                {
                    variant : "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                }
            )
        }
    }

    const getAllMessages = async () => {
        try {
            const response = await fetchAllMessages(selectedChat._id)
            if(response.success){
                setAllMessages(response.data)
            }
        } catch (error) {
            enqueueSnackbar( error.message ,
                {
                    variant : "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                }
            )
        }
    }

    const callClearUnreadMessages = async () => {
        try {
            socket.emit('clear-unread', {
                chatId: selectedChat._id,
                members: selectedChat.members.map(m => m._id)
            })
            const response = await clearUnreadMessages(selectedChat._id)

            if(response.success){
                allChats.map(chat => {
                    if(chat._id === selectedChat._id){
                        return response.data
                    }
                    return chat
                })
            }
        } catch (error) {
            return error
        }
    }

    const sendImageInChat = async (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            sendMessage(reader.result)
        }
    }

    useEffect(()=>{
        getAllMessages()
        if(selectedChat?.lastMessage?.sender !== user._id){
            callClearUnreadMessages()
        }

        socket.off('recieved-message').on('recieved-message', (message) => {
            console.log('New message received via socket:(recieve-message)', message);
            const selectedChat = store.getState().userReducer.selectedChat
            if(selectedChat._id === message.chatId){
               setAllMessages(prevmsgs => [...prevmsgs, message])
            }

            if(selectedChat._id === message.chatId && message.sender !== user._id){
                callClearUnreadMessages()
            }
        })

        socket.on('cleared-unread-messages', (data) => {
            const selectedChat = store.getState().userReducer.selectedChat
            const allChats = store.getState().userReducer.allChats

            if(selectedChat._id === data.chatId){
                const updatedChats = allChats.map(chat => {
                    if(chat._id === data.chatId){
                        return {...chat, unreadMessageCount: 0}
                    }
                    return chat;
                })
                dispatch(setAllChats(updatedChats));
                setAllMessages(prevmsgs => {
                    return prevmsgs.map(msg => {
                        return {...msg, read: true}
                    })
                })
            }
        })

        socket.on('started-typing', (data) => {
            setData(data)
            if(selectedChat._id === data.chatId 
                && data.sender !== user._id){
                    setIsTyping(true)
                    setTimeout(()=>{
                        setIsTyping(false)
                    }, 2000)
                }
        })
    }, [selectedChat])  

    useEffect(()=>{
        const msgContainer = document.getElementById('chat');
        msgContainer.scrollTop = msgContainer.scrollHeight
    }, [allMessages, isTyping])

    return ( 
        <div className="chat-container">
                <div className="chat-head">
                    <div className={
                    onlineUsers?.includes(selectedUser._id) ? 'avatar-chat avatar-online' : 'avatar-chat'
                }>
                        {selectedUser?.pfp && <img  className='avatar-chat'
                            src="" alt="" />}
                            {!selectedUser?.pfp && <img className='avatar-chat'
                            src={`https://robohash.org/${selectedUser._id}`} alt="" />}
                    </div>
                    <div className="name-chat">
                        <strong className='text-2xl text-white'>
                            {selectedChat && selectedUser.firstName+' '+selectedUser.lastName}
                        </strong>
                        {onlineUsers.includes(selectedUser._id) ? 
                        <p className='text-green-500'>Online</p>:<p className='text-neutral-700'>Offline</p>}
                    </div>
                </div>
                <div className="chat-body" id='chat'>
                    {/* <div className="dark-overlay">

                    </div> */}
                    <div className="chat-box">
                        {allMessages.map(msg => {
                            const isCurrentUserSender = msg.sender === user._id
                            const messageDate = new Date(msg.createdAt)

                            const options = {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            };

                            const formattedDate = messageDate.toLocaleString('en-US', options);
                        return (
                            <div className='message-container flex gap-2'
                            style={isCurrentUserSender ? {justifyContent: 'end'} : {justifyContent: 'start'}}>
                                    <div className=
                            {isCurrentUserSender ? "sent-message" : "incoming-message"}>
                                    <div className=
                                    {isCurrentUserSender ? "sent-text" : "incoming-text"}>
                                        <p>{msg.text}</p>
                                        <div>{msg.image && <img className='p-1' src={msg.image} alt='sent-image' height='200' width='200'></img>}</div>
                                        <div className='flex justify-between gap-1 items-center'>
                                            <span className='text-xs text-gray-500'>{formattedDate}</span>
                                            <span>{isCurrentUserSender && msg.read && <CheckCheck color='#6b7280' size={16}/>}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        })}
                        {isTyping && selectedChat?.members.map(m => m._id).includes(data?.sender) && <p className='typing'><i className='text-sm text-white'>Typing...</i></p>}
                    </div>
                </div>
                <div className="chat-foot">
                <div className="emoji-picker">
                                {showEmojiPicker && 
                                    <EmojiPicker lazyLoadEmojis = {true}
                                    theme='dark'
                                    onEmojiClick={(e) => 
                                        setMessage(message + e.emoji)
                                    } />
                                }
                            </div>
                    <div className="create-message">
                        <div className='cm-left'>
                            <span className='emoji-btn'
                                onClick={() =>{
                                    setShowEmojiPicker(!showEmojiPicker)
                                }}
                            >
                                <SmilePlus />
                            </span>
                            <input type="text" id="input-message" 
                            placeholder='Write a message...'
                            value={message}
                            onChange={(e)=> {setMessage(e.target.value)
                                socket.emit('user-typing', {
                                    chatId: selectedChat._id,
                                    members: selectedChat.members.map(m => m._id),
                                    sender: user._id
                                })
                            }}/>
                        </div>
                        <div className='cm-right'>
                            <span className='message-btns'>
                                <label htmlFor="send-img">
                                    <ImagePlus />
                                    <input type="file" 
                                        id='send-img'
                                        style={{display: 'none'}}
                                        accept='image/jpg, image/png, image/jpeg, image/gif'
                                        onChange={sendImageInChat}
                                    />
                                </label>
                            </span>
                            <button 
                            className='message-btns rounded-r-lg'
                            onClick={()=>{sendMessage('')}}
                            >
                                <Send />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
     );
}
 
export default ChatContainer;