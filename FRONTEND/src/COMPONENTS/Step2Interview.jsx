import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import male from "./../assets/Videos/male-ai.mp4"
import female from "./../assets/Videos/female-ai.mp4"
import Timer from './Timer'
import { motion } from 'motion/react'
import { TiArrowRightThick } from "react-icons/ti"
import { BsMic, BsMicMute } from 'react-icons/bs'
import { ServerUrl } from '../App'

const Step2SetUp = ({ interviewData, onComplete }) => {
  const { interviewId, questions, username } = interviewData

  const [isIntro, setIsIntro] = useState(true)
  const [isMicOn, setIsMicOn] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [timeleft, setTimeLeft] = useState(questions[0]?.timeLimit || 60)
  const [submitting, setSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)  // ✅ track submission
  const [voiceGender, setVoiceGender] = useState("male")
  const [subtitle, setSubtitle] = useState("")
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [IsPlaying, setIsPlaying] = useState(false)

  const recognitionRef = useRef(null)
  const videoRef = useRef(null)

  const currentQuestion = questions[currentIdx]

  // ✅ Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length === 0) return
      const voice = voices.find(v => v.name === "Google US English") || voices[0]
      setVoiceGender(voice.name.toLowerCase().includes("female") ? "female" : "male")
      setSelectedVoice(voice)
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const videoSource = voiceGender === "male" ? male : female

  // ✅ speakText
  const speakText = (text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!selectedVoice) { resolve(); return }
      if (!text || typeof text !== 'string') { resolve(); return }

      window.speechSynthesis.cancel()

      const cleanText = text
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/[^\w\s.,?!'-]/g, '')
        .trim()

      if (!cleanText) { resolve(); return }

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.voice = selectedVoice
      utterance.rate = options.rate || 0.9
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1
      utterance.lang = 'en-US'

      utterance.onstart = () => {
        setIsPlaying(true)
        stopMic()
        if (videoRef.current) {
          videoRef.current.play().catch(err => console.error("Video error:", err))
        }
      }

      utterance.onend = () => {
        setIsPlaying(false)
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
        setTimeout(() => {
          setSubtitle("")
          resolve()
        }, 300)
      }

      utterance.onerror = (event) => {
        setIsPlaying(false)
        if (videoRef.current) videoRef.current.pause()
        if (event.error === 'interrupted' || event.error === 'canceled') {
          resolve()
        } else {
          reject(new Error(`Speech failed: ${event.error}`))
        }
      }

      setSubtitle(cleanText)
      setTimeout(() => window.speechSynthesis.speak(utterance), 50)
    })
  }

  // ✅ Intro — fixed, question asked only once
  useEffect(() => {
    if (!selectedVoice) return

    const runIntro = async () => {
      if (isIntro) {
        await speakText(`Hello ${username}, Welcome to Smart Interview. I'm your AI Interviewer. Let's begin!`)
        await speakText(`I'm going to ask you ${questions.length} questions. Please answer each to the best of your ability.`)
        setIsIntro(false)
      } else {
        if (currentQuestion) {
          await new Promise(r => setTimeout(r, 1000))
          if (currentIdx > 0) {
            await speakText("Next question. " + currentQuestion.question)  // ✅ asked once only
          } else {
            await speakText("Your first question is: " + currentQuestion.question) // ✅ asked once only
          }
          startMic()
          setIsMicOn(true)
        }
      }
    }

    runIntro()
  }, [selectedVoice, isIntro, currentIdx])

  // ✅ Timer
  useEffect(() => {
    if (isIntro || !currentQuestion || submitting) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 0) return prev - 1
        clearInterval(timer)
        return 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isIntro, currentIdx, submitting])

  // ✅ startMic — fresh instance every time
  const startMic = () => {
    if (IsPlaying) return
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        console.error("Speech recognition not supported — use Chrome")
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => {
        console.log("Mic started ✅")
        setIsMicOn(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        console.log("transcript →", transcript)
        setAnswer(prev => prev + " " + transcript)  // ✅ updates textarea
      }

      recognition.onerror = (event) => {
        console.error("Mic error →", event.error)
        setIsMicOn(false)
      }

      recognition.onend = () => {
        console.log("Mic ended")
        setIsMicOn(false)
      }

      recognitionRef.current = recognition
      recognitionRef.current.start()

    } catch (err) {
      console.error("startMic error →", err.message)
    }
  }

  // ✅ stopMic
  const stopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        recognitionRef.current = null
        setIsMicOn(false)
      } catch (err) {
        console.error("stopMic error →", err.message)
      }
    }
  }

  // ✅ toggleMic
  const toggleMic = () => {
    if (isMicOn) {
      stopMic()
    } else {
      startMic()
    }
  }

  //✅ handleSubmit
  const handleSubmit = async () => {
    if (submitting) return;
    stopMic()
    setSubmitting(true)

    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionId: currentQuestion._id,
        answer,
        timeTaken:
          currentQuestion.timeLimit - timeleft,
      }, { withCredentials: true })

      setFeedback(result.data.feedback)
      await speakText(result.data.feedback)
      setIsSubmitted(true)
      setSubmitting(false)
      setIsSubmitted(true);
    } catch (error) {
      console.log(error)
      setSubmitting(false)
    }
  }

  // ✅ handleNext — fixed all bugs
  const handleNext = async () => {
    try {
      if (currentIdx < questions.length - 1) {
        await speakText("Alright, let's move to the next question.")

        setCurrentIdx(prev => prev + 1)   // ✅ increment once
        setAnswer("")
        setFeedback("")
        setIsSubmitted(false)              // ✅ reset submission
        setSubmitting(false)
        setTimeLeft(questions[currentIdx + 1]?.timeLimit || 60)

        setTimeout(() => startMic(), 500)

      } else {
        // ✅ Last question
        await speakText("Great job! You have completed all the questions.")
        await finishInterview()
        navigate("/")
        // onComplete()                       // ✅ fixed — was onComplete undefined
      }
    } catch (err) {
      console.error("handleNext error →", err.message)
    }
  }

  // ✅ finishInterview
  const finishInterview = async () => {
    stopMic()
    setIsMicOn(false)
    window.speechSynthesis.cancel()

    if (videoRef.current) videoRef.current.pause()

    try {
      await axios.post(`${ServerUrl}/api/interview/finish-interview`, {
        interviewId,
      }, { withCredentials: true })
    } catch (err) {
      console.error("Finish error →", err.response?.data || err.message)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-6xl min-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* Left Panel */}
        <div className="w-full lg:w-[35%] bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              loop
              className="w-full h-full object-cover"
            />
          </div>

          {subtitle && (
            <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6'>
              <p className='text-base text-gray-600'>{subtitle}</p>
            </div>
          )}

          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-base text-gray-500'>Interview Status</span>
              <span className='text-base font-semibold text-emerald-600'>
                {IsPlaying ? "AI Speaking" : "AI Listening"}
              </span>
            </div>

            <div className='h-px bg-gray-200' />

            <div className='flex justify-center'>
              <Timer timeleft={timeleft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className='h-px bg-gray-200' />

            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-gray-500 text-sm'>Question</span>
                <span className='text-base font-semibold text-emerald-600 mx-2'>{currentIdx + 1}</span>
              </div>
              <div>
                <span className='text-gray-500 text-sm'>Total</span>
                <span className='text-base font-semibold text-emerald-600 mx-2'>{questions.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>Smart Interview</h2>

          {!isIntro && (
            <div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
              <p className='text-sm text-gray-400 mb-2'>Question</p>
              <p className='text-base sm:text-lg font-semibold text-gray-600 leading-relaxed'>
                {currentQuestion?.question}
              </p>
            </div>
          )}

          {/* ✅ Textarea with mic button */}
          <div className='relative w-full'>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              name="answer"
              id="answer"
              className='flex-1 w-full h-80 bg-gray-100 border border-gray-200 rounded-2xl p-4 pr-14 text-base text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none'
              placeholder={isMicOn ? "🎙️ Listening..." : "Answer here or use mic"}
            />
            <button
              onClick={toggleMic}
              disabled={IsPlaying}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300
                                ${isMicOn
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"}
                                disabled:opacity-50 disabled:cursor-not-allowed`}>
              {isMicOn ? <BsMicMute size={18} /> : <BsMic size={18} />}
            </button>
          </div>

          {/* ✅ Feedback */}
          {feedback && (
            <div className='mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl'>
              <p className='text-sm text-emerald-700'>{feedback}</p>
            </div>
          )}

          {/* ✅ Buttons */}
          <div className='flex items-center gap-4 mt-6'>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitted || submitting}
              className='flex-1 flex items-center justify-center px-6 py-3 rounded-full text-lg font-semibold gap-2 transition-all duration-300
                                bg-emerald-600 text-white hover:bg-emerald-700
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'>
              <span>{isSubmitted ? "Submitted ✓" : submitting ? "Submitting..." : "Submit"}</span>
            </motion.button>

            {/* Next Button */}
            <motion.button
              onClick={handleNext}
              disabled={!isSubmitted}
              className='flex-1 flex items-center justify-center px-6 py-3 rounded-full text-lg font-semibold gap-2 transition-all duration-300
                                bg-blue-600 text-white hover:bg-blue-700
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'>
              <span>Next</span>
              <TiArrowRightThick size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2SetUp