import React, { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
    const navigate = useNavigate()

    // if user auth is true then have to remove the login and add logout and verify email option
    const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContent)

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true

            const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

            if(data.success){ // email is success fully sent now we have to navigate to email varification page where user gave the input
                navigate('/email-verify')
                toast.success(data.message)
            } else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error)
        }
    }

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true // cookies

            const {data} = await axios.post(backendUrl + '/api/auth/logout')

            // if data.success true the call && ...
            data.success && setIsLoggedin(false) 
            data.success && setUserData(false)
            navigate('/')

        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 '>
        <img 
            src={assets.logo} 
            alt="nav-logo" 
            className=' w-28 sm:w-32'/>
        { userData ? 
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'
            >{userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                    {/* if user verified then hide the verify email */}
                {!userData.isAccountVerified && 
                <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 curPnt'>Verify Email</li>
                }
                
                <li onClick={logout} className='pr-10 py-1 px-2 hover:bg-gray-200 curPnt'>Logout</li>
            </ul>
            </div>
        </div>

        : <button onClick={() => navigate('/login')}
        className='curPnt flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} alt="" />
        </button>
        }
        
    </div>
  )
}

export default Navbar