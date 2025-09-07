import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../BaseUrl';
import RegistrationPromptModal from './RegistrationPromptModal';

const MembershipCard = () => {
    document.title = "Membership Card | Pyrexia 2025";

    // State for dynamic pricing and user status
    const [currentPrice, setCurrentPrice] = useState(null);
    const [cardsSold, setCardsSold] = useState(0);
    const [hasBasic, setHasBasic] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Manages loading of all initial data

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch user status and current price in parallel for better performance
                const [statusResponse, priceResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/api/user/status`, { withCredentials: true }),
                    axios.get(`${BASE_URL}/api/price/MembershipCard`)
                ]);

                setHasBasic(statusResponse.data.hasBasicRegistration);
                setCurrentPrice(priceResponse.data.price);
                setCardsSold(priceResponse.data.paidCount);

            } catch (error) {
                console.error("Error fetching page data:", error);
                // Set a default price if the fetch fails so the page doesn't break
                setCurrentPrice(1800);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePayment = async () => {
        if (isLoading || !currentPrice) return;

        if (!hasBasic) {
            setShowPrompt(true);
            return;
        }

        try {
            // NOTE: We no longer send the 'amount' from the frontend.
            // The backend securely determines the price based on its own logic.
            const { data: { key } } = await axios.get(`${BASE_URL}/api/getkey`);
            const { data: { order } } = await axios.post(`${BASE_URL}/api/checkout`,
                { paymentFor: 'MembershipCard' }, // Only tell the backend WHAT we are buying
                { withCredentials: true }
            );

            const options = {
                key,
                amount: order.amount, // Use the amount from the server's response
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

    // Calculate spots left for the early bird offer
    const spotsLeft = 100 - cardsSold;

    return (
        <div className='bg-black min-h-screen'>
            {showPrompt && <RegistrationPromptModal onClose={() => setShowPrompt(false)} />}
            
            <div className="relative pt-28 pb-16 flex items-center justify-center">
                <h1 className="text-[#ebe6d0] text-center text-2xl sm:text-[3.5rem] font-semibold leading-[4.5rem] z-10 md:text-[3.7rem] md:px-12 md:leading-[3.5rem] shackleton-text uppercase">
                    PYREXIA MEMBERSHIP CARD
                </h1>
            </div>

            <div className="pb-20 flex relative items-center justify-center text-white">
                <div className="backdrop-blur-sm rounded-xl m-auto h-fit p-6 lg:px-10 max-w-4xl">
                    <div className="px-4 md:px-10 lg:px-10 text-lg font-light text-justify max-w-4xl border rounded-lg pt-10 pb-10">
                        <p className="font-bold text-2xl pb-4 text-[#ebe6d0]">Membership Benefits:</p>
                        <ul className="list-none list-inside mb-4 space-y-2">
                            <li>1. Green cess</li>
                            <li>2. Security cess</li>
                            <li>3. Hospitality</li>
                            <li>4. Emergency services ( including fire department, health emergency, stampede) </li>
                            <li>5. Swachh Bharat cess</li>
                            <li>6. Food court charges</li>
                            <li>7. Access to all the exclusive offers by pyrexia partner business (adventure, rental vehicles, accomodation)</li>
                        </ul>

                        {/* --- DYNAMIC PRICE DISPLAY --- */}
                        {isLoading ? (
                             <p className="font-bold text-xl italic text-yellow-400 animate-pulse">Fetching current price...</p>
                        ) : (
                            <>
                                {currentPrice === 1599 && (
                                    <div className="my-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-center">
                                        <p className="font-bold text-xl text-green-300">Early Bird Offer!</p>
                                        <p className="text-green-300">Hurry! Only {spotsLeft > 0 ? spotsLeft : 0} spots left at this price.</p>
                                    </div>
                                )}
                                <p className="font-bold text-xl italic text-[#ebe6d0]">
                                    Cost:
                                    {currentPrice === 1599 && (
                                        <span className="line-through text-gray-400 mx-2">₹1800</span>
                                    )}
                                    <span className="text-yellow-400 text-2xl"> ₹{currentPrice}</span>
                                    <span className="text-sm"> + 2% Convenience Fee</span>
                                </p>
                            </>
                        )}
                        {/* <p className="pt-4 text-base italic text-[#ebe6d0]/60">Note: This does not include entry to individual events.</p> */}
                    </div>

                    <div className="flex justify-center items-center mt-10">
                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="bg-[#ebe6d0] text-black px-6 py-3 rounded-lg font-bold text-lg border-black hover:bg-[#d9d2b8] transition duration-300 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isLoading ? "Loading..." : `Purchase for ₹${currentPrice || '...'}`}
                        </button>
                    </div>

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