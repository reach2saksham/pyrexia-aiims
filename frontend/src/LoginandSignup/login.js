import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./login.css";
import { BASE_URL } from '../BaseUrl';
import bgImage from "../Image/bg.png"; // adjust path to your image
import signinbutton from "../Image/oauth.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      alert(response.data.message);
      if (response.data.success) {
        navigate('/'); 
      }
    } catch (err) {
      alert(err.response?.data?.error || 'An error occurred');
    }
  };

  const loginWithGoogle = () => {
    window.open(`${BASE_URL}/auth/google/`, "_self");
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
        <h1 className="text-6xl lg:text-7xl font-shackleton  font-semibold text-[#ebe6d0] uppercase my-8 text-center">
          Login
        </h1>

        <div className=" bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
          <button 
            onClick={loginWithGoogle}
            className="px-6 pt-2 rounded-lg font-medium hover:invert transition duration-300 hover:scale-105"
          >
            <img
                src={signinbutton}
                alt="Event Registration"
                className="w-48 md:w-60"
              />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
