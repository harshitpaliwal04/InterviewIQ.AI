import React from 'react'
import Navbar from '../COMPONENTS/Navbar'
import { useSelector } from 'react-redux'
import { motion, steps } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs"
import { HiSparkles } from 'react-icons/hi';
import { FaRegFileArchive } from "react-icons/fa";
import { RiVoiceAiFill } from "react-icons/ri";
import { IoTimerOutline } from "react-icons/io5";
import history from "../assets/history.png";
import skills from "../assets/resume.png";
import feedback from "../assets/pdf.png";
import Ai_eval from "../assets/ai-ans.png";
import credit from "../assets/credit.png";
import HR from "../assets/HR.png";
import MM from "../assets/MM.png";
import tech from "../assets/tech.png";
import confi from "../assets/confi.png";
import Footer from '../COMPONENTS/Footer';
import { TiArrowRightThick } from "react-icons/ti";

const Home = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const HandleStartIneterview = () => {
    if (userData?.credits === 0) {
      alert("Please Buy Credits to Start Interview");
      navigate("/pricing")
      return
    }
    else {
      navigate("/interview")
    }
  }

  return (
    <div className='min-h-screen bg-[#f3f3f3] flex flex-col justify-center items-center w-full'>
      <Navbar />

      <div className='flex-1 px-6 py-20 w-full'>

        <div className='text-center mb-28'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto'>
            <span>Practice Interviews with &nbsp;</span>
            <span className='relative inline-block'>
              <span className='text-green-600'>
                AI Intelligence
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-gray-500 mt-6 max-w-2xl mx-auto text-lg'>
            Role-based mock Interview with smart follow-ups, adaptive difficulty and instant feedback and real-time performance analytics to help you land your dream job.
          </motion.p>

          <div className='flex flex-wrap justify-center gap-4 mt-10'>
            <motion.button
              onClick={HandleStartIneterview}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className='flex items-center gap-2 bg-black text-white px-6 py-4 rounded-xl font-semibold hover:transition-colors duration-200 cursor-pointer'>
              <HiSparkles size={16} /> Start Interview <TiArrowRightThick size={18} />
            </motion.button>
          </div>
        </div>

        <div className='flex-1 justify-center items-center gap-10 mb-28 md:w-full'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='flex items-center justify-center flex-wrap gap-2 text-4xl font-semibold mb-10'><HiSparkles size={24} className='text-green-600' /> Why Us</motion.div>
          <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28 h-full'>
            {
              [
                {
                  icon: <BsMic size={24} />,
                  title: "Voice & Video",
                  description: "Real-time voice and text communication for natural conversations.",
                },
                {
                  icon: <BsClock size={24} />,
                  title: "Real-time Feedback",
                  description: "Instant feedback on your responses to improve your interview skills.",
                },
                {
                  icon: <BsBarChart size={24} />,
                  title: "Performance Analytics",
                  description: "Track your progress and get detailed insights in solid pdf format.",
                },
                {
                  icon: <BsFileEarmarkText size={24} />,
                  title: "AI Generated Questions",
                  description: "Get personalized interview questions based on your profile and experience.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3}}
                  whileHover={{ scale: 1.02 }}
                  className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full md:w-1/2 cursor-pointer hover:shadow-md transition-shadow duration-200'>
                  <div className='bg-green-100 text-green-600 p-3 rounded-lg mb-4 w-fit'>
                    {feature.icon}
                  </div>
                  <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
                  <p className='text-gray-500 text-sm'>{feature.description}</p>
                </motion.div>
              ))
            }
          </div>
        </div>

        <div className='flex-1 justify-center items-center gap-10 mb-28 md:w-full'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='flex items-center justify-center gap-2 text-4xl font-semibold mb-10'><HiSparkles size={24} className='text-green-600' /> How it works</motion.div>
          <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'>
            {
              [
                {
                  icon: <BsRobot size={24} />,
                  steps: "Step 1",
                  title: "Auto Role and Experience Selection",
                },
                {
                  icon: <RiVoiceAiFill size={24} />,
                  steps: "Step 2",
                  title: "Smart voice and written format",
                },
                {
                  icon: <IoTimerOutline size={24} />,
                  steps: "Step 3",
                  title: "Fix Time for real practice",
                },
                {
                  icon: <FaRegFileArchive size={24} />,
                  steps: "Step 4",
                  title: "Get instant Result and Feedback",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3}}
                  whileHover={{ scale: 1.02 }}
                  className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full md:w-90 cursor-pointer hover:shadow-md transition-shadow duration-200'>
                  <div className='bg-green-100 text-green-600 p-3 rounded-lg mb-4 w-fit'>
                    {feature.icon}
                  </div>
                  <h1 className='text-green-500 font-semibold'>{feature.steps}</h1>
                  <br />
                  <p className='text-gray-500 mb-2'>{feature.title}</p>
                </motion.div>
              ))
            }
          </div>
        </div>

        <div className='flex-0 justify-center items-center gap-10 mb-28 md:w-full'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='flex items-center justify-center gap-2 text-4xl font-semibold mb-10'><HiSparkles size={24} className='text-green-600' /> Features</motion.div>
          <div className='flex flex-wrap justify-center md:w-full items-center gap-10 mb-28'>
            {
              [
                {
                  img: skills,
                  title: "AI Answer Evaluation",
                  description: "Scores on communication, confidence, clarity, and more."
                },
                {
                  img: Ai_eval,
                  title: "Resume and Skill based",
                  description: "Project and Skills specific questions."
                },
                {
                  img: history,
                  title: "History & Analytics",
                  description: "Track Program and perfomance in terms of graph"
                },
                {
                  img: feedback,
                  title: "Download Report",
                  description: "Download your performance report"
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className='flex flex-warp gap-10 items-center justify-around bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full h-50 md:w-143.5
                cursor-pointer hover:shadow-md transition-shadow duration-200'>
                  <div className='w-48 h-48' >
                    <img src={feature.img} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className='flex flex-col gap-10'>
                    <p className='text-green-500 font-semibold mt-2'>{feature.title}</p>
                    <p className='text-gray-500 mb-2'>{feature.description}</p>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>

        <div className='flex-1 justify-center items-center gap-10 mb-28 md:w-full'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='flex items-center justify-center gap-2 text-4xl font-semibold mb-10'><HiSparkles size={24} className='text-green-600' /> Interview Categories</motion.div>
          <div className='flex flex-wrap justify-center md:flex-row items-center gap-10 mb-28'>
            {
              [
                {
                  img: tech,
                  title: "AI Answer Evaluation",
                  description: "Scores on communication, confidence, clarity, and more."
                },
                {
                  img: HR,
                  title: "Resume and Skill based",
                  description: "Project and Skills specific questions."
                },
                {
                  img: MM,
                  title: "History & Analytics",
                  description: "Track Program and perfomance in terms of graph"
                },
                {
                  img: confi,
                  title: "Download Report",
                  description: "Download your performance report"
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3}}
                  whileHover={{ scale: 1.05 }}
                  className='flex flex-warp gap-10 items-center justify-around bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full h-50 md:w-143.5
                cursor-pointer hover:shadow-md transition-shadow duration-200'>
                  <div className='w-55 h-55' >
                    <img src={feature.img} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className='flex flex-col gap-10 w-100'>
                    <p className='text-green-500 font-semibold mt-2'>{feature.title}</p>
                    <p className='text-gray-500 mb-2'>{feature.description}</p>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default Home
