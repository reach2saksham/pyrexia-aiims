import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../BaseUrl';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import bgImage from "../Image/bg.png"; // For consistent styling

const Cart = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            const fetchCartItems = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/cart?email=${user.email}`, { withCredentials: true });
                    setCartItems(response.data);
                } catch (error) {
                    console.error('Error fetching cart items:', error);
                    alert('Could not fetch your cart. Please try again.');
                } finally {
                    setLoading(false);
                }
            };
            fetchCartItems();
        } else if (!user) {
            setLoading(false);
        }
    }, [user]);

    const checkoutHandler = async (amount, eventRegistrationId) => {
        // ... (checkout logic remains unchanged)
        try {
            const { data: { key } } = await axios.get(`${BASE_URL}/api/getkey`);
            const { data: { order } } = await axios.post(`${BASE_URL}/api/checkout`, 
                { amount, paymentFor: 'Event', relatedId: eventRegistrationId },
                { withCredentials: true }
            );
            const options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "Pyrexia Event Registration",
                description: "Payment for fest event",
                order_id: order.id,
                callback_url: `${BASE_URL}/api/paymentverification`,
                prefill: { name: user.name, email: user.email },
                theme: { color: "#001f3f" },
            };
            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed. Please ensure you are logged in and try again.");
        }
    };
    
    // =================================================================
    // IMPLEMENTED REMOVE FUNCTIONALITY
    // =================================================================
    const handleRemove = async (registrationId) => {
        if (!window.confirm("Are you sure you want to remove this event from your cart?")) {
            return;
        }
        
        try {
            const response = await axios.post(
                `${BASE_URL}/cart/remove`, 
                { registrationId }, // Pass the unique ID of the registration
                { withCredentials: true }
            );

            if (response.data.success) {
                // If successful, update the UI instantly by removing the item from the state
                setCartItems(prevItems => prevItems.filter(item => item._id !== registrationId));
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
            alert(error.response?.data?.error || 'Could not remove item from cart.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                Loading Your Cart...
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-fixed bg-center bg-cover pt-24 pb-12 px-4 sm:px-8" style={{ backgroundImage: `url(${bgImage})` }}>
             <div className="absolute inset-0 bg-black opacity-70"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold shackleton-text mb-8 text-center text-[#ebe6d0] uppercase">Your Cart</h1>
                {cartItems.length > 0 ? (
                    <ul className="space-y-6">
                        {cartItems.map(item => (
                            <li key={item._id} className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                <div className="flex flex-col sm:flex-row justify-between">
                                    <div className="text-white">
                                        <p className="font-bold text-2xl text-yellow-400">{item.eventName}</p>
                                        <p className="text-gray-300">Team Leader: {item.teamLeaderName}</p>
                                        <p className="text-gray-300">College: {item.teamLeaderCollege}</p>
                                        <p className="text-gray-300">Team Size: {item.teamSize}</p>
                                        <p className="font-semibold text-xl mt-2 text-yellow-400">Fees: ₹{item.fees}</p>
                                    </div>
                                    <div className="flex flex-col space-y-3 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                                        <button
                                            onClick={() => checkoutHandler(item.fees, item._id)}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
                                        >
                                            Pay Now
                                        </button>
                                        <button
                                            onClick={() => handleRemove(item._id)} // Pass the unique item ID here
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-10 rounded-lg bg-white/10 backdrop-blur-md shadow-lg">
                        <p className="text-xl text-white">Your cart is empty.</p>
                        <button onClick={() => navigate('/events')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
                            Browse Events
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;