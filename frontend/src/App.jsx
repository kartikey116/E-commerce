import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Navbar from "./components/Navbar.jsx"
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
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={!user ? <Login/> : <Navigate to="/" />} />
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
