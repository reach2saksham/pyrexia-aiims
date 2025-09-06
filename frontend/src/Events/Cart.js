import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../BaseUrl';
import { useAuth } from '../components/AuthContext'; // To get user details
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            const fetchCartItems = async () => {
                try {
                    // Fetch items in the cart that are not yet paid
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
        } else {
            setLoading(false);
        }
    }, [user]);

    const checkoutHandler = async (amount, eventRegistrationId) => {
        try {
            const { data: { key } } = await axios.get(`${BASE_URL}/api/getkey`);
            const { data: { order } } = await axios.post(`${BASE_URL}/api/checkout`, 
                { 
                    amount, 
                    paymentFor: 'Event', // Specify the payment type
                    relatedId: eventRegistrationId // Link to the specific event registration
                },
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
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#001f3f",
                },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed. Please ensure you are logged in and try again.");
        }
    };
    
    const handleRemove = async (eventName) => {
        // ... (existing remove logic)
    };

    if (loading) {
        return <div className="text-center pt-40">Loading your cart...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 sm:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold shackleton-text mb-8">Your Cart</h1>
                {cartItems.length > 0 ? (
                    <ul className="space-y-6">
                        {cartItems.map(item => (
                            <li key={item._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div className="flex flex-col sm:flex-row justify-between">
                                    <div>
                                        <p className="font-bold text-2xl text-yellow-400">{item.eventName}</p>
                                        <p>Team Leader: {item.teamLeaderName}</p>
                                        <p>College: {item.teamLeaderCollege}</p>
                                        <p>Team Size: {item.teamSize}</p>
                                        <p className="font-semibold text-lg mt-2">Fees: ₹{item.fees}</p>
                                    </div>
                                    <div className="flex flex-col space-y-3 mt-4 sm:mt-0">
                                        <button
                                            onClick={() => checkoutHandler(item.fees, item._id)}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
                                        >
                                            Pay Now
                                        </button>
                                        <button
                                            onClick={() => handleRemove(item.eventName)}
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
                    <div className="text-center bg-gray-800 p-10 rounded-lg">
                        <p className="text-xl">Your cart is empty.</p>
                        <button onClick={() => navigate('/events')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                            Browse Events
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;