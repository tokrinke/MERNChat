import '../../../src/styles/login.css'
import { MessagesSquare } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { logUserIn } from '../../apiCalls/auth';
import { useSnackbar } from 'notistack';


const LogIn = () => {
    const { enqueueSnackbar } = useSnackbar()
    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const handleSubmit = async (e) => {
        e.preventDefault()
        let response = null
        try {
            response = await logUserIn(user)
            if(response.success){
                enqueueSnackbar("User logged in successfully!",
                    {
                        variant : "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    }
                )
                localStorage.setItem('token', response.token)
                window.location.href = "/"
            }else{
                enqueueSnackbar( "Incorrect Email/Password" ,
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
            alert(error.message)
        }
    }
    return ( 
        <div className="bg-auth">
            <div className="auth-container">
                <div className="auth-box">
                    <div className="form-head">
                        <div className='fh-top'>
                            <MessagesSquare color='#be185d' size={80} />
                        </div>
                        <div className='fh-bot'>
                            <strong className='text-white text-3xl'>Sign in</strong>
                            <p className='text-neutral-400 text-base font-semibold'>Welcome back! Please sign in to continue</p>
                        </div>
                    </div>
                    <div className="form-body">
                        <form className='form' onSubmit={handleSubmit}>
                            <div className='input-line'>
                                <label for='email'>Email</label>
                                <input className='input' type="email" 
                                id='email'
                                value={user.email}
                                onChange={(e)=>{setUser({...user, email: e.target.value})}} />
                            </div>
                            <div className='input-line'>
                                <label for='password'>Password</label>
                                <input className='input' type="password" 
                                id='password' 
                                value={user.password}
                                onChange={(e)=>{setUser({...user, password: e.target.value})}}/>
                            </div>
                            <br />
                            <br />
                            <button className='signup-btn'><Link>Log In</Link></button>
                        </form>
                    </div>
                </div>
                <div className="auth-foot">
                    <p className='text-neutral-400 text-lg font-semibold'>Don't have an account? <Link to="/signup" className='text-pink-700 hover:underline'>Sign up</Link> </p>
                </div>
            </div>
        </div>
     );
}
 
export default LogIn;