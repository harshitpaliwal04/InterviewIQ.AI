import React from 'react'
import { BsRobot } from 'react-icons/bs'
import { motion } from 'motion/react'

const Footer = () => {
        return (
                <div className='flex justify-center pb-3 pt-3 w-full px-2'>
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white w-full max-w-6xl rounded-2xl shadow-sm border border-gray-200 py-2 px-3 text-center">
                                <div className='flex items-center justify-center gap-5 py-2 px-2'>
                                        <BsRobot size={20} className='text-green-600' />
                                        <span className='text-gray-500 text-base'>© 2026 InterviewIQ.Ai. All rights reserved.</span>
                                </div>
                        </motion.div>
                </div>
        )
}

export default Footer