import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore.js';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  // State for the different stages of the flow
  const [stage, setStage] = useState('request'); // 'request', 'verify', 'submit'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Get all necessary functions and loading state from your store
  const { 
    loading, 
    requestResetOTP, 
    verifyResetOTP, 
    submitNewPassword 
  } = useUserStore();
  
  const navigate = useNavigate();

  // Animation variants (same as your other pages)
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1 } },
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

  // --- FORM HANDLERS ---

  // Step 1: Request the reset OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      await requestResetOTP(email); // Calls the store function
      setStage('verify'); // Move to the next step
    } catch (error) {
      console.error("Failed to send OTP:", error);
      // Toast error is handled by the store
    }
  };

  // Step 2: Verify the received OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyResetOTP(email, otp); // Calls the store function
      setStage('submit'); // Move to the final step
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    }
  };

  // Step 3: Submit the new password
  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await submitNewPassword(email, newPassword); // Calls the store function
      toast.success("Password reset! Please log in.");
      navigate('/login'); // Send user to login page on success
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };

  // Helper to render the correct form based on the current stage
  const renderFormStage = () => {
    switch (stage) {
      // --- STAGE 1: REQUEST OTP ---
      case 'request':
        return (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <motion.h1 className="text-3xl font-bold mb-6 text-center" variants={itemVariants}>
              Reset Password
            </motion.h1>
            <motion.p className="text-sm text-gray-400 text-center -mt-4 mb-4" variants={itemVariants}>
              Enter your email to receive a verification code.
            </motion.p>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Email Address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 disabled:bg-gray-700">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </motion.div>
          </form>
        );

      // --- STAGE 2: VERIFY OTP ---
      case 'verify':
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <motion.h1 className="text-3xl font-bold mb-6 text-center" variants={itemVariants}>
              Check Your Email
            </motion.h1>
            <motion.p className="text-sm text-gray-400 text-center -mt-4 mb-4" variants={itemVariants}>
              We sent a 6-digit code to <strong>{email}</strong>.
            </motion.p>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Verification OTP</label>
              <input
                type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required
                className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 disabled:bg-gray-700">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </motion.div>
          </form>
        );

      // --- STAGE 3: SUBMIT NEW PASSWORD ---
      case 'submit':
        return (
          <form onSubmit={handleSubmitNewPassword} className="space-y-6">
            <motion.h1 className="text-3xl font-bold mb-6 text-center" variants={itemVariants}>
              Set New Password
            </motion.h1>
            <motion.p className="text-sm text-gray-400 text-center -mt-4 mb-4" variants={itemVariants}>
              OTP verified! Please enter your new password.
            </motion.p>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12"
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-400">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 disabled:bg-gray-700">
                {loading ? 'Saving...' : 'Reset Password'}
              </button>
            </motion.div>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#080808] text-white p-4 font-[Inter] overflow-hidden">
      {/* Background and glow effects */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `radial-gradient(#ffffff22 1px, transparent 1px)`, backgroundSize: `20px 20px` }} />
      <div className="pointer-events-none fixed inset-0 z-10 opacity-30" style={{ background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, #10b98144, transparent 80%)` }} />
      
      <motion.div
        className="relative z-20 w-full max-w-md p-8 rounded-xl shadow-2xl bg-gray-900/80 border border-gray-700 backdrop-blur-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={stage} // This makes the box re-animate when the stage changes
      >
        {renderFormStage()}
        <p className="mt-6 text-center text-sm text-gray-400">
          Remembered your password? <Link to="/login" className="text-emerald-500 hover:underline">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;