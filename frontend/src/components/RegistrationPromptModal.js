import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPromptModal = ({ onClose }) => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/basic-registration');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white text-black p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
                <h2 className="text-2xl font-bold mb-4">Basic Registration Required</h2>
                <p className="mb-6">
                    To purchase a Membership Card or register for events, you must first complete the mandatory Basic Registration.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRegisterClick}
                        className="bg-[#001f3f] hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                    >
                        Register Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPromptModal;