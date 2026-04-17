import React, { useState } from 'react'
import { FaArrowLeft, FaDownload, FaTrophy, FaBrain, FaComments, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-emerald-500/30 rounded-xl px-4 py-2 text-sm text-white shadow-xl">
        <p className="text-emerald-400 font-bold">{label}</p>
        <p>Score: <strong>{payload[0].value}/10</strong></p>
      </div>
    )
  }
  return null
}

function Step3Report({ report }) {
  const navigate = useNavigate()
  const [openQ, setOpenQ] = useState(null)

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading report...</p>
        </div>
      </div>
    )
  }

  const {
    finalConfidence = 0,
    finalCommunication = 0,
    finalCorrectness = 0,
  } = report

  const finalScore = ((parseFloat(finalConfidence) + parseFloat(finalCommunication) + parseFloat(finalCorrectness)) / 3).toFixed(2)

  const percentage = (finalScore / 10) * 100

  const questionScoreData = report?.questions?.map((q, i) => ({
    name: `Q${i + 1}`,
  }))

  const score = report?.questions?.map((q, i) => ({
    name: `Q${i + 1}`,
    score: parseFloat((q.communication + q.confidence + q.correctness) / 3).toFixed(1) ?? 0
  }))

  console.log(score)

  const BestScore = Math.max(...score.map((q) => q.score))
  const WorstScore = Math.min(...score.map((q) => q.score))

  let avg_Score = 0;
  for (let i = 0; i < score.length; i++) {
    avg_Score += parseFloat(score[i].score)
  }

  const skills = [
    { label: 'Confidence', value: finalConfidence, icon: <FaBrain size={13} /> },
    { label: 'Communication', value: finalCommunication, icon: <FaComments size={13} /> },
    { label: 'Correctness', value: finalCorrectness, icon: <FaCheckCircle size={13} /> },
  ]

  let performanceText, shortTagline, badgeColor, badgeLabel

  if (finalScore >= 8) {
    performanceText = 'Job-ready performance'
    shortTagline = 'Excellent clarity and structured responses.'
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    badgeLabel = 'Excellent'
  } else if (finalScore >= 5) {
    performanceText = 'Solid foundation, minor gaps'
    shortTagline = 'Good groundwork — refine articulation.'
    badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    badgeLabel = 'Moderate'
  } else {
    performanceText = 'Significant improvement needed'
    shortTagline = 'Focus on clarity, structure, and confidence.'
    badgeColor = 'bg-red-500/10 text-red-400 border border-red-500/20'
    badgeLabel = 'Needs Work'
  }

  const avgScore = report?.questions?.length
    ? (report?.questions?.reduce((a, q) => a + (q.score || 0), 0) / report?.questions?.length).toFixed(1)
    : 0
  const bestScore = Math.max(...report?.questions?.map(q => q.score || 0))
  const worstScore = Math.min(...report?.questions?.map(q => q.score || 0))

  const getScoreColor = (score) => {
    if (score >= 7) return 'text-emerald-400'
    if (score >= 5) return 'text-amber-400'
    return 'text-red-400'
  }

  const downloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 18
    const contentWidth = pageWidth - margin * 2
    let y = 0

    // ===================== HEADER BLOCK =====================
    doc.setFillColor(10, 10, 20)
    doc.rect(0, 0, pageWidth, 52, 'F')

    // Green accent line
    doc.setFillColor(16, 185, 129)
    doc.rect(0, 0, 5, 52, 'F')

    // Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(255, 255, 255)
    doc.text('Interview Performance Report', margin + 8, 22)

    // Subtitle
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text('AI-Powered Analytics  •  InterviewIQ', margin + 8, 32)

    // Date
    const date = new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
    doc.setFontSize(9)
    doc.setTextColor(107, 114, 128)
    doc.text(date, pageWidth - margin, 22, { align: 'right' })

    // Badge
    const badgeX = pageWidth - margin - 38
    doc.setFillColor(
      finalScore >= 8 ? 16 : finalScore >= 5 ? 245 : 239,
      finalScore >= 8 ? 185 : finalScore >= 5 ? 158 : 68,
      finalScore >= 8 ? 129 : finalScore >= 5 ? 11 : 68,
    )
    doc.roundedRect(badgeX, 27, 38, 10, 3, 3, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    doc.text(badgeLabel.toUpperCase(), badgeX + 19, 33.5, { align: 'center' })

    y = 64

    // ===================== SCORE + SKILLS ROW =====================
    // Score Box
    doc.setFillColor(240, 253, 244)
    doc.roundedRect(margin, y, 55, 55, 6, 6, 'F')
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.roundedRect(margin, y, 55, 55, 6, 6, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(36)
    doc.setTextColor(16, 185, 129)
    doc.text(`${finalScore}`, margin + 27.5, y + 28, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(107, 114, 128)
    doc.text('out of 10', margin + 27.5, y + 38, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(16, 185, 129)
    doc.text('FINAL SCORE', margin + 27.5, y + 50, { align: 'center' })

    // Skills Box
    const skillsX = margin + 62
    doc.setFillColor(249, 250, 251)
    doc.roundedRect(skillsX, y, contentWidth - 62, 55, 6, 6, 'F')
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.4)
    doc.roundedRect(skillsX, y, contentWidth - 62, 55, 6, 6, 'S')

    const skillsData = [
      { label: 'Confidence', value: finalConfidence },
      { label: 'Communication', value: finalCommunication },
      { label: 'Correctness', value: finalCorrectness },
    ]

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(30, 30, 40)
    doc.text('Skill Breakdown', skillsX + 10, y + 12)

    skillsData.forEach((skill, i) => {
      const skillY = y + 22 + i * 11
      const barX = skillsX + 10
      const barWidth = contentWidth - 82
      const fillWidth = (skill.value / 10) * barWidth

      // Label
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(75, 85, 99)
      doc.text(skill.label, barX, skillY)

      // Score
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(16, 185, 129)
      doc.text(`${skill.value}/10`, skillsX + contentWidth - 72, skillY, { align: 'right' })

      // Track
      doc.setFillColor(229, 231, 235)
      doc.roundedRect(barX, skillY + 2, barWidth, 3.5, 1.5, 1.5, 'F')

      // Fill
      const r = skill.value >= 7 ? 16 : skill.value >= 5 ? 245 : 239
      const g = skill.value >= 7 ? 185 : skill.value >= 5 ? 158 : 68
      const b = skill.value >= 7 ? 129 : skill.value >= 5 ? 11 : 68
      doc.setFillColor(r, g, b)
      doc.roundedRect(barX, skillY + 2, fillWidth, 3.5, 1.5, 1.5, 'F')
    })

    y += 65

    // ===================== QUICK STATS ROW =====================
    const statLabels = [
      { label: 'Total Questions', value: report?.questions?.length },
      { label: 'Average Score', value: `${avgScore}/10` },
      { label: 'Best Question', value: `${bestScore}/10` },
      { label: 'Worst Question', value: `${worstScore}/10` },
    ]

    const statW = contentWidth / 4 - 2
    statLabels.forEach((stat, i) => {
      const statX = margin + i * (statW + 2.5)
      doc.setFillColor(248, 250, 252)
      doc.setDrawColor(229, 231, 235)
      doc.setLineWidth(0.4)
      doc.roundedRect(statX, y, statW, 22, 4, 4, 'FD')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(16, 185, 129)
      doc.text(String(stat.value), statX + statW / 2, y + 11, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(107, 114, 128)
      doc.text(stat.label, statX + statW / 2, y + 18, { align: 'center' })
    })

    y += 32

    // ===================== ADVICE BOX =====================
    const advice = finalScore >= 8
      ? 'Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.'
      : finalScore >= 5
        ? 'Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.'
        : 'Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.'

    doc.setFillColor(240, 253, 244)
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.4)
    doc.roundedRect(margin, y, contentWidth, 26, 4, 4, 'FD')

    // Left accent
    doc.setFillColor(16, 185, 129)
    doc.roundedRect(margin, y, 3.5, 26, 2, 2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(5, 150, 105)
    doc.text('PROFESSIONAL ADVICE', margin + 10, y + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(55, 65, 81)
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 16)
    doc.text(splitAdvice, margin + 10, y + 15)

    y += 36

    // ===================== QUESTION TABLE =====================
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(10, 10, 20)
    doc.text('Question Breakdown', margin, y)

    // Accent line under heading
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(1.5)
    doc.line(margin, y + 3, margin + 42, y + 3)
    doc.setLineWidth(0.3)
    doc.setDrawColor(229, 231, 235)
    doc.line(margin + 42, y + 3, margin + contentWidth, y + 3)

    y += 8

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['#', 'Question', 'Score', 'AI Feedback']],
      body: report?.questions?.map((q, i) => [
        `${i + 1}`,
        q.question || '',
        `${q.score ?? 0}/10`,
        q.feedback || 'No feedback'
      ]),
      styles: {
        fontSize: 8.5,
        cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
        valign: 'top',
        lineColor: [229, 231, 235],
        lineWidth: 0.3,
        textColor: [55, 65, 81],
        font: 'helvetica',
      },
      headStyles: {
        fillColor: [10, 10, 20],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 9,
        cellPadding: { top: 6, bottom: 6, left: 4, right: 4 },
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 52 },
        2: { cellWidth: 18, halign: 'center', fontStyle: 'bold', textColor: [16, 185, 129] },
        3: { cellWidth: 'auto' },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      didDrawCell: (data) => {
        // Score color coding
        if (data.column.index === 2 && data.section === 'body') {
          const score = parseInt(data.cell.text[0])
          if (score >= 7) data.cell.styles.textColor = [16, 185, 129]
          else if (score >= 5) data.cell.styles.textColor = [245, 158, 11]
          else data.cell.styles.textColor = [239, 68, 68]
        }
      },
    })

    // ===================== FOOTER =====================
    const finalY = pageHeight - 12
    doc.setFillColor(10, 10, 20)
    doc.rect(0, finalY - 6, pageWidth, 20, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(107, 114, 128)
    doc.text('Generated by InterviewIQ.Ai  •  AI-Powered Interview Platform', margin, finalY + 2)
    doc.text(`Page 1`, pageWidth - margin, finalY + 2, { align: 'right' })

    doc.save('InterviewIQ_Report.pdf')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 sm:px-6 lg:px-10 py-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center sm:flex-row sm:items-center sm:justify-between justify-center mb-8 flex-wrap gap-4">

        <div className="sm:w-auto w-full flex items-center gap-4">
          <button
            onClick={() => navigate('/interview-history')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 p-3 rounded-xl transition-all duration-200">
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Interview Report
            </h1>
            <p className="text-gray-500 text-sm mt-1">AI-powered performance analytics</p>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          className="sm:w-auto w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-emerald-900/40">
          <FaDownload size={12} /> Download PDF
        </button>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="flex flex-col gap-5">

          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center hover:border-emerald-500/20 transition-all duration-300">

            <p className="text-gray-500 text-xs uppercase tracking-widest mb-5">
              Overall Score
            </p>

            <div className="w-36 h-36 mx-auto mb-5 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <CircularProgressbar
                value={percentage}
                text={`${finalScore}/10`}
                styles={buildStyles({
                  textSize: '18px',
                  pathColor: '#10b981',
                  textColor: '#ffffff',
                  trailColor: 'rgba(255,255,255,0.07)',
                  pathTransitionDuration: 1.2,
                })}
              />
            </div>

            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${badgeColor} mb-3`}>
              <FaTrophy size={10} /> {badgeLabel}
            </span>

            <p className="text-white font-semibold text-sm mt-2">{performanceText}</p>
            <p className="text-gray-500 text-xs mt-1.5">{shortTagline}</p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300">

            <p className="text-white font-semibold text-sm mb-4">Quick Stats</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Questions', value: report?.questions?.length },
                { label: 'Avg Score', value: `${((avg_Score) / score.length).toFixed(1)}/10` },
                { label: 'Best', value: `${parseFloat(BestScore).toFixed(1)}/10` },
                { label: 'Worst', value: `${parseFloat(WorstScore).toFixed(1)}/10` },
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-center">
                  <p className="text-emerald-400 text-lg font-bold">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300">

            <p className="text-white font-semibold text-sm mb-5">Skill Breakdown</p>

            <div className="flex flex-col gap-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <span className="text-emerald-400">{s.icon}</span>
                      {s.label}
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">{s.value}/10</span>
                  </div>
                  <div className="bg-white/[0.06] rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value * 10}%` }}
                      transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300">

            <div className="flex items-center justify-between mb-6">
              <p className="text-white font-semibold">Performance Trend</p>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                Per Question
              </span>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={score} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    fill="url(#scoreGrad)"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 5, strokeWidth: 0 }}
                    activeDot={{ r: 7, fill: '#34d399', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Question Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300">

            <p className="text-white font-semibold mb-5">Question Breakdown</p>

            <div className="flex flex-col gap-3">
              {report?.questions?.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  onClick={() => setOpenQ(openQ === i ? null : i)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-300
                                        ${openQ === i
                      ? 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-900/10'
                      : 'bg-white/[0.02] border-white/[0.07] hover:border-emerald-500/15 hover:bg-emerald-500/[0.03]'}`}>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-500/15 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          Q{i + 1}
                        </span>
                        <span className="text-gray-600 text-xs flex items-center gap-1">
                          {openQ === i ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
                          {openQ === i ? 'Hide' : 'Show'} feedback
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {q.question || 'Question not available'}
                      </p>
                    </div>

                    <div className="text-center flex-shrink-0">
                      <p className={`text-xl font-bold ${getScoreColor(q.score ?? 0)}`}>
                        {parseFloat((q.communication + q.confidence + q.correctness) / 3).toFixed(1) ?? 0}
                      </p>
                      <p className="text-gray-600 text-xs">/10</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {openQ === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}>
                        <div className="mt-4 border-l-2 border-emerald-500 bg-emerald-500/5 rounded-r-xl px-4 py-3">
                          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                            AI Feedback
                          </p>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {q.feedback?.trim() || 'No feedback available.'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Step3Report