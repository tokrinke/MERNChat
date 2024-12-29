import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getLoggedInUser } from "../apiCalls/users";
import { useSelector, useDispatch} from 'react-redux'
import { useSnackbar } from 'notistack';
import { setUser, setAllUsers, setAllChats } from "../redux/userSlice";
import { getAllChats } from "../apiCalls/chat";

const ProtectedRoute = ({children}) => {
    const { user } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    const getLoggedInUserDetails = async () => {
        let response = null
        try {
            response = await getLoggedInUser(); 
            if(response.success){
                dispatch(setUser(response.data))
            }else{
                enqueueSnackbar( response.message,
                    {
                        variant : "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    }
                )
                navigate('/login')
            }
        } catch (error) {
            navigate('/login')
        }
    }

    const getAllUsersDetails = async () => {
        let response = null
        try {
            response = await getAllUsers(); 
            if(response.success){
                dispatch(setAllUsers(response.data))
            }else{
                enqueueSnackbar( response.message,
                    {
                        variant : "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    }
                )
                navigate('/login')
            }
        } catch (error) {
            navigate('/login')
        }
    }

    const getCurrentUsersChats = async () => {
        try {
            const response = await getAllChats()
            if(response.success){
                dispatch(setAllChats(response.data))
            }else{

            }
        } catch (error) {
            navigate('/login')
        }
    }

    useEffect(()=>{
        if(localStorage.getItem('token')){
            getLoggedInUserDetails()
            getAllUsersDetails()
            getCurrentUsersChats()
        }else{
            navigate('/login')
        }
    }, []);

    return (
        <div>
            {children}
        </div>)
}
 
export default ProtectedRoute;