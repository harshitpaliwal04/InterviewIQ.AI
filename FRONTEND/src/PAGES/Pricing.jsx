import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle, FaGem, FaRocket, FaCrown, FaStar, FaBolt, FaChartLine, FaHeadset, FaInfinity, FaShieldAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { ServerUrl } from '../App';

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
      icon: FaRocket,
      gradient: "from-gray-600 to-gray-700",
      lightGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
      icon: FaGem,
      gradient: "from-blue-500 to-cyan-500",
      lightGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
      icon: FaCrown,
      gradient: "from-purple-500 to-pink-500",
      lightGradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
    },
  ];

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
      y: -10,
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  // Frontend payment handler (updated)
  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

      // Create order
      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RZP_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          const verifyResult = await axios.post(
            ServerUrl + "/api/payment/verify",
            response, { withCredentials: true }
          );

          if (verifyResult.data.success) {
            // dispatch(setUserData(verifyResult.data.user));
            alert(`Payment Successful! ${plan.credits} credits added.`);
            
            navigate("/");
          }
        },
        theme: {
          color: "#10b981",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message ||"Payment failed. Please try again.");
    } finally {
      setLoadingPlan(null);
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-start gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="mt-2 p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <FaArrowLeft className="text-gray-600 group-hover:text-emerald-600 transition-colors" />
            </motion.button>

            <div className="flex-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full mb-4"
              >
                <FaStar className="text-emerald-600 text-sm" />
                <span className="text-sm font-semibold text-emerald-600">Simple, Transparent Pricing</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                Choose Your Plan
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Flexible pricing to match your interview preparation goals.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan.id
            const isHovered = hoveredPlan === plan.id
            const Icon = plan.icon
            const isPopular = plan.badge === "Best Value"

            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredPlan(plan.id)}
                onHoverEnd={() => setHoveredPlan(null)}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`relative rounded-3xl transition-all duration-500 cursor-pointer
                  ${isSelected
                    ? "shadow-2xl ring-2 ring-emerald-500 ring-offset-2"
                    : "shadow-lg hover:shadow-xl"
                  }
                  ${plan.default ? "cursor-pointer" : "cursor-pointer"}
                `}
                style={{
                  background: `linear-gradient(135deg, white 0%, ${isSelected ? '#f0fdf4' : 'white'} 100%)`
                }}
              >
                {/* Glow Effect on Hover */}
                {isHovered && (
                  <motion.div
                    layoutId="glowEffect"
                    className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                {/* Badge */}
                {plan.badge && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    className="absolute top-6 right-6 z-10"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <FaStar className="text-yellow-300 text-xs" />
                      {plan.badge}
                    </div>
                  </motion.div>
                )}

                {/* Default Tag */}
                {plan.default && (
                  <div className="absolute top-6 right-6 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                    <FaShieldAlt className="text-xs" />
                    Default
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${plan.gradient} shadow-lg`}>
                      <Icon className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {plan.credits} Credits
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 text-sm">/one-time</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-0.5 flex-1 bg-gray-200 rounded-full" />
                      <span className="text-xs text-gray-400">includes</span>
                      <div className="h-0.5 flex-1 bg-gray-200 rounded-full" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 group"
                      >
                        <div className={`p-0.5 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-gray-300'} group-hover:scale-110 transition-transform`}>
                          <FaCheckCircle className={`text-white text-xs ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
                        </div>
                        <span className={`text-sm ${isSelected ? 'text-gray-700' : 'text-gray-600'} group-hover:text-gray-900 transition-colors`}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Button */}
                  {!plan.default && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loadingPlan === plan.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSelected) {
                          setSelectedPlan(plan.id)
                        } else {
                          handlePayment(plan)
                        }
                      }}
                      className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group
                        ${isSelected
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                        }
                      `}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loadingPlan === plan.id ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            {isSelected ? (
                              <>
                                <FaBolt className="text-sm" />
                                Proceed to Pay
                              </>
                            ) : (
                              "Select Plan"
                            )}
                          </>
                        )}
                      </span>

                      {/* Button Hover Effect */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={false}
                          animate={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />
                      )}
                    </motion.button>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && !plan.default && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="w-3 h-3 bg-emerald-500 rounded-full rotate-45" />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: FaShieldAlt, text: "Secure Payment", color: "emerald" },
              { icon: FaHeadset, text: "24/7 Support", color: "blue" },
              { icon: FaChartLine, text: "Instant Credits", color: "purple" },
              { icon: FaInfinity, text: "No Expiry", color: "orange" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-md"
              >
                <item.icon className={`text-${item.color}-500 text-2xl`} />
                <span className="text-xs font-semibold text-gray-600">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-8">
            🔒 Secure payments powered by Razorpay • 100% money-back guarantee
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Pricing