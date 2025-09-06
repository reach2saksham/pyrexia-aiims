import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { BASE_URL } from '../BaseUrl';

import RegistrationPromptModal from './RegistrationPromptModal'; // Import the modal



const MembershipCard = () => {
  document.title = "Registration | Pyrexia 2025"; // Set page title
  const [hasBasic, setHasBasic] = useState(false);

    const [showPrompt, setShowPrompt] = useState(false);

    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {

        axios.get(`${BASE_URL}/api/user/status`, { withCredentials: true })

            .then(response => {

                setHasBasic(response.data.hasBasicRegistration);

                setIsLoading(false);

            })

            .catch(() => setIsLoading(false)); // Handle error, assume no basic registration

    }, []);

    const handlePayment = async () => {

        if (isLoading) return;

         if (!hasBasic) {

            setShowPrompt(true);

            return;

        }
        try {

            const amount = 1800; // Amount for Membership Card

            const { data: { key } } = await axios.get(`${BASE_URL}/api/getkey`);

            const { data: { order } } = await axios.post(`${BASE_URL}/api/checkout`,

                { amount, paymentFor: 'MembershipCard' },

                { withCredentials: true }

            );
            const options = {

                key,

                amount: order.amount,

                currency: "INR",

                name: "Pyrexia Membership Card",

                description: "Access to Pronites",

                order_id: order.id,

                callback_url: `${BASE_URL}/api/paymentverification`,

                theme: { color: "#001f3f" },

            };

            const razor = new window.Razorpay(options);

            razor.open();

        } catch (error) {

            console.error("Payment Error:", error);

            alert("Payment failed. Please ensure you are logged in and try again.");

        }

    };

  return (
    <div className='bg-black min-h-screen'>
      {showPrompt && <RegistrationPromptModal onClose={() => setShowPrompt(false)} />}
      {/* Header Section */}
      <div className="relative pt-28 pb-16 flex items-center justify-center">
        <h1 className="text-[#ebe6d0] text-center text-[3.5rem] font-semibold leading-[4.5rem] z-10 md:text-[3.7rem] md:px-12 md:leading-[3.5rem] shackleton-text  uppercase">
          PYREXIA MEMBERSHIP CARD
        </h1>
      </div>

      {/* Content Section */}
      <div className=" pb-20 flex relative items-center justify-center text-white">
        <div className="backdrop-blur-sm rounded-xl  m-auto h-fit p-6 m-auto lg:px-10">
          <div className="px-4 md:px-10 lg:px-10 text-lg font-light text-justify max-w-4xl border rounded-lg pt-10  pb-10">
           < p className="font-bold text-2xl pb-4 text-[#ebe6d0]">Membership Benefits:</p>
            <p className="mb-4">
              1. Security Fees
            </p>
            <p className="mb-4">
              2. Green Charges
            </p>
            <p className="mb-4">
              3. Free Access to Pronites
            </p>
            <p className="mb-4">
              4. Unique Experiences
            </p>
            <p className="mb-4">
              5. Unforgettable Moments
            </p>
            <p className="mb-4">
              6. Lifetime Memories
            </p>
            <p className="font-bold text-lg italic text-[#ebe6d0]">Rs. 1800 + 2% Conventional Fees</p>
            <p className="pt-4 text-lg italic text-[#ebe6d0]/60">Note: This does not include entry to individual events.

</p>
          </div>

          {/* Register Button */}
          <div className="flex justify-center items-center mt-10">
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="bg-[#ebe6d0] text-black px-6 py-2.5 rounded-lg font-bold text-sm border-black hover:bg-[#d9d2b8] transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Purchase Membership Card"}
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

export default MembershipCard;
