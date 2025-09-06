import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from "../Image/bg.png";
import { BASE_URL } from '../BaseUrl';
import RegistrationPromptModal from '../components/RegistrationPromptModal';

const SubEventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const subEvent = location.state?.subEvent;
  const activeEvent = location.state?.activeEvent;

  const [hasBasic, setHasBasic] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user's registration status when the component mounts
    axios.get(`${BASE_URL}/api/user/status`, { withCredentials: true })
      .then(response => {
        setHasBasic(response.data.hasBasicRegistration);
      })
      .catch(error => {
        console.error("Could not verify user status. Assuming not registered.", error);
        // User is likely not logged in, so they don't have basic registration
        setHasBasic(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleClick = () => {
    navigate('/events', { state: { activeEvent } });
  };

  const handleRegistrationClick = () => {
    if (isLoading) return; // Prevent clicks while loading

    if (!hasBasic) {
      // If user does not have basic registration, show the prompt modal
      setShowPrompt(true);
    } else {
      // If user has basic registration, navigate to the event registration form
      navigate('/registerevent', { state: { subEvent } });
    }
  };

  if (!subEvent) {
    return <p className="pt-40 text-center text-white">Error: No event data available.</p>;
  }

  return (
    <div
      className="relative w-full min-h-screen font-sans-serif text-white font-bold poppins"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Conditionally render the prompt modal */}
      {showPrompt && <RegistrationPromptModal onClose={() => setShowPrompt(false)} />}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* Page Content */}
      <div className="relative z-10 p-6">
        <div
          onClick={handleClick}
          style={{
            position: "fixed",
            top: "80px",
            left: "20px",
            padding: "20px",
            cursor: "pointer",
          }}
        >
          <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
            <path d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z" />
          </svg>
        </div>

        <div className="border-[#001f3f] bg-gray-600 mt-20 bg-opacity-65 border rounded-lg shadow-xl max-w-4xl mx-auto px-10 py-10">
          <h1 className="text-2xl md:text-4xl font-bold flex justify-center shackleton-text uppercase">{subEvent.title}</h1>

          {subEvent.image && (
            <div className="mx-auto flex justify-center mt-6 mb-6">
              <img
                src={subEvent.image}
                alt={subEvent.title}
                className="w-[70%] md:w-[50%] h-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {subEvent.tagline && (
            <p className="mt-4 text-xl md:text-2xl mb-2">{subEvent.tagline}</p>
          )}

          <p className="my-4 text-lg md:text-xl">{subEvent.description}</p>

          {subEvent.teamSize && (
            <p className="mt-2 text-md md:text-lg">
              Team Size: {subEvent.teamSize}
            </p>
          )}

          {(subEvent.contact1 || subEvent.contact2 || subEvent.contact3) && (
            <p className="mt-2 text-md md:text-lg">
              Contact: {subEvent.contact1} {subEvent.contact2} {subEvent.contact3}
            </p>
          )}

          {subEvent.date && (
            <p className="mt-2 text-md md:text-lg">Date: {subEvent.date}</p>
          )}
          {subEvent.time && (
            <p className="mt-2 text-md md:text-lg">Time: {subEvent.time}</p>
          )}
          {subEvent.venue && (
            <p className="mt-2 text-md md:text-lg">Venue: {subEvent.venue}</p>
          )}

          <p className="mt-2 text-md md:text-lg">
            Fees: {subEvent.registrationFees}
          </p>

          {subEvent.rulebook && (
            <a
              href={subEvent.rulebook}
              className="text-rose-700 hover:underline mt-6 block"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Rulebook (PDF)
            </a>
          )}

          {/* UPDATED REGISTRATION BUTTON */}
          <button
            onClick={handleRegistrationClick}
            disabled={isLoading}
            className="block bg-[#001f3f] hover:bg-gradient-to-t from-blue-800 via-blue-500 to-navy-700 text-white mt-4 py-2 px-4 rounded text-md md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Checking Status..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubEventDetails;