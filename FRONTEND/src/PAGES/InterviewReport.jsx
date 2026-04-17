import React from 'react'
import { useParams } from 'react-router-dom'
import { ServerUrl } from '../App';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import moment from 'moment';
import Step3Report from '../COMPONENTS/Step3Report';

const InterviewReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ServerUrl + `/api/interview/report/${id}`, { withCredentials: true });
      console.log(response?.data);
      setReport(response?.data);
    } catch (error) {
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchReport();
  }, []);
  return (
    <Step3Report report={report} loading={loading} error={error} />
  )
}

export default InterviewReport