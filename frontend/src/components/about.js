import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import aboutbg from "../Images/aboutbg.png";
gsap.registerPlugin(ScrollTrigger);

const About = () => {
    useEffect(() => {
        // GSAP animation with ScrollTrigger
        gsap.fromTo(
            '.fade-in',
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.3,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.fade-in-container',
                    start: 'top 180%',
                    end: 'bottom top',
                    scrub: true,
                },
            }
        );
    }, []);

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center text-white text-center">
      {/* Background Image */}
      <div
        className="absolute rounded-3xl mx-8 inset-0 mt-24 -z-20 bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(${aboutbg})` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="shackleton-text text-4xl md:text-6xl font-bold mb-8 text-[#c60710]">
          ABOUT
        </h1>

        {/* Subtitle */}
        <p className="flex flex-wrap px-12 text-lg md:text-xl text-gray-200">
          The fifth and most epic edition of PYREXIA is here! A full week packed with everything you can think of – dance, music, drama, sports, art, literary battles, informal games, Mr. & Ms. PYREXIA, and the much awaited star nights.
        </p>
        <p className="flex flex-wrap px-12 text-lg md:text-xl text-gray-200 mt-12">
          From high-energy competitions to crazy fun nights, there’s something for everyone. Whether you’re performing on stage, showing off your skills on the field, or just vibing with your people, PYREXIA is where all the action happens.

        </p>

        {/* Footer Note */}
        <p className="mt-8 text-gray-300 px-12 italic text-sm md:text-lg">
          So mark your calendars 8th to 12th October – one of India’s biggest medical fests is calling. Are you ready to feel the fever?
        </p>
      </div>
    </div>
    );
};

export default About;
