import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BASE_URL } from '../BaseUrl';

const downloadCsv = (data, filename) => {
    const headers = ['Sr. No.', 'Event', 'Team Leader', 'Email', 'Mobile', 'Team Size', 'College', 'Payment ID', 'Amount', 'Paid'];
    const csvRows = [
        headers.join(','),
        ...data.map((row, index) => [
            index + 1,
            `"${row.eventName}"`,
            `"${row.teamLeaderName}"`,
            `"${row.teamLeaderEmail}"`,
            row.teamLeaderMobileNo,
            row.teamSize,
            `"${row.teamLeaderCollege}"`,
            row.paymentId,
            row.amount,
            row.paid ? 'Yes' : 'No'
        ].join(','))
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const EventRegTable = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [eventFilter, setEventFilter] = useState('');

    useEffect(() => {
        axios.get(`${BASE_URL}/api/admin/event-registrations`, { withCredentials: true })
            .then(res => {
                setRegistrations(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch event registrations", err);
                setLoading(false);
            });
    }, []);

    const uniqueEvents = useMemo(() => {
        const eventSet = new Set(registrations.map(reg => reg.eventName));
        return ['', ...Array.from(eventSet)]; // Add empty option for 'All'
    }, [registrations]);

    const filteredData = useMemo(() => {
        return registrations.filter(reg => {
            const matchesSearch = reg.teamLeaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  reg.teamLeaderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (reg.teamLeaderMobileNo && reg.teamLeaderMobileNo.includes(searchTerm));
            const matchesEvent = eventFilter ? reg.eventName === eventFilter : true;
            return matchesSearch && matchesEvent;
        });
    }, [registrations, searchTerm, eventFilter]);

    if (loading) return <p>Loading Event Registrations...</p>;

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                <input 
                    type="text"
                    placeholder="Search by name, email, mobile..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-700 p-2 rounded w-full sm:w-1/3 text-white"
                />
                <select 
                    value={eventFilter}
                    onChange={e => setEventFilter(e.target.value)}
                    className="bg-gray-700 p-2 rounded w-full sm:w-auto text-white"
                >
                    {uniqueEvents.map(event => (
                        <option key={event} value={event}>{event || 'All Events'}</option>
                    ))}
                </select>
                <button 
                    onClick={() => downloadCsv(filteredData, 'event-registrations.csv')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Download CSV
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="p-2">Sr.</th>
                            <th className="p-2">Event Name</th>
                            <th className="p-2">Team Leader</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Mobile</th>
                            <th className="p-2">Team Size</th>
                            <th className="p-2">College</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Ticket Given</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((reg, index) => (
                            <tr key={reg._id} className="border-b border-gray-700 hover:bg-gray-600">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{reg.eventName}</td>
                                <td className="p-2">{reg.teamLeaderName}</td>
                                <td className="p-2">{reg.teamLeaderEmail}</td>
                                <td className="p-2">{reg.teamLeaderMobileNo}</td>
                                <td className="p-2">{reg.teamSize}</td>
                                <td className="p-2">{reg.teamLeaderCollege}</td>
                                <td className="p-2">₹{reg.amount}</td>
                                <td className="p-2"><input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600"/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventRegTable;