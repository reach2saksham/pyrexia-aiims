import React, { useState } from 'react';
import BasicRegTable from './BasicRegTable';
import MembershipCardTable from './MembershipCardTable';
import EventRegTable from './EventRegTable';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('events');

    const renderTable = () => {
        switch (activeTab) {
            case 'basic':
                return <BasicRegTable />;
            case 'membership':
                return <MembershipCardTable />;
            case 'events':
            default:
                return <EventRegTable />;
        }
    };

    const tabClass = (tabName) => 
        `px-4 py-2 font-semibold rounded-t-lg transition-colors duration-300 ${
            activeTab === tabName ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
            <h1 className="text-4xl font-bold shackleton-text pt-16 pb-6 uppercase">Admin Dashboard</h1>
            <div className="flex border-b border-gray-700 mb-6">
                <button onClick={() => setActiveTab('events')} className={tabClass('events')}>Event Registrations</button>
                <button onClick={() => setActiveTab('basic')} className={tabClass('basic')}>Basic Registrations</button>
                <button onClick={() => setActiveTab('membership')} className={tabClass('membership')}>Membership Cards</button>
            </div>
            <div>
                {renderTable()}
            </div>
        </div>
    );
};

export default AdminDashboard;