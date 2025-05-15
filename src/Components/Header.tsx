import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../services/loginApiSlice";


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async() => {
    localStorage.removeItem("AuthToken");
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
          <svg 
            className="w-8 h-8" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M4 4H20V16H4V4Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle 
              cx="7" 
              cy="18" 
              r="2" 
              stroke="currentColor" 
              strokeWidth="2" 
            />
            <circle 
              cx="17" 
              cy="18" 
              r="2" 
              stroke="currentColor" 
              strokeWidth="2" 
            />
            <path 
              d="M4 10H20" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            <path 
              d="M12 2L14 4H10L12 2Z" 
              fill="currentColor"
            />
            <path 
              d="M12 6V10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>

            <h1 className="text-2xl font-bold">GoHyper - Bus Boking System</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="font-medium hover:text-blue-100 transition-colors">Home</a>
            {/* <a href="#" className="font-medium hover:text-blue-100 transition-colors">Search</a> */}
            <a href="/bookings" className="font-medium hover:text-blue-100 transition-colors">My Bookings</a>
            {/* <a href="#" className="font-medium hover:text-blue-100 transition-colors">Support</a> */}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="hover:text-blue-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a>
            <button 
             onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
              Logout
            </button>
          </div>

          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3 pb-3">
            <a href="#" className="block hover:bg-blue-600 px-3 py-2 rounded-md">Home</a>
            <a href="#" className="block hover:bg-blue-600 px-3 py-2 rounded-md">Search</a>
            <a href="#" className="block hover:bg-blue-600 px-3 py-2 rounded-md">My Bookings</a>
            <a href="#" className="block hover:bg-blue-600 px-3 py-2 rounded-md">Support</a>
            <a href="#" className="block hover:bg-blue-600 px-3 py-2 rounded-md">Profile</a>
            <button className="w-full bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
              Login / Register
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;