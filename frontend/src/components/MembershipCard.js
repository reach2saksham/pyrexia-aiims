import React from 'react';

const MembershipCard = () => {
  document.title = "Registration | Pyrexia 2025"; // Set page title

  return (
    <div className='bg-black min-h-screen'>
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
              
              className="bg-[#ebe6d0] text-black px-6 py-2.5 rounded-lg font-bold text-sm border-black hover:bg-[#d9d2b8] transition duration-300"
            >
              <a href="https://forms.gle/PRjwsH44sZiHBaUr5">Register Now</a>
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
