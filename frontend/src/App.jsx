import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Navbar from "./components/Navbar.jsx"


function App() {
 
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </>
  )
}

export default App
