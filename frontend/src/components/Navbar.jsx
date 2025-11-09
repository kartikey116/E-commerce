import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore.js";
import { useState } from "react";

const Navbar = () => {
  const { user, cart, logout } = useUserStore();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-emerald-400 flex items-center space-x-2"
          onClick={closeMenu}
        >
          {/* <img src="./shop.png" alt="logo" className="h-8 w-8 rounded-full border border-white" /> */}
          <span>ShopEase</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="text-gray-300 hover:text-emerald-400 focus:outline-none md:hidden"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          <Link to="/" className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
            Home
          </Link>

          {user && (
            <Link
              to="/cart"
              className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span
                  className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
                  text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                >
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
              transition duration-300 ease-in-out flex items-center"
            >
              <Lock className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
              rounded-md flex items-center transition duration-300 ease-in-out"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Log Out</span>
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
                rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <UserPlus className="mr-2" size={18} />
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
                rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogIn className="mr-2" size={18} />
                Login
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div
          className="md:hidden bg-gray-800 border-t border-emerald-700 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col space-y-3 px-4 py-4">
            <Link to="/" onClick={closeMenu} className="text-gray-300 hover:text-emerald-400">
              Home
            </Link>

            {user && (
              <Link
                to="/cart"
                onClick={closeMenu}
                className="text-gray-300 hover:text-emerald-400 flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                Cart ({cart.length})
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/secret-dashboard"
                onClick={closeMenu}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-md flex items-center"
              >
                <Lock className="mr-2" size={18} /> Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
                rounded-md flex items-center justify-center transition duration-300 ease-in-out"
              >
                <LogOut className="mr-2" size={18} /> Log Out
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
                  rounded-md flex items-center justify-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} /> Sign Up
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
                  rounded-md flex items-center justify-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} /> Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
