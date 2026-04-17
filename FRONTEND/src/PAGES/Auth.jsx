import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparklesOutline } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setuserdata } from '../REDUX/userSlice';
import { useState } from 'react';

const Auth = () => {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const response = await signInWithPopup(auth, provider);
      let User = response.user;
      let name = User.displayName
      let email = User.email
      const result = await axios.post(ServerUrl + "/api/auth/google", { name, email }, { withCredentials: true })

      localStorage.setItem("user", JSON.stringify(result.data.User))
      // dispatch(setuserdata({
      //   name: result.data.User.name,
      //   email: result.data.User.email,
      //   credits: result.data.User.credits
      // }))
      // localStorage.setItem("isLoggedIn", true)
      alert(result.data.message)
      navigate("/")
    }
    catch (err) {
      console.log(err.response)
      // dispatch(setuserdata(null))
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'>
      <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        className='w-full max-w-md p-6 rounded-3xl bg-white shadow-2xl border border-gray-200 '>

        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='bg-black text-white p-2 rounded-lg'>
            <BsRobot size={18} />
          </div>
          <h2 className='font-semibold text-lg'>InterviewIQ.Ai</h2>
        </div>

        <h2 className='text-xl md:text-2xl font-semibold text-center leading-snug mb-4'>
          Continue with
          <br />
          <span className='bg-green-100 text-green-500 px-5 py-1 rounded-full inline-flex items-center gap-2'><IoSparklesOutline size={16} />
            AI Smart Interview
          </span>
        </h2>

        <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
          Sign In to start AI-powered mock interviews, track your progress, and unlock detailed perfomance insights.
        </p>

        <motion.button onClick={handleGoogleAuth}
          disabled={loading}
          className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </motion.button>

      </motion.div>
    </div>
  )
}

export default Auth
