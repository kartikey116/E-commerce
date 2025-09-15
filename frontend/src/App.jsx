import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Navbar from "./components/Navbar.jsx"
import ForgotPassword from "./Pages/ForgetPassword.jsx";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.js";
import { useEffect } from "react";

function App() {
  const {user , checkAuth} = useUserStore();

  useEffect(() => {
    checkAuth();
  },[checkAuth])
 
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={!user ? <SignUp/> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <Login/> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
