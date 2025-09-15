import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  cart: [],

  // This function's name is now changed to 'verifyEmail'
  verifyEmail: async (email) => {
    set({ loading: true });
    try {
      console.log("api selectCalculatedXAxisPadding...");
      await axios.post("/auth/request-otp", {
        email: email,
        purpose: "verify",
      });
      toast.success("OTP sent to your email!");
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
      await axios.post("/auth/verify-otp", { email, otp, purpose: "verify" });
      toast.success("OTP verified successfully!");
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
      toast.error("Passwords do not match!");
      set({ loading: false });
      return;
    }

    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
        otp,
      });
      set({ user: res.data, loading: false });
      toast.success("Signup successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.message ||
          "An error occurred. Please try again later."
      );
      throw error;
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      console.log("api selectCalculatedXAxisPadding...");
      const res = await axios.post("/auth/login", { email, password });
      console.log(res.data);
      set({ user: res.data, loading: false });
      console.log(res.data);
      toast.success("Login successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post("/auth/logout");
      set({ user: null, loading: false });
      toast.success("Logged out successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "Logout failed.");
    }
  },

  refreshToken: async () => {
    //Prevent multiple simultaneous refresh attempts

    if (get().checkingAuth) return; // If true, it means a refresh request is already running, so return early.

    set({ checkingAuth: true }); // prevent duplicate refresh calls

    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false, user: response.data });//Marks checkingAuth as false (refresh finished).Updates user in state with the new data from backend.
      toast.success("Token refreshed successfully!");
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      toast.error("Failed to refresh token!");
      console.log(error);
    }
  },
}));

// Axios interceptors for token refresh

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config.__isRetryRequest
    ) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // start a new refresh promise
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;
        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// What refreshToken does
// It contacts the backend (/auth/refresh-token) to get a new access token (and possibly user data).
// It updates your store state (user, checkingAuth).
// It returns the new token/user so the app can continue.
// Basically → refreshToken is the tool that knows how to refresh tokens.

//What the Axios Response Interceptor does
// It watches all responses from the server.
// If a request fails with 401 Unauthorized, it means the access token is expired or invalid.
// Instead of instantly logging out, it calls the refresh mechanism (refreshToken) to try fixing the problem.
// Once refresh succeeds → it retries the original request.
// If refresh fails → it logs the user out.
// So the interceptor is like a gatekeeper for expired tokens.

// The Connection
// The interceptor doesn’t refresh tokens by itself — it delegates to the store’s refreshToken.
// That’s why you see this line:
// refreshPromise = useUserStore.getState().refreshToken();
// This means:
// ➡️ “Hey, my access token failed. Let me ask the refreshToken function to fix it for me.”
// Once refreshToken resolves successfully, the interceptor retries the failed request with the new access token.

// refreshToken = the mechanic who can repair/replace your expired access token.
// Interceptor = the security guard who detects when your access token is broken, and calls the mechanic to fix it before letting you continue.