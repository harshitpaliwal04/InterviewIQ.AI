import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './PAGES/Home.jsx'
import Auth from './PAGES/Auth.jsx'
import Pricing from './PAGES/Pricing.jsx'
import Interview from './PAGES/Interview.jsx'
import InterviewHistory from './PAGES/InterviewHistory.jsx'
import Report from './PAGES/InterviewReport.jsx'
import { ProtectedRoutes, AuthRoute } from "./PAGES/ProtectedRoutes.jsx"
import { useEffect } from 'react'

export const ServerUrl = meta.env.VITE_SERVER_URL || "https://interviewiq-ai-ymni.onrender.com"


function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp < Math.floor(Date.now() / 1000);
        if (isExpired) {
          localStorage.removeItem("token");
          window.location.href = "/auth";
        }
      } catch {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
      <Route path="/pricing" element={<ProtectedRoutes><Pricing /></ProtectedRoutes>} />
      <Route path="/interview" element={<ProtectedRoutes><Interview /></ProtectedRoutes>} />
      <Route path="/interview-history" element={<ProtectedRoutes><InterviewHistory /></ProtectedRoutes>} />
      <Route path="/report/:id" element={<ProtectedRoutes><Report /></ProtectedRoutes>} />
      <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
    </Routes>
  )
}

export default App
