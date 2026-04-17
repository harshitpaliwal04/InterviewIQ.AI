import React from 'react'
import Step1SetUp from '../COMPONENTS/Step1SetUp'
import Step2Interview from '../COMPONENTS/Step2Interview'
import Step3Report from '../COMPONENTS/Step3Report'
import { useState } from 'react'

const Interview = () => {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState({});
  const [report, setReport] = useState(null);

  return (
    <div className='min-h-screen bg-gray-50'>
      {step === 1 && <Step1SetUp onStart={(data) => {
        setInterviewData(data);
        setStep(2);
      }} />}
      {step === 2 && <Step2Interview interviewData={interviewData} onFinish={(report) => {
        setReport(report);
        setStep(3);
      }} />}
      {step === 3 && <Step3Report report={report} />}
    </div>
  )
}

export default Interview