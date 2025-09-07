import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./login.css";
import { BASE_URL } from '../BaseUrl';
import bgImage from "../Image/bg.png";
import signinbutton from "../Image/oauth.png";

// Configure axios to always include credentials
axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/login/success`);
        if (response.data.success) {
          navigate('/welcome');
        }
      } catch (error) {
        // User not authenticated, stay on login page
        console.log('User not authenticated');
      }
    };

    checkAuthStatus();
  }, [navigate]);

  // Handle URL parameters (for OAuth callback success/error)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const error = urlParams.get('error');

    if (authStatus === 'success') {
      // OAuth login successful, check auth status
      setTimeout(() => {
        window.location.href = '/welcome';
      }, 1000);
    } else if (error === 'auth_failed') {
      alert('Google authentication failed. Please try again.');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loginWithGoogle = () => {
    // For Safari/iOS compatibility, try different approaches
    const userAgent = navigator.userAgent;
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);

    if (isSafari || isIOS) {
      // For Safari/iOS, use window.location instead of window.open
      window.location.href = `${BASE_URL}/auth/google/`;
    } else {
      // For other browsers, use the original method
      window.open(`${BASE_URL}/auth/google/`, "_self");
    }
  };

  return (
    <div 
      className="relative min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pb-20">
        <h1 className="text-6xl lg:text-7xl font-shackleton font-semibold text-[#ebe6d0] uppercase my-8 text-center">
          Login
        </h1>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
          <button 
            onClick={loginWithGoogle}
            className="px-6 pt-2 rounded-lg font-medium hover:invert transition duration-300 hover:scale-105"
          >
            <img
              src={signinbutton}
              alt="Sign in with Google"
              className="w-48 md:w-60"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;