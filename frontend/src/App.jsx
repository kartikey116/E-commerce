import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Navbar from "./components/Navbar.jsx"
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.js";

function App() {
  const { user } = useUserStore();
 
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={user ? <HomePage/> : <Login/>} />
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
