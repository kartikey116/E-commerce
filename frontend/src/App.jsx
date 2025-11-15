import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Navbar from "./components/Navbar.jsx"
import ForgotPassword from "./Pages/ForgetPassword.jsx";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.js";
import { useEffect } from "react";
import AdminPage from "./Pages/AdminPage.jsx";
import CategoryPage from "./Pages/CategoryPage.jsx";
import CartPage from "./Pages/CartPage.jsx";
import { useCartStore } from "./stores/useCartStore.js";

function App() {
  const {user , checkAuth } = useUserStore();
  const {getCartItems} = useCartStore();

  useEffect(() => {
    checkAuth();
  },[checkAuth]);

  useEffect(() => {
    getCartItems();
  },[getCartItems]); 
 
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={!user ? <SignUp/> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <Login/> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/secret-dashboard" element={user?.role?.toLowerCase() === "admin" ? <AdminPage /> : <Navigate to="/login"/>}/>

        <Route path="/category/:category" element={<CategoryPage/>}/>

        <Route path="/cart" element={user ? <CartPage/> : <Navigate to="/login"/>}/>

      </Routes>
      <Toaster/>
    </>
  )
}

export default App
