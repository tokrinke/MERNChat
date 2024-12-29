import '../../styles/home.css'
import '../../styles/chat.css'
import '../../styles/chatPlaceholder.css'
import '../../styles/searchedUserList.css'
import { UserRoundCog, LogOut, Dot, 
    UserRoundSearch, MessagesSquare,
    SmilePlus, Send, Paperclip
} from 'lucide-react';
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import SearchedUserList from './components/searchedUserList';
import StartedChats from './components/startedChats';
import ChatContainer from './components/chatCont';
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom';


const socket = io('http://localhost:4000')

const Home = () => {
    const { user, allChats, selectedChat } = useSelector(state => state.userReducer)
    const [searchVal, setSearchVal] = useState('')
    const [allMessages, setAllMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        if(user){
            socket.emit('join-room', user._id)
            socket.emit('user-is-online', user._id)
            socket.on('online-users', onlineUsers => {
                setOnlineUsers(onlineUsers)
            })
            socket.on('online-users-updated', onlineUsers => {
                setOnlineUsers(onlineUsers)
            })
        }
    }, [user])
    
    const logUserOut = () => {
        localStorage.removeItem('token');
        navigate('/login')
        socket.emit('user-logout', user._id)
    }
   
    return (
        <div className="home-container">
            <div className="sidebar">
                <div className="sidebar-top">
                    <div className="user-details">
                        <div className='avatar'>
                            {user?.pfp && <img  className='avatar'
                        src={user.pfp} alt="" />}
                            {!user?.pfp && <img className='avatar'
                        src={`https://robohash.org/${user?._id}`} alt="" />}
                        </div>
                        <div className="name-lastname py-2">
                            <strong className='text-2xl text-white'>{user?.firstName+' '+user?.lastName}</strong>
                            <p className='text-green-500 flex'>
                                <Dot size={21} />Online</p>
                        </div>
                    </div>
                    <div className="sidebar-top-right">
                        <div className="user-settings-btn btns">
                            <button onClick={()=>{navigate('/settings')}}><UserRoundCog /></button>
                        </div>
                        <div className="log-out-btn btns">
                            <button onClick={logUserOut}><LogOut /></button>
                        </div>
                    </div>
                </div>
                <div className="sidebar-body">
                    <div className="sidebar-body-head">
                        <span className='user-search-btn'>
                            <UserRoundSearch/>
                        </span>
                        <div className="search-div">
                            <input type="search" 
                            id='search-users'
                            placeholder='Search users...'
                            value={searchVal}
                            onChange={(e)=>setSearchVal(e.target.value)}
                            />
                        </div>
                    </div>
                        <div className="searchedUserListRelative">
                            {searchVal && <SearchedUserList searchVal={searchVal} />}
                        </div>
                    <div className="chat-list-box">
                        <div className="clb-title">
                            <h2>Messages</h2>
                            <MessagesSquare color='#be185d' />
                        </div>
                        <div className="chat-list">
                            <div className='flex justify-center items-center text-neutral-600'>
                                {!allChats.find(chat => chat.members.map(m => m._id).includes(user._id)) && 
                                <strong>Your chats will be shown here.</strong>
                                }
                            </div>
                            {allChats.find(chat => chat.members.map(m => m._id).includes(user._id)) && 
                                <StartedChats socket={socket} onlineUsers={onlineUsers} />
                            }
                        </div>
                        <div className="clb-foot">
                        </div>
                    </div>
                </div>
            </div>
            {/* {!selectedChat && } */}
            {selectedChat ? 
            <ChatContainer 
            onlineUsers={onlineUsers} 
            socket={socket} 
            allMessages={allMessages} 
            setAllMessages={setAllMessages}/>:
            (<div className="chat-placeholder">
                <div className='chat-background-img'><img src="../images/bg-for-chat-png" alt="" /></div>
                <h2 className='text-pink-700 text-2xl font-bold'>Select a chat to start chatting!</h2>
            </div>)
            }
        </div>  
     );
}
 
export default Home;