import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore.js';
import toast from 'react-hot-toast'; 

const Signup = () => {
  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(''); 

  // UI State
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false); // This is now our only step toggle
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Store Functions
  // Note: We no longer need verifyOTP from the store for this flow
  const { signup, verifyEmail, loading } = useUserStore(); 
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delayChildren: 0.2, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const generateStrongPassword = async () => {
    setIsGeneratingPassword(true);
    try {
      // (Your existing password generation logic... no changes needed here)
      const prompt = "Generate a random, strong password...";
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = "AIzaSyAVICQqqWr_QrsWcmdRyhqAOFVBoyZJThY";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      const generatedPassword = result.candidates[0].content.parts[0].text.trim();
      const sanitizedPassword = generatedPassword.split(/\s+/)[0];
      setPassword(sanitizedPassword);
      setConfirmPassword(sanitizedPassword);
    } catch (error) {
      console.error("Error generating password:", error);
      toast.error("Failed to generate password.");
    } finally {
      setIsGeneratingPassword(false);
    }
  };

  // Step 1 Handler: Request the OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsSendingOTP(true);
    try {
      // This calls /request-otp with {email, purpose: "verify"} (assuming you made that fix)
      await verifyEmail(email); 
      setIsEmailSent(true); // This will now show the main signup form
      toast.success("OTP Sent! Please check your email.");
    } catch (error) {
      console.error("OTP send failed:", error);
    } finally {
      setIsSendingOTP(false);
    }
  };


  // Step 2 Handler: Create the user AND verify the OTP in one API call
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        toast.error('Passwords do not match!');
        return;
    }

    try {
      // This function from useUserStore needs to send all 5 fields to /auth/signup
      await signup({ name, email, password, confirmPassword, otp });
      
      // On success, the backend has created the verified user and logged us in. Navigate home.
      navigate('/');
    } catch (error) {
      console.error("Final Signup failed:", error);
      // Error toast is already handled by the store
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#080808] text-white p-4 font-[Inter] overflow-hidden">
      
      {/* (Background and Mouse-glow divs... no changes) */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `radial-gradient(#ffffff22 1px, transparent 1px)`, backgroundSize: `20px 20px`, }} />
      <div className="pointer-events-none fixed inset-0 z-10 opacity-30" style={{ background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, #10b98144, transparent 80%)`, }} />
      
      <motion.div
        className="relative z-20 w-full max-w-md p-8 rounded-xl shadow-2xl bg-gray-900/80 border border-gray-700 backdrop-blur-md"
        variants={containerVariants} initial="hidden" animate="visible"
      >
        <motion.h1 
          className="text-4xl font-bold mb-6 text-center"
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
        >
          Sign Up
        </motion.h1>

        {/* --- TERNARY LOGIC IS NOW MUCH SIMPLER --- */}

        {!isEmailSent ? (
          // STEP 1: Get Email and Send OTP
          <form onSubmit={handleRequestOTP} className="space-y-6">
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
                {isSendingOTP ? 'Sending OTP...' : 'Send Verification Email'}
              </button>
            </motion.div>
          </form>

        ) : (

          // STEP 2: Get Details + OTP, then Create & Verify Account
          <form onSubmit={handleFinalSubmit} className="space-y-6">
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
              <label className="block text-sm font-medium text-gray-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Password</label>
              <div className="relative flex items-center">
                 {/* (Input and button for password visibility... no change) */}
                 <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-12" />
                 <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 text-gray-400 hover:text-white transition-colors duration-200">
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
                {/* (Input and button for confirm password... no change) */}
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-12" />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 text-gray-400 hover:text-white transition-colors duration-200">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Verification OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Check your email for the 6-digit code"
                className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-md shadow-emerald-500/50"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
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