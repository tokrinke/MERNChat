import '../../styles/signup.css'
import { MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { signUpUser } from '../../apiCalls/auth';
import { useSnackbar } from 'notistack';

const SignUp = () => {
    const { enqueueSnackbar } = useSnackbar()
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        let response = null
        try {
            response = await signUpUser(user);
            if(response.success){
                enqueueSnackbar("User created successfully!",
                    {
                        variant : "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    }
                )
            }else{
                enqueueSnackbar( "User already exists." ,
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
            alert(response.message)
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
                            <strong className='text-white text-3xl'>Create your account</strong>
                            <p className='text-neutral-400 text-base font-semibold'>Welcome! Please fill in the details to get started.</p>
                        </div>
                    </div>
                    <div className="form-body">
                        <form className='form' onSubmit={handleSubmit}>
                            <div className='input-line'>
                                <label for='first-name'>First name</label>
                                <input className='input' type="text"
                                id='first-name'
                                value={user.firstName}
                                onChange={(e)=>{setUser({...user, firstName: e.target.value})}} />
                            </div>
                            <div className='input-line'>
                                <label for='last-name'>Last name</label>
                                <input className='input' type="text" 
                                id='last-name' 
                                value={user.lastName}
                                onChange={(e)=>{setUser({...user, lastName: e.target.value})}}/>
                            </div>
                            <div className='input-line'>
                                <label for='email'>Email</label>
                                <input className='input' type="email" 
                                id='email' 
                                value={user.email}
                                onChange={(e)=>{setUser({...user, email: e.target.value})}}/>
                            </div>
                            <div className='input-line'>
                                <label for='password'>Password</label>
                                <input className='input' type="password" 
                                id='password' 
                                value={user.password}
                                onChange={(e)=>{setUser({...user, password: e.target.value})}}/>
                            </div>
                            <br />
                            <button className='signup-btn'><Link>Sign Up</Link></button>
                        </form>
                    </div>
                </div>
                <div className="auth-foot">
                    <p className='text-neutral-400 text-lg font-semibold'>Already have an account? <Link to="/login" className='text-pink-700 hover:underline'>Log in</Link> </p>
                </div>
            </div>
        </div>
     );
}
 
export default SignUp;