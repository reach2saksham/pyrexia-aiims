import React, { useRef } from "react";
import EventSchedule from "./EventSchedule.js";
import Footer from "./footer";
import video1 from '../Images/Trailer Clip.mp4';
import video2 from '../Images/herovideonew.mp4';
import { useNavigate } from 'react-router-dom';
import Slider1 from "../Animation/slider.js";
import CountdownTimer from './timer';
import About from './about';
import HomeEvent from './HomeEvent';
import HomeEvent2 from './HomeEvent2';
import LeftVideoAnimation from '../Animation/LeftVideoAnimation.js';
import FAQ from './FAQ.js';
import heroBg from "../Image/bg.png"; // 🔹 add your background image
import basicregisterbuttonImg from "../Image/basicregisteration-button.png";
import eventregisterbuttonImg from "../Image/eventregisteration-button.png";
import membershipcardbuttonImg from "../Image/membershipcardbutton.png";
import accomodationbuttonImg from "../Image/accomodation.png";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate1 = () => {
    navigate('/basic-registration');
  };
  const handleNavigate2 = () => {
    navigate('/events');
  };
  const handleNavigate3 = () => {
    navigate('/membership-card');
  };

  const scheduleRef = useRef(null);

  const scrollToSchedule = () => {
    scheduleRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* 🔹 Background Image (full screen but not blocking scroll) */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center -z-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      ></div>

      {/* 🔹 Black Overlay */}
      <div className="fixed inset-0 bg-black opacity-70 -z-10"></div>

      {/* 🔹 Page Content (scrollable) */}
      <div className="relative z-10 font-sans-serif poppins">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center text-white text-center px-6 md:px-12 lg:px-20 space-y-8">
          {/* Heading */}
          <h1 className="shackleton-text text-4xl md:text-6xl pt-28 font-bold">
            PYREXIA AWAITS
          </h1>

          {/* Video */}
          <div className="w-[80%] h-[50vh] max-w-4xl mx-auto">
            <video
              src={video2}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-xl shadow-lg w-full h-full object-cover"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button
              className="hover:invert transition duration-300 hover:scale-105"
              onClick={handleNavigate1}
            >
              <img
                src={basicregisterbuttonImg}
                alt="Basic Registration"
                className="w-48 md:w-60"
              />
            </button>
            <button
              className="hover:invert transition duration-300 hover:scale-105"
              onClick={handleNavigate3}
            >
              <img
                src={membershipcardbuttonImg}
                alt="Event Registration"
                className="w-48 md:w-60"
              />
            </button>

            <a  href="/accomodation">
              <img
                src={accomodationbuttonImg}
                alt="Event Registration"
                className="w-48 md:w-60 hover:invert transition duration-300 hover:scale-105"
              />
            </a>

            <button
              className="hover:invert transition duration-300 hover:scale-105"
              onClick={handleNavigate2}
            >
              <img
                src={eventregisterbuttonImg}
                alt="Event Registration"
                className="w-48 md:w-60"
              />
            </button>
          </div>
        </section>




        {/* Countdown Timer */}
        <div className='justify-center'>
          <CountdownTimer />
        </div>

        {/* Other Components */}
        <div><HomeEvent /></div>
        <div><About /></div>
        {/* <div><HomeEvent2 /></div> */}

        <div className='bg-black/60 mx-12 rounded-2xl my-2'> <FAQ /></div>
        <div ref={scheduleRef} id="event-schedule"> <EventSchedule /></div>

        <div className='relative z-10 bg-gradient-to-b  pt-10 pb-16'>
          <Slider1 />
        </div>

        {/* Footer */}
        <div className="bg-black/80" onScheduleClick={scrollToSchedule}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
