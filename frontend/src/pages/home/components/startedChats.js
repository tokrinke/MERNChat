import '../../../styles/startedChat.css'
import { useDispatch, useSelector } from 'react-redux';
import { setAllChats, setSelectedChat } from '../../../redux/userSlice';
import { useEffect } from 'react';
import  store  from '../../../redux/store'

const StartedChats = ({socket, onlineUsers}) => {
    const { allUsers, allChats, user: currentUser, selectedChat} = useSelector(state => state.userReducer);
    const dispatch = useDispatch()

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        const strMinutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${strMinutes} ${ampm}`;
    };

    const openChat = (selectedUserId) => {
            const chat = allChats.find(chat => 
                chat.members.map(m => m._id).includes(currentUser._id ) &&
                chat.members.map(m => m._id).includes(selectedUserId))
            
            if(chat){
                dispatch(setSelectedChat(chat))
            }
        }

    const isChatSelected = (user) => {
        if(selectedChat){
           return selectedChat.members.map(m => m._id).includes(user._id)
        }
        return false
    }

    const getLastMessage = (userId) => {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId))
        const prefix = chat?.lastMessage?.sender === currentUser._id ? "You: " : "";
        if(!chat || !chat.lastMessage){
            return ''
        }else{
            return prefix + chat?.lastMessage?.text?.substring(0, 30)
        }
    }

    const getUnreadMsgCount = (userId) => {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId))

        if(chat && chat.unreadMessageCount && chat.lastMessage.sender !== currentUser._id){
            return <div className="unread-msg-count">{chat.unreadMessageCount}</div>
        }else{
            return ''
        }
    }
    

    useEffect(() => {
        socket.off('set-message-count').on('set-message-count', (message) => {
            const selectedChat = store.getState().userReducer.selectedChat
            let allChats = store.getState().userReducer.allChats

            if(selectedChat?._id !== message.chatId){
                const updatedChats = allChats.map(chat => {
                    if(chat._id === message.chatId){
                        return {
                            ...chat,
                            unreadMessageCount: (chat?.unreadMessageCount || 0 ) + 1,
                            lastMessage: message
                        }
                    }
                    return chat;
                })
                allChats = updatedChats; 
            }
            console.log("Message received: startedChatJs", message);
            const latestChat = allChats.find(chat => 
                chat._id === message.chatId
            )
            console.log(latestChat)
            const otherChats = allChats.filter(chat => 
                chat._id !== message.chatId
            )
            console.log(otherChats)
            allChats = [latestChat, ...otherChats]
            console.log(allChats)
            dispatch(setAllChats(allChats))
        })          
    }, [])


    return ( 
        allUsers.filter(user => {
          return  (allChats.some(chat => chat.members.map(m => m._id).includes(user._id))) 
        }).map(user => {
            const activeChats = allChats.find(chat => chat.members.map(m => m._id).includes(user._id));
            return { user, activeChats };
        }).sort((a, b) => {
            return new Date(b.activeChats.updatedAt) - new Date(a.activeChats.updatedAt);
        }).map(({ user, activeChats }) => {
            const lastMessageTime = formatTime(activeChats.updatedAt);
            
            return <div 
            className=
            {!isChatSelected(user) ? "started-chat-container" : "started-chat-container selected-chat-active"}  
            onClick={()=>openChat(user._id)}
            >
            <div className="started-chat-avatar-cont">
                <div className={
                    onlineUsers.includes(user._id) ? 'started-chat-avatar avatar-online' : 'started-chat-avatar'
                }>
                    {user?.pfp && <img  className='started-chat-avatar'
                        src="" alt="" />}
                    {!user?.pfp && <img className='started-chat-avatar'
                        src={`https://robohash.org/${user._id}`} alt="" />}
                </div>
            </div>
            <div className="sc-details">
                <div className="sc-name-date">
                    <div className="started-chat-name">
                        <strong>{user.firstName+' '+user.lastName}</strong>
                    </div>
                    <div className="message-received-time">
                        <span>{lastMessageTime}</span>
                    </div>
                </div>  
                <div className="last-message">
                    <p>{getLastMessage(user._id).length 
                        <=30 
                    ? getLastMessage(user._id) : getLastMessage(user._id).substring(0, 30) + '...'}</p>
                </div>
            </div>
                {getUnreadMsgCount(user._id)}
                <span>{getUnreadMsgCount(user._id)}</span>
        </div>
        })
     );
}
 
export default StartedChats;