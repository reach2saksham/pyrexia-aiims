import React, { useState, useEffect } from "react";
import countdownBg from "../Image/countdown-bg.png";          // 🔹 your background image

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-10-08T00:00:00");
    const now = new Date();
    const difference = targetDate - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center text-white text-center px-6">
      {/* Background Image */}
      <div
        className="absolute m-8 rounded-2xl inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: `url(${countdownBg})` }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* Brush Stroke Frame Overlay */}
      {/* <img
        src={brushFrame}
        alt="brush frame"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-5"
      /> */}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="shackleton-text text-4xl md:text-6xl font-bold mb-6">
          PYREXIA 2025 RETURNS IN
        </h1>

        {/* Subtitle */}
        <p className="flex flex-wrap px-12 text-lg md:text-xl text-gray-200 mb-10">
          Fiery sparks, horizons trembling, midst echoes vast. Gathered rivers, a flame of song ascends, voices rise, beating hearts awaken. Five nights, unbound. Upon mountains shadow, lights burn, a revel born. Dominion of rhythm, contests fierce, spirits soaring. Pyrexia, called forth.
        </p>

        {/* Timer Block */}
        <div className="inline-flex gap-10 px-10 py-6 bg-black/80 rounded-lg">
          {["days", "hours", "minutes", "seconds"].map((unit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-extrabold">
                {timeLeft[unit] || "0"}
              </span>
              <span className="uppercase text-sm md:text-base text-gray-300 mt-1">
                {unit}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-gray-300 italic text-sm md:text-lg">
          Get ready to celebrate the biggest event of the year!
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
