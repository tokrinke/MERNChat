import '../../styles/settings.css'
import { useDispatch, useSelector } from 'react-redux'
import { ImageUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadPfp } from '../../apiCalls/users';
import { useSnackbar } from 'notistack';
import { setUser } from '../../redux/userSlice'


const Settings = () => {
    const { user } = useSelector(state => state.userReducer)
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [image, setImage] = useState('')

    useEffect(()=>{
        if(user?.profilePic){
            setImage(user.profilePic)
        }
    }, [user])

    const onFileAdded = async (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            setImage(reader.result)
        }
    }
   
    const callUploadPfp = async () => {
        try {
            const response = await uploadPfp(image)
            if(response.success){
                enqueueSnackbar("Profile picture changed successfully",
                    {
                        variant : "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    }
                )
                dispatch(setUser(response.data))
            }else{
                enqueueSnackbar("error",
                    {
                        variant : "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    }
                )
            }
        } catch (error) {
            enqueueSnackbar(`Errori: ${error.message}`,
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

    
    return (
    
        <div className="settings-container">
            <div className="settings-menu">
                <div className="s-menu-left">
                    <div className="profile-picture">
                    {user.pfp ? (
                        <img id="pfp" src={user.pfp} alt="Profile" />
                    ) : (
                        <img id="pfp" src={`https://robohash.org/${user._id}`} alt="Placeholder" />
                    )}
                    </div>
                    <div className="sml-bot">
                        <div className="upload-div">
                            <ImageUp />
                            <input type="file" onChange={onFileAdded}/>
                            <button className='upload-pfp-btn' onClick={()=>{callUploadPfp()}}>Upload</button>
                        </div>
                    </div>
                </div>
                <div className="s-menu-right">
                       <div className="splitter">
                            <h2 className='text-center font-bold text-5xl text-pink-700
                                border-b border-neutral-800
                            '>Account Details</h2>
                       </div>
                        <div className='details'>
                            <h1 className='font-bold text-4xl text-white'>
                                {user.firstName+' '+user.lastName}
                            </h1>
                            <div className="div">
                            Email address:
                                <p className='text-white font-semibold text-xl'>
                                    {user.email}
                                </p>
                            </div>
                            <div className="div">
                                Account creation date:
                                <p className='text-white'>
                                    {user.createdAt}
                                </p>
                            </div>
                        </div>
                        <div className='to-home' onClick={()=>{navigate('/')}}>
                            <p  className='text-pink-700 text-2xl
                                    font-bold'>
                                BACK TO HOMEPAGE
                            </p>
                        </div>
                </div>
            </div>
        </div>
    );
}
 
export default Settings;