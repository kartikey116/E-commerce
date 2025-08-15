import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore.js';
import toast from 'react-hot-toast'; 

const Signup = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(''); 

  // State for API loading and form steps
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false); // New state for sending OTP
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false); // New state for OTP verification loading
  const [isEmailSent, setIsEmailSent] = useState(false); // New state for email sent
  const [isOtpVerified, setIsOtpVerified] = useState(false); // New state to track if OTP is verified
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Correctly destructuring all necessary functions from the store
  const { signup, verifyEmail, verifyOTP, loading } = useUserStore(); 
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  useEffect(() => {
    const handleMouseMove = (e) => { setMousePosition({ x: e.clientX, y: e.clientY }); };
    window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  const generateStrongPassword = async () => {
    setIsGeneratingPassword(true);
    try {
      const prompt = "Generate a random, strong password that is at least 12 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and special symbols. Only respond with the password itself, no extra text.";
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = "AIzaSyAVICQqqWr_QrsWcmdRyhqAOFVBoyZJThY";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      const generatedPassword = result.candidates[0].content.parts[0].text.trim();
      const sanitizedPassword = generatedPassword.split(/\s+/)[0];
      setPassword(sanitizedPassword);
      setConfirmPassword(sanitizedPassword);
    } catch (error) {
      console.error("Error generating password:", error);
      toast.error("Failed to generate password. Please try again.");
    } finally {
      setIsGeneratingPassword(false);
    }
  };

  // NEW: Function to handle OTP sending
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsSendingOTP(true);
    try {
      await verifyEmail(email);
      setIsEmailSent(true);
    } catch (error) {
      console.error("OTP send failed:", error);
    } finally {
      setIsSendingOTP(false);
    }
  };

  // NEW: Function to handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsVerifyingOTP(true);
    try {
      await verifyOTP(email, otp);
      setIsOtpVerified(true);
      toast.success("OTP verified. You can now complete your signup!");
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  // Existing handle submit for final signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If OTP is verified, proceed with final signup
    try {
      await signup({ name, email, password, confirmPassword, otp });
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setOtp('');
      navigate('/login');
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#080808] text-white p-4 font-[Inter] overflow-hidden">
      
      {/* Background Dotted Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `radial-gradient(#ffffff22 1px, transparent 1px)`, backgroundSize: `20px 20px`, }} />

      {/* Glowing cursor effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 opacity-30"
        style={{ background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, #10b98144, transparent 80%)`, }}
      />
      
      {/* Signup Form Container */}
      <motion.div
        className="relative z-20 w-full max-w-md p-8 rounded-xl shadow-2xl bg-gray-900/80 border border-gray-700 backdrop-blur-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl font-bold mb-6 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Sign Up
        </motion.h1>

        {/* Three-step form handling */}
        {!isEmailSent ? (
          // Step 1: Send OTP
          <form onSubmit={handleSendOTP} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-md shadow-emerald-500/50"
                disabled={isSendingOTP}
              >
                {isSendingOTP ? 'Sending OTP...' : 'Verify Email'}
              </button>
            </motion.div>
          </form>
        ) : !isOtpVerified ? (
          // Step 2: Verify OTP
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Email Address</label>
              <input
                type="email"
                value={email}
                readOnly
                className="mt-1 block w-full px-4 py-2 bg-gray-700/50 border border-gray-700 rounded-lg focus:outline-none cursor-not-allowed"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-md"
                disabled={isVerifyingOTP}
              >
                {isVerifyingOTP ? 'Verifying...' : 'Verify OTP'}
              </button>
            </motion.div>
          </form>
        ) : (
          // Step 3: Complete Signup
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Email Address</label>
              <input
                type="email"
                value={email}
                readOnly
                className="mt-1 block w-full px-4 py-2 bg-gray-700/50 border border-gray-700 rounded-lg focus:outline-none cursor-not-allowed"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="button"
                onClick={generateStrongPassword}
                disabled={isGeneratingPassword}
                className="mt-2 w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow-md"
              >
                {isGeneratingPassword ? "..." : "✨ Generate Password"}
              </button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Confirm Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-md shadow-emerald-500/50"
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </motion.div>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-emerald-500 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
