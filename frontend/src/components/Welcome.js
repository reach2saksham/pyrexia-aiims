import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { useAuth } from './AuthContext';
import { BASE_URL } from '../BaseUrl';
import bgImage from "../Image/bg.png";

const Welcome = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const [userStatus, setUserStatus] = useState({
        hasBasicRegistration: false,
        hasMembershipCard: false,
        registeredEvents: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        if (user) {
            axios.get(`${BASE_URL}/api/user/status`, { withCredentials: true })
                .then(response => {
                    setUserStatus(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user status:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user, authLoading, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                Loading Profile...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Define reusable button styles
    const buttonStyle = "bg-[#ebe6d0] hover:bg-[#d9d2b8] text-black font-bold py-2 px-4 rounded-lg transition duration-300 text-sm shadow-md";
    const disabledButtonStyle = "bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg cursor-not-allowed text-sm";

    const handleTeamChange = (eventId, action) => {
        axios.post(`${BASE_URL}/api/events/team-size`, {
            eventId,
            action // "increase" or "decrease"
        }, { withCredentials: true })
            .then(response => {
                setUserStatus(prev => ({
                    ...prev,
                    registeredEvents: prev.registeredEvents.map(event =>
                        event._id === eventId ? { ...event, teamSize: response.data.teamSize } : event
                    )
                }));
            })
            .catch(err => console.error("Error updating team size:", err));
    };


    return (
        <div
            className="relative min-h-screen bg-fixed bg-center bg-cover flex items-center justify-center text-white px-4 pt-16"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="absolute inset-0 bg-black opacity-70"></div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-3xl w-full mx-4">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-center shackleton-text text-[#ebe6d0]">Welcome, {user.name}</h1>
                <p className="text-center text-gray-300 mb-8">{user.email}</p>

                <div className="space-y-6">

                    {/* Basic Registration Section */}
                    <div className="flex justify-between items-center bg-black/20 px-4 py-2 rounded-lg">
                        <div>
                            <h2 className="text-lg font-semibold">Basic Registration:</h2>
                            {userStatus.hasBasicRegistration ? (
                                <p className="text-green-400 font-bold">Purchased</p>
                            ) : (
                                <p className="text-yellow-400">Not Purchased</p>
                            )}
                        </div>
                        {userStatus.hasBasicRegistration ? (
                            <button className={disabledButtonStyle} disabled>Completed</button>
                        ) : (
                            <Link to="/basic-registration" className={buttonStyle}>Register Now</Link>
                        )}
                    </div>

                    {/* Membership Card Section */}
                    <div className="flex justify-between items-center bg-black/20 px-4 py-2 rounded-lg">
                        <div>
                            <h2 className="text-lg font-semibold">Membership Card:</h2>
                            {userStatus.hasMembershipCard ? (
                                <p className="text-green-400 font-bold">Purchased</p>
                            ) : (
                                <p className="text-yellow-400">Not Purchased</p>
                            )}
                        </div>
                        {userStatus.hasMembershipCard ? (
                            <button className={disabledButtonStyle} disabled>Purchased</button>
                        ) : (
                            <Link to="/membership-card" className={buttonStyle}>Purchase Now</Link>
                        )}
                    </div>

                    {/* Registered Events Section - REVISED */}
                    <div className="bg-black/20 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">Registered Events:</h2>
                                {userStatus.registeredEvents && userStatus.registeredEvents.length > 0 ? (
                                    <ul className="list-disc list-inside mt-2 space-y-2 text-gray-200">
                                        {userStatus.registeredEvents.map(event => (
                                            <li key={event._id} className="flex justify-between items-center">
                                                <span>{event.eventName}</span>
                                                <div className="flex space-x-2">
                                                    {/* Decrease team size */}
                                                    <button
                                                        onClick={() => handleTeamChange(event._id, "decrease")}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                                                    >
                                                        -
                                                    </button>
                                                    {/* Increase team size */}
                                                    <button
                                                        onClick={() => handleTeamChange(event._id, "increase")}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 mt-1">You haven't registered for any events.</p>
                                )}

                            </div>
                            <Link to="/events" className={buttonStyle}>Browse Events</Link>
                        </div>
                    </div>

                    {/* Accommodation Section */}
                    <div className="flex justify-between items-center bg-black/20 px-4 py-2 rounded-lg">
                        <div>
                            <h2 className="text-lg font-semibold">Accommodation:</h2>
                            <p className="text-gray-300">Book your stay</p>
                        </div>
                        <Link to="/accomodation" className={buttonStyle}>Book Now</Link>
                    </div>

                </div>

                <button
                    onClick={handleLogout}
                    className="w-full mt-10 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Welcome;