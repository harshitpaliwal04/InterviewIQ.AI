import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useEffect, useState } from 'react';

const Navbar = () => {
        const navigate = useNavigate()
        const [credits, setCredits] = useState(0)
        const handleLogout = async () => {
                try {
                        const response = await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true })
                        localStorage.removeItem("user");
                        navigate("/auth");
                        alert(response?.data?.message)
                }
                catch (err) {
                        console.log(err?.response?.data?.message)
                }
        }
        
        const handleBuyCredits = async () => {
                navigate("/pricing")
        }

        useEffect(()=>{
                async function get_updated_credits(){
                        const response = await axios.get(ServerUrl + "/api/payment/credits", {withCredentials: true});
                        let new_credits = response?.data?.credits
                        setCredits(new_credits)
                }
                get_updated_credits();
        },[handleBuyCredits])

        const handleInterviewHistory = () => {
                navigate("/interview-history")
        }

        const userData = JSON.parse(localStorage.getItem("user"));
        return (
                <div className='bg-[#f3f3f3] flex justify-center px-4 pt-6 w-full'>
                        <motion.div initial={{ opacity: 0, y: -250 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-4 py-4 flex justify-between items-center relative'>
                                <div className='flex items-center gap-3 cursor-pointer'>
                                        <div className='bg-black text-white p-2 rounded-lg'>
                                                <BsRobot size={18} />
                                        </div>
                                        <h2 className='font-semibold hidden md:block'>InterviewIQ.Ai</h2>
                                </div>

                                <div className='flex items-center gap-5 relative'>
                                        <button onClick={handleBuyCredits} className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:text-green-500 transition-colors duration-200'>
                                                <BsCoin size={18} />
                                                <span className='font-semibold'>{credits}</span>
                                        </button>

                                        <button onClick={handleInterviewHistory} className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:text-blue-500 transition-colors duration-200'>
                                                <FaUserAstronaut size={18} />
                                                <span className='hidden md:block font-semibold'>{userData ? userData?.name.split(" ")[0] : "User"}</span>
                                        </button>

                                        <button onClick={handleLogout} className='hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:text-red-500 transition-colors duration-200'>
                                                <HiOutlineLogout size={18} />
                                                <span className='font-semibold'>Logout</span>
                                        </button>
                                </div>

                        </motion.div>

                </div>
        )
}

export default Navbar