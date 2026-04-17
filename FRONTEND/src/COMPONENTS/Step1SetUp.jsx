import React from 'react'
import { motion } from 'motion/react'
import {
  FaUserTie,
  FaBriefcase,
  FaGraduationCap,
  FaStar,
  FaFileUpload,
  FaRobot,
  FaChartLine,
  FaCheckCircle,
  FaMicrophoneAlt,
  FaTrash,
  FaTimes
} from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi';
import { useState } from 'react'
import { ServerUrl } from "./../App"
import axios from 'axios';

const Step1SetUp = ({ onStart }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedMode, setSelectedMode] = useState("Technical");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  const [resume, setResume] = useState(null);
  const [resumeData, setResumeData] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleRemoveSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  }

  const handleRemoveProject = (index) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  }

  const handleAnalyze = async () => {
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const response = await axios.post(`${ServerUrl}/api/interview/analyze-resume`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Full response:", response.data)

      const analysisData = response.data.data;

      setResumeData(response.data);
      setSelectedRole(analysisData?.role || "");
      setSelectedExperience(analysisData?.experience || 0);
      setProjects(analysisData?.projects || []);
      setSkills(analysisData?.skills || []);

      setAnalyzed(true);
      setResume(null)

    } catch (error) {
      console.error("Analysis error:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
        alert(error.response.data.message || "Analysis failed");
      } else if (error.request) {
        console.error("No response from server");
        alert("Cannot connect to server. Please check if backend is running.");
      } else {
        console.error("Request error:", error.message);
        alert("Error: " + error.message);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handlestart = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${ServerUrl}/api/interview/generate-question`, {
        role: selectedRole,
        experience: selectedExperience,
        mode: selectedMode,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Full response:", response.data)

      const userData = JSON.parse(localStorage.getItem("user"));

      if (userData) {
        localStorage.setItem("user", JSON.stringify({
          ...userData, credits: response.data.credits
        }));
      }

      const analysisData = response.data.data;

      setResumeData(response.data);
      setSelectedRole(analysisData?.role || "");
      setSelectedExperience(analysisData?.experience || 0);
      setProjects(analysisData?.projects || []);
      setSkills(analysisData?.skills || []);

      setAnalyzed(true);
      setResume(null)
      onStart(response.data);

    } catch (error) {
      console.error("Analysis error:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
        alert(error.response.data.message || "Analysis failed");
      } else if (error.request) {
        console.error("No response from server");
        alert("Cannot connect to server. Please check if backend is running.");
      } else {
        console.error("Request error:", error.message);
        alert("Error: " + error.message);
      }
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 bg-red-900'>
      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden'>
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className='realtive bg-gradient-to-br form-green-50 to-green-100 p-12 flex flex-col justify-center'>

          <h2 className='text-4xl font-bold text-gray-800 mb-6'>
            Welcome to <span className='text-green-600'>InterviewIQ</span>
          </h2>
          <p className='text-gray-600 mb-10'>
            Your AI-powered interview <span className='text-green-600'>preparation platform</span>
          </p>

          <div className='space-y-6'>
            {
              [
                {
                  icon: FaUserTie,
                  title: "Choose Role & Expereince",
                },
                {
                  icon: FaMicrophoneAlt,
                  title: "Smart Voice Interview",
                },
                {
                  icon: FaChartLine,
                  title: "Performance Analytics",

                },
              ].map((feature, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className='flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow' key={index}>
                  <div className='bg-white p-3 rounded-xl shadow-md'>
                    <feature.icon className='text-2xl text-green-600' />
                  </div>
                  <div className=''>
                    <h3 className='font-semibold text-gray-600'>{feature.title}</h3>
                  </div>
                </motion.div>
              ))
            }
          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className='p-12 bg-white md:p-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>
            Set Up Your Interview
          </h2>
          <div className='space-y-6'>
            <div className='relative'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Job Role
              </label>
              <input
                type='text'
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                placeholder='e.g. Senior Software Engineer'
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Years of Experience
              </label>
              <input
                type='text'
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                placeholder='e.g. 5 years'
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Interview Mode
              </label>
              <div className='grid grid-cols-2 gap-4'>
                {['Technical', 'Behavioral'].map((mode) => (
                  <motion.button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`cursor-pointer px-4 py-3 rounded-xl font-semibold transition-all ${selectedMode === mode
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {mode}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className='w-full mt-2 mb-2'>
              {
                skills.length > 0 && (
                  <>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Skills
                    </label>
                  </>
                )
              }
              <div className='flex flex-wrap gap-2 mt-2'>
                {Array.isArray(skills) ? skills?.map((skill, index) => (
                  <span key={index} className='px-2 py-1 bg-green-100 text-green-600 rounded-lg flex items-center'>
                    {skill}
                    <span className='ml-2 cursor-pointer text-green-600 hover:text-red-600' onClick={() => handleRemoveSkill(index)}><FaTimes /></span>
                  </span>
                )) : null}
              </div>
            </div>

            <div className='w-full mt-2 mb-2'>
              {
                projects.length > 0 && (
                  <>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Projects
                    </label>
                  </>
                )
              }
              <div className='flex flex-wrap gap-2 mt-2'>
                {Array.isArray(projects) ? projects?.map((project, index) => (
                  <span key={index} className='px-2 py-1 bg-green-100 text-green-600 rounded-lg flex items-center'>
                    {project}
                    <span className='ml-2 cursor-pointer text-green-600 hover:text-red-600' onClick={() => handleRemoveProject(index)}><FaTimes /></span>
                  </span>
                )) : null}
              </div>
            </div>

            {
              !analyzed && (
                <motion.div
                  onClick={() => document.getElementById("resumeUpload").click()}
                  className='cursor-pointer w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all'>
                  <div className='flex items-center space-x-2'>
                    <FaFileUpload className='text-2xl mx-auto text-green-600' />
                  </div>
                  <input
                    id="resumeUpload"
                    type='file'
                    accept='.pdf'
                    onChange={(e) => setResume(e.target.files[0])}
                    className='hidden'
                  />
                  <p className='text-center text-gray-500 text-sm mt-2'>{resume ? resume.name : "Click to Upload Resume (Optional)"}</p>
                </motion.div>
              )
            }
            {
              resume && (
                <motion.button
                  onClick={(e) => { e.stopPropagation(); handleAnalyze() }}
                  className='cursor-pointer text-green-500 font-bold text-lg transition-all flex items-center justify-center space-x-2 hover:text-green-700 disabled:text-gray-300 disabled:cursor-not-allowed'
                  disabled={analyzing}
                >
                  <HiSparkles size={24} />
                  <span>{analyzing ? "Analyzing..." : "Analyze Resume By AI"}</span>
                </motion.button>
              )
            }

            <motion.button
              disabled={!selectedRole || !selectedExperience || loading}
              onClick={handlestart}
              className='cursor-pointer w-full bg-green-600 text-white py-3 rounded-4xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed'>
              <FaRobot className='text-xl' />
              <span>{loading ? "Starting..." : "Start Interview"}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Step1SetUp