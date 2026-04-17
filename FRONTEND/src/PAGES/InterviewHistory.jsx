import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { FaArrowLeft, FaBriefcase, FaVideo, FaUserTie, FaCalendarAlt, FaCheckCircle, FaClock, FaChartLine, FaSearch, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from 'motion/react';
import moment from 'moment';

const InterviewHistory = () => {
        const [interviews, setInterviews] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const [searchTerm, setSearchTerm] = useState('');
        const [filterStatus, setFilterStatus] = useState('all');
        const navigate = useNavigate();

        const fetchInterviews = async () => {
                try {
                        setLoading(true);
                        const response = await axios.get(ServerUrl + "/api/interview/history", { withCredentials: true });
                        console.log(response?.data?.interviews);
                        setInterviews(response?.data?.interviews);
                } catch (error) {
                        setError(error?.response?.data?.message);
                } finally {
                        setLoading(false);
                }
        }

        useEffect(() => {
                fetchInterviews();
        }, []);

        // Filter interviews based on search and status
        const filteredInterviews = interviews.filter(interview => {
                const matchesSearch = interview.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        interview.mode.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = filterStatus === 'all' || interview.status === filterStatus;
                return matchesSearch && matchesStatus;
        });

        const getStatusConfig = (status) => {
                if (status === "completed") {
                        return {
                                icon: FaCheckCircle,
                                text: "Completed",
                                bgColor: "bg-gradient-to-r from-emerald-50 to-green-50",
                                textColor: "text-emerald-700",
                                borderColor: "border-emerald-200",
                                iconColor: "text-emerald-500"
                        };
                }
                return {
                        icon: FaClock,
                        text: "Pending",
                        bgColor: "bg-gradient-to-r from-amber-50 to-orange-50",
                        textColor: "text-amber-700",
                        borderColor: "border-amber-200",
                        iconColor: "text-amber-500"
                };
        };

        const containerVariants = {
                hidden: { opacity: 0 },
                visible: {
                        opacity: 1,
                        transition: {
                                staggerChildren: 0.1,
                        },
                },
        };

        const cardVariants = {
                hidden: { opacity: 0, y: 30 },
                visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                        }
                },
                hover: {
                        y: -5,
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                }
        };

        return (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-hidden">
                        {/* Animated Background Elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <motion.div
                                        animate={{
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 90, 0],
                                        }}
                                        transition={{
                                                duration: 20,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                        }}
                                        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full blur-3xl opacity-20"
                                />
                                <motion.div
                                        animate={{
                                                scale: [1, 1.3, 1],
                                                rotate: [0, -90, 0],
                                        }}
                                        transition={{
                                                duration: 25,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                        }}
                                        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full blur-3xl opacity-20"
                                />
                        </div>

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                                {/* Header Section */}
                                <motion.div
                                        initial={{ opacity: 0, y: -30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="mb-8"
                                >
                                        <div className="flex items-center gap-4 mb-6">
                                                <motion.button
                                                        whileHover={{ scale: 1.05, x: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => navigate("/")}
                                                        className="p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                                                >
                                                        <FaArrowLeft className="text-gray-600 group-hover:text-emerald-600 transition-colors" />
                                                </motion.button>
                                                <div>
                                                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                                Interview History
                                                        </h1>
                                                        <p className="text-gray-500 mt-1">Track your interview performance and progress</p>
                                                </div>
                                        </div>

                                        {/* Stats Cards */}
                                        {!loading && !error && interviews.length > 0 && (
                                                <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                                                >
                                                        {[
                                                                { label: "Total Interviews", value: interviews.length, icon: FaBriefcase, color: "emerald" },
                                                                { label: "Completed", value: interviews.filter(i => i.status === "completed").length, icon: FaCheckCircle, color: "green" },
                                                                { label: "Pending", value: interviews.filter(i => i.status !== "completed").length, icon: FaClock, color: "amber" },
                                                                { label: "Success Rate", value: `${Math.round((interviews.filter(i => i.status === "completed").length / interviews.length) * 100)}%`, icon: FaChartLine, color: "blue" },
                                                        ].map((stat, idx) => (
                                                                <motion.div
                                                                        key={idx}
                                                                        whileHover={{ scale: 1.05 }}
                                                                        className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
                                                                >
                                                                        <div className="flex items-center justify-between mb-2">
                                                                                <stat.icon className={`text-${stat.color}-500 text-xl`} />
                                                                                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-500">{stat.label}</p>
                                                                </motion.div>
                                                        ))}
                                                </motion.div>
                                        )}

                                </motion.div>

                                {/* Content Section */}
                                <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-4"
                                >
                                        {loading ? (
                                                <div className="flex flex-col items-center justify-center py-20">
                                                        <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
                                                        />
                                                        <p className="text-gray-500 mt-4">Loading your interview history...</p>
                                                </div>
                                        ) : error ? (
                                                <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="text-center py-20"
                                                >
                                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                                                <FaClock className="text-red-500 text-2xl" />
                                                        </div>
                                                        <p className="text-red-500 text-lg">{error}</p>
                                                        <button
                                                                onClick={fetchInterviews}
                                                                className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
                                                        >
                                                                Try Again
                                                        </button>
                                                </motion.div>
                                        ) : filteredInterviews.length > 0 ? (
                                                <AnimatePresence>
                                                        {filteredInterviews.map((interview, index) => {
                                                                const StatusIcon = getStatusConfig(interview.status).icon;
                                                                const statusConfig = getStatusConfig(interview.status);

                                                                return (
                                                                        <motion.div
                                                                                key={interview._id}
                                                                                variants={cardVariants}
                                                                                whileHover="hover"
                                                                                onClick={() => navigate(`/report/${interview._id}`)}
                                                                                className="group cursor-pointer"
                                                                        >
                                                                                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                                                                        <div className="p-6">
                                                                                                {/* Header with Role and Status */}
                                                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                                                                                        <div className="flex items-center gap-3">
                                                                                                                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-md">
                                                                                                                        <FaBriefcase className="text-white text-lg" />
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                                                                                                                                {interview.role}
                                                                                                                        </h3>
                                                                                                                        {/* <p className="text-xs text-gray-400">Interview ID: {interview._id.slice(-8)}</p> */}
                                                                                                                </div>
                                                                                                        </div>
                                                                                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border w-fit`}>
                                                                                                                <StatusIcon className={`${statusConfig.iconColor} text-sm`} />
                                                                                                                <span className={`text-sm font-semibold ${statusConfig.textColor}`}>
                                                                                                                        {statusConfig.text}
                                                                                                                </span>
                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Details Grid */}
                                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                                                                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                                                                                        <FaVideo className="text-emerald-500" />
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                        <p className="text-xs text-gray-400">Mode</p>
                                                                                                                        <p className="text-sm font-semibold text-gray-700 capitalize">{interview.mode}</p>
                                                                                                                </div>
                                                                                                        </div>

                                                                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                                                                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                                                                                        <FaUserTie className="text-emerald-500" />
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                        <p className="text-xs text-gray-400">Experience</p>
                                                                                                                        <p className="text-sm font-semibold text-gray-700">{interview.experience} years</p>
                                                                                                                </div>
                                                                                                        </div>

                                                                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                                                                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                                                                                        <FaCalendarAlt className="text-emerald-500" />
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                        <p className="text-xs text-gray-400">Date</p>
                                                                                                                        <p className="text-sm font-semibold text-gray-700">{moment(interview.createdAt).format("DD MMM YYYY")}</p>
                                                                                                                </div>
                                                                                                        </div>

                                                                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                                                                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                                                                                        <FaChartLine className="text-emerald-500" />
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                        <p className="text-xs text-gray-400">Time</p>
                                                                                                                        <p className="text-sm font-semibold text-gray-700">{moment(interview.createdAt).format("hh:mm A")}</p>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* View Details Button */}
                                                                                                <div className="flex justify-end pt-2 border-t border-gray-100">
                                                                                                        <motion.button
                                                                                                                whileHover={{ x: 5 }}
                                                                                                                className="text-emerald-600 text-sm font-semibold flex items-center gap-1 group-hover:text-emerald-700 transition-colors"
                                                                                                        >
                                                                                                                View Full Report
                                                                                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                                                </svg>
                                                                                                        </motion.button>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </motion.div>
                                                                );
                                                        })}
                                                </AnimatePresence>
                                        ) : (
                                                <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="text-center py-20"
                                                >
                                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-6">
                                                                <FaBriefcase className="text-emerald-500 text-4xl" />
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Interview History</h3>
                                                        <p className="text-gray-500 mb-6">Start your first interview to see your history here</p>
                                                        <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => navigate("/")}
                                                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                                        >
                                                                Start Interview
                                                        </motion.button>
                                                </motion.div>
                                        )}
                                </motion.div>
                        </div>
                </div>
        )
}

export default InterviewHistory