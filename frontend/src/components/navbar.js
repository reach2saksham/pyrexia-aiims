import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import img from "../Images/Logo.png";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios.get('https://pyrexia-backend.onrender.com/login/success', { withCredentials: true })
      .then(response => {
        if (response?.data?.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogout = () => {
    axios.get('https://pyrexia-backend.onrender.com/logout', { withCredentials: true })
      .then(response => {
        if (response?.data?.success) {
          setIsLoggedIn(false);
          navigate("/");
        }
      })
      .catch(error => {
        console.error("Error during logout:", error);
      });
  };

  const linkClass = ({ isActive }) =>
    `shackleton-text hover:text-red-500 transition duration-300 ${isActive ? "text-red-500" : "text-white"} transition duration-300`;

  return (
    <nav className=' text-white fixed pt-2 bg-black/60 top-0 left-0 w-full z-30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>

          {/* Left: Logo */}
          <div className='flex-shrink-0'>
            <img className='mt-3 w-32 h-auto autoload' src={img} alt="Logo" />
          </div>

          {/* Center: Navigation links */}
          <div className='hidden md:flex flex-1 justify-center space-x-6 pr-16'>
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/events" className={linkClass} >Events</NavLink>
            {/* <NavLink to="/starnight" className={linkClass}>Star Night</NavLink> */}
            <a 
              href="https://www.canva.com/design/DAGwh_R5TSU/W4J4znTlkBFdDEuNcG9Fmg/view?utm_content=DAGwh_R5TSU&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h5c71883586" 
              className="shackleton-text text-white hover:text-red-500 transition duration-300"
            >
              Brochure
            </a>
            {/* <NavLink to="/schedule" className={linkClass}>Schedule</NavLink> */}
          </div>

          {/* Right: Login/Logout */}
          <div className='hidden md:flex items-center'>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="shackleton-text text-white hover:text-red-500 transition duration-300"
              >
                Logout
              </button>
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
        <div className='flex flex-col gap-y-2 md:hidden px-4 sm:px-6 pb-2'>
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/events" className={linkClass}>Events</NavLink>
          {/* <NavLink to="/starnight" className={linkClass}>Star Night</NavLink> */}
          <a 
            href="https://drive.google.com/file/d/12CP4PlhrVhJ4Hi_NVYIhn5B-wWi2q3kr/view?usp=drive_link" 
            className="shackleton-text text-white hover:text-red-500 transition duration-300"
          >
            Brochure
          </a>
          {/* <NavLink to="/schedule" className={linkClass}>Schedule</NavLink> */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="shackleton-text text-white hover:text-red-500 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
