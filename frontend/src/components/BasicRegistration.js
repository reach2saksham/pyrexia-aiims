import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../BaseUrl';
import { useAuth } from './AuthContext'; // We'll use this to get user info

const BasicRegistration = () => {
  document.title = "Basic Registration | Pyrexia 2025";
  const { user } = useAuth(); // Get the currently logged-in user's details
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      alert("Please log in again to proceed with the payment.");
      return;
    }
    setIsLoading(true);

    try {
      const amount = 249; // The fixed amount for Basic Registration

      // Step 1: Get the Razorpay Key from our backend
      const { data: { key } } = await axios.get(`${BASE_URL}/api/getkey`);

      // Step 2: Create a checkout order on our backend.
      // This is a secure step that happens on the server.
      const { data: { order } } = await axios.post(
        `${BASE_URL}/api/checkout`, 
        { 
            amount, 
            paymentFor: 'BasicRegistration' // This tells the backend what is being purchased
        },
        { withCredentials: true } // This is crucial for sending the user's session cookie
      );

      // Step 3: Configure the Razorpay payment modal with data from our backend
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Pyrexia Basic Registration",
        description: "Mandatory Fest Entry Pass",
        image: "/Logo.png", // Make sure you have a logo in your public folder
        order_id: order.id, // This is the critical link to our backend order
        callback_url: `${BASE_URL}/api/paymentverification`,
        prefill: {
          name: user.name,
          email: user.email,
          // You can add a contact number if you collect it
        },
        notes: {
          purchase_type: "Basic Registration"
        },
        theme: {
          color: "#001f3f",
        },
      };

      // Step 4: Open the Razorpay payment window
      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error("Payment Initialization Error:", error);
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again to complete the purchase.");
      } else {
        alert("Could not initiate payment. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-black min-h-screen text-white'>
      {/* Header Section */}
      <div className="relative pt-28 pb-16 flex items-center justify-center">
        <h1 className="text-[#ebe6d0] text-center text-[3.5rem] font-semibold leading-[4.5rem] z-10 md:text-[3.7rem] md:px-12 md:leading-[3.5rem] shackleton-text uppercase">
          Basic Registration
        </h1>
      </div>

      {/* Content Section */}
      <div className="pb-20 flex relative items-center justify-center">
        <div className="backdrop-blur-sm rounded-xl m-auto h-fit p-6 lg:px-10 max-w-4xl">
          <div className="px-4 md:px-10 lg:px-10 text-lg font-light text-justify border pt-10 pb-10 rounded-lg">
            <p className="mb-4">
              1. This is **mandatory** for entry into AIIMS Rishikesh premises during the fest.
            </p>
            <p className="mb-4">
              2. It serves as your official identification, ensuring seamless entry and participation in non-paid events.
            </p>
            <p className="mb-4">
              3. This pass is a prerequisite for purchasing a Membership Card or registering for any specific events.
            </p>
            <p className="font-bold text-xl text-[#ebe6d0] mt-6">Cost: ₹249</p>
          </div>

          {/* Register Button */}
          <div className="flex justify-center items-center mt-10">
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="bg-[#ebe6d0] text-black px-8 py-3 rounded-lg font-bold text-lg border-black hover:bg-[#d9d2b8] transition duration-300 disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading ? "Processing..." : "Register and Pay ₹249"}
            </button>
          </div>

          {/* Decorative Dots */}
          <div className="flex items-center justify-center gap-3 pt-16 pb-16">
            <div className="h-3 w-3 bg-[#ebe6d0] rotate-45"></div>
            <div className="h-3 w-3 bg-[#ebe6d0] rotate-45"></div>
            <div className="h-3 w-3 bg-[#ebe6d0] rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicRegistration;