import { create } from 'zustand';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    // This function's name is now changed to 'verifyEmail'
    verifyEmail: async (email) => {
        set({ loading: true });
        try {
            Consolle.log("api selectCalculatedXAxisPadding...");
            await axios.post('/auth/request-otp', { email });
            toast.success('OTP sent to your email!');
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to send OTP.");
            throw error;
        }
    },
    verifyOTP: async (email, otp) => {
        set({ loading: true });
        try {
            await axios.post('/auth/verify-otp', { email, otp });
            toast.success('OTP verified successfully!');
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "OTP verification failed.");
            throw error;
        }
    },

    // Updated signup function to handle the final verification
    signup: async ({ name, email, password, confirmPassword, otp }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            set({ loading: false });
            return;
        }

        try {
            const res = await axios.post('/auth/signup', { name, email, password, otp });
            set({ user: res.data, loading: false });
            toast.success('Signup successful!');
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "An error occurred. Please try again later.");
            throw error;
        }
    },

    login: async ({ email, password }) => {
        set({ loading: true });
        try {
            console.log("api selectCalculatedXAxisPadding...");
            const res = await axios.post('/auth/login', { email, password });
            console.log(res.data);
            set({ user: res.data, loading: false });
            console.log(res.data);
            toast.success('Login successful!');
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "An error occurred. Please try again later.");
        }
    },

    checkAuth: async () => {
        set({ loading: true });
        try {
            const res = await axios.get('/auth/profile');
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            console.log(error.message);
			set({ checkingAuth: false, user: null });
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            await axios.post('/auth/logout');
            set({ user: null, loading: false });
            toast.success('Logged out successfully!');
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Logout failed.");
        }
    },
}));