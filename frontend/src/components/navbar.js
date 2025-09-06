import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook
import img from "../Images/Logo.png";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth(); // Get state and functions from context
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Call logout from context
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `shackleton-text hover:text-red-500 transition duration-300 ${isActive ? "text-red-500" : "text-white"}`;

  return (
    <nav className='text-white fixed pt-2 bg-black/60 top-0 left-0 w-full z-30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Left: Logo */}
          <div className='flex-shrink-0'>
            <NavLink to="/">
              <img className='mt-3 w-32 h-auto' src={img} alt="Logo" />
            </NavLink>
          </div>

          {/* Center: Navigation links */}
          <div className='hidden md:flex flex-1 justify-center space-x-6 pr-16'>
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/events" className={linkClass}>Events</NavLink>
            <a 
              href="https://www.canva.com/design/DAGwh_R5TSU/W4J4znTlkBFdDEuNcG9Fmg/view?utm_content=DAGwh_R5TSU&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h5c71883586" 
              className="shackleton-text text-white hover:text-red-500 transition duration-300"
              target="_blank" rel="noopener noreferrer"
            >
              Brochure
            </a>
          </div>

          {/* Right: Login/Profile/Logout */}
          <div className='hidden md:flex items-center space-x-4'>
            {isAuthenticated ? (
              <>
                <NavLink to="/welcome" className={linkClass}>Profile</NavLink>
                <button 
                  onClick={handleLogout} 
                  className="shackleton-text text-white hover:text-red-500 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className={linkClass}>Login</NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button onClick={() => setIsOpen(!isOpen)} type='button' className='fill-gray-100 mt-2'>
              <svg viewBox="0 0 100 80" width="30" height="30">
                <rect width="100" height="15" rx="10"></rect>
                <rect y="30" width="100" height="15" rx="10"></rect>
                <rect y="60" width="100" height="15" rx="10"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='flex flex-col gap-y-2 md:hidden px-4 sm:px-6 pb-2 text-left'>
          <NavLink to="/" className={linkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/events" className={linkClass} onClick={() => setIsOpen(false)}>Events</NavLink>
          <a href="https://..." className="shackleton-text text-white hover:text-red-500" onClick={() => setIsOpen(false)}>Brochure</a>
          <hr className="border-gray-600 my-2" />
          {isAuthenticated ? (
            <>
              <NavLink to="/welcome" className={linkClass} onClick={() => setIsOpen(false)}>Profile</NavLink>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="shackleton-text text-white hover:text-red-500 text-left">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={linkClass} onClick={() => setIsOpen(false)}>Login</NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;