import { UserRoundPlus, UserRoundCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { startNewChat } from '../../../apiCalls/chat';
import { setAllChats, setSelectedChat } from '../../../redux/userSlice';

const SearchedUserList = ({searchVal}) => {
    const { allUsers, allChats, user: currentUser } = useSelector(state => state.userReducer);
    const { enqueueSnackbar } = useSnackbar()
    const dispatch = useDispatch()

    const createNewChat = async (searchedUserId) => {
        let response = null
        try {
            response = await startNewChat([currentUser._id, searchedUserId])
            if(response.success){
                enqueueSnackbar( response.message,
                    {
                        variant : "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    }
                )
                const newChat = response.data
                const updatedChats = [...allChats, newChat]
                dispatch(setAllChats(updatedChats))
                dispatch(setSelectedChat(newChat))
                searchVal = ''
            }
        } catch (error) {
            enqueueSnackbar( response.message,
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

    const openChat = (selectedUserId) => {
        const chat = allChats.find(chat => 
            chat.members.map(m => m._id).includes(currentUser._id ) &&
            chat.members.map(m => m._id).includes(selectedUserId))
        
        if(chat){
            dispatch(setSelectedChat(chat))
        }
    }

    return (
        <>
            {allUsers.filter(user => {
                return (
                user.firstName.toLowerCase().includes(searchVal.toLowerCase())||
                user.lastName.toLowerCase().includes(searchVal.toLowerCase())
                )
            }).map((user, index) => (
                <div
                    key={user._id}
                    className="searched-user-container"
                    style={{ top: `${index * 7}vh` }}
                >
                    <div className="searched-user-avatar-div">
                        <div>
                        {user?.pfp && <img  className='searched-user-avatar'
                            src="" alt="" />}
                        {!user?.pfp && <img className='searched-user-avatar'
                            src={`https://robohash.org/${user._id}`} alt="" />}
                        </div>
                    </div>
                    <div className="searched-user-name">
                        <strong className="text-lg">{user.firstName} {user.lastName}</strong>
                        <p className="text-sm">{user.email}</p>
                    </div>
                    {!allChats.find(chat => chat.members.map(m => m._id).includes(user._id)) &&
                    <div className="start-chat-btn">
                        <button onClick={() => createNewChat(user._id)}>
                            <UserRoundPlus />
                        </button>
                    </div>}
                    {allChats.find(chat => chat.members.map(m => m._id).includes(user._id)) &&
                    <div className="start-chat-btn">
                        <span>
                            <UserRoundCheck color='#22c55e'/>
                        </span>
                    </div>}
                </div>
            ))}
        </>
    );
};



 
export default SearchedUserList;