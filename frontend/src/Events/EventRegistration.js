import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../BaseUrl";
import { useAuth } from "../components/AuthContext";
import bgImage from "../Image/bg.png";

const EventRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { subEvent, activeEvent, action } = location.state || {};

  const [teamSize, setTeamSize] = useState(1);
  const [fees, setFees] = useState("");
  const [teamLeaderGender, setTeamLeaderGender] = useState('');
  const [teamLeader, setTeamLeader] = useState({
    name: '',
    mobile: '',
    email: '',
    college: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!subEvent) {
      console.log("No subEvent found, redirecting to /events");
      navigate('/events');
    } else {
      const initialSize = subEvent.minteamSize || 1;
      setTeamSize(initialSize);
      if (user) {
        setTeamLeader(prev => ({ ...prev, name: user.name, email: user.email }));
      }
      calculateFees(initialSize, '');
    }
  }, [subEvent, user, navigate]);

  const calculateFees = (size, gender) => {
    if (subEvent?.fees) {
      const { perTeam, perPerson, singleBoy, singleGirl, Couple, Solo, Duet, perhead, groupTeam, lonewolves, twolonewolves, threelonewolves } = subEvent.fees;
      let calculatedFee = "Not Applicable";
      if (perTeam && perPerson) { calculatedFee = (size === 1 ? perPerson : perTeam); }
      else if (perTeam) { calculatedFee = perTeam; }
      else if (perPerson) { calculatedFee = size * perPerson; }
      else if (singleBoy && singleGirl && Couple) {
        if (size === 1 && gender === "Male") { calculatedFee = singleBoy; }
        else if (size === 1 && gender === "Female") { calculatedFee = singleGirl; }
        else if (size === 2) { calculatedFee = Couple; }
      } else if (Solo && Duet && groupTeam) {
        if (size === 1) { calculatedFee = Solo; }
        else if (size === 2) { calculatedFee = Duet; }
        else { calculatedFee = groupTeam; }
      } else if (Solo && Duet && perhead) {
        if (size === 1) { calculatedFee = Solo; }
        else if (size === 2) { calculatedFee = Duet; }
        else { calculatedFee = size * perhead; }
      } else if (Solo && Duet) {
        if (size === 1) { calculatedFee = Solo; }
        else if (size === 2) { calculatedFee = Duet; }
      } else if (lonewolves && twolonewolves && threelonewolves) {
        if (size === 1) { calculatedFee = lonewolves; }
        else if (size === 2) { calculatedFee = twolonewolves; }
        else if (size === 3) { calculatedFee = threelonewolves; }
      }
      setFees(calculatedFee);
    }
  };

  const handleTeamLeaderChange = (e) => {
    const { name, value } = e.target;
    setTeamLeader(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e) => {
    const gender = e.target.value;
    setTeamLeaderGender(gender);
    calculateFees(teamSize, gender);
  };

  const checkoutHandler = async (amount, registrationId) => {
    setIsLoading(true);
    try {
      const { data: { key } } = await axios.get(`${BASE_URL}/api/getkey`);
      const { data: { order } } = await axios.post(`${BASE_URL}/api/checkout`, {
        amount,
        paymentFor: 'Event',
        relatedId: registrationId
      }, { withCredentials: true });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: `Pyrexia: ${subEvent.title}`,
        description: "Event Registration Payment",
        order_id: order.id,
        callback_url: `${BASE_URL}/api/paymentverification`,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#001f3f" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const registrationData = {
      eventName: subEvent.title,
      teamLeaderName: teamLeader.name,
      teamLeaderMobileNo: teamLeader.mobile,
      teamLeaderEmail: teamLeader.email,
      teamLeaderCollege: teamLeader.college,
      teamSize,
      teamLeaderGender,
      fees
    };

    try {
      const response = await axios.post(`${BASE_URL}/registerevent`, registrationData, { withCredentials: true });

      if (response.data.success) {
        const newRegistration = response.data.registration;

        if (action === 'register') {
          alert("Proceeding to payment...");
          checkoutHandler(newRegistration.fees, newRegistration._id);
        } else {
          alert("Event added to cart successfully!");
          navigate('/cart');
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'An error occurred. Please ensure you are logged in and have completed Basic Registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/events', { state: { events: activeEvent } });
  };

  if (!subEvent) {
    return (
      <div className="relative min-h-screen bg-fixed bg-center bg-cover flex items-center justify-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <p className="text-white text-2xl z-10">Loading Event...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-fixed bg-center bg-cover flex items-center justify-center py-24 px-4" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-2xl w-full">
        <div className="absolute top-8 left-4 cursor-pointer" onClick={handleGoBack}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center shackleton-text text-[#ebe6d0]">Register for {subEvent.title}</h2>
        <p className="text-center text-gray-300 mb-6">Fill in your team's details below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Team Leader Name</label>
              <input type="text" name="name" value={teamLeader.name} onChange={handleTeamLeaderChange} className="w-full bg-black/20 border border-gray-600 text-white p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Team Leader Mobile</label>
              <input type="tel" name="mobile" value={teamLeader.mobile} onChange={handleTeamLeaderChange} className="w-full bg-black/20 border border-gray-600 text-white p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">College</label>
            <input type="text" name="college" value={teamLeader.college} onChange={handleTeamLeaderChange} className="w-full bg-black/20 border border-gray-600 text-white p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Team Leader Email</label>
            <input type="email" name="email" value={teamLeader.email} readOnly className="w-full bg-black/40 border border-gray-700 text-gray-400 p-2 rounded cursor-not-allowed" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mobile friendly team size controls */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Team Size</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    if (teamSize > subEvent.minteamSize) {
                      setTeamSize(prev => {
                        const newSize = prev - 1;
                        calculateFees(newSize, teamLeaderGender);
                        return newSize;
                      });
                    }
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg"
                >
                  −
                </button>

                <input
                  type="number"
                  value={teamSize}
                  onChange={() => { }} // disables manual typing, but keeps numeric format
                  className="w-16 text-center bg-black/20 border border-gray-600 text-white p-2 rounded"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (teamSize < subEvent.maxteamSize) {
                      setTeamSize(prev => {
                        const newSize = prev + 1;
                        calculateFees(newSize, teamLeaderGender);
                        return newSize;
                      });
                    }
                  }}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg"
                >
                  +
                </button>
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Gender</label>
              <select value={teamLeaderGender} onChange={handleGenderChange} className="w-full bg-black border border-gray-600 text-white p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="pt-4 text-center">
            <label className="block text-gray-300 font-bold mb-1">Total Registration Fees:</label>
            <div className="text-2xl font-bold text-yellow-400">{fees ? `₹${fees}` : "..."}</div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white p-3 mt-4 rounded-lg hover:bg-blue-700 font-bold transition duration-300 disabled:bg-gray-500 disabled:cursor-wait">
              {isLoading ? 'Processing...' : (action === 'register' ? 'Proceed to Payment' : 'Add to Cart')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistration;
