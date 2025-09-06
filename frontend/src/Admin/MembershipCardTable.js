import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BASE_URL } from '../BaseUrl';

const downloadCsv = (data, filename) => {
    // UPDATED: Added 'Order ID' to the CSV headers
    const headers = ['Sr. No.', 'Name', 'Email', 'Order ID', 'Payment ID', 'Amount', 'Paid'];
    const csvRows = [
        headers.join(','),
        ...data.map((row, index) => [
            index + 1,
            `"${row.userId?.name || 'N/A'}"`,
            `"${row.userId?.email || 'N/A'}"`,
            // UPDATED: Added the razorpay_order_id to the CSV data
            row.razorpay_order_id,
            row.razorpay_payment_id,
            row.amount,
            row.status === 'paid' ? 'Yes' : 'No'
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

const MembershipCardTable = () => {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get(`${BASE_URL}/api/admin/membership-cards`, { withCredentials: true })
            .then(res => {
                setMemberships(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch memberships", err);
                setLoading(false);
            });
    }, []);

    const filteredData = useMemo(() => {
        return memberships.filter(mem => 
            (mem.userId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (mem.userId?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    }, [memberships, searchTerm]);

    if (loading) return <p>Loading Membership Card Data...</p>;

    return (
         <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <input 
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-700 p-2 rounded w-1/3 text-white"
                />
                <button 
                    onClick={() => downloadCsv(filteredData, 'membership-cards.csv')}
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
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            {/* NEW: Added Order ID column header */}
                            <th className="p-2">Order ID</th>
                            <th className="p-2">Payment ID</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Paid</th>
                            <th className="p-2">Ticket Given</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((mem, index) => (
                            <tr key={mem._id} className="border-b border-gray-700 hover:bg-gray-600">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{mem.userId?.name || 'N/A'}</td>
                                <td className="p-2">{mem.userId?.email || 'N/A'}</td>
                                {/* NEW: Added Order ID data cell */}
                                <td className="p-2">{mem.razorpay_order_id}</td>
                                <td className="p-2">{mem.razorpay_payment_id}</td>
                                <td className="p-2">₹{mem.amount}</td>
                                <td className="p-2 text-green-400">{mem.status === 'paid' ? 'Yes' : 'No'}</td>
                                <td className="p-2"><input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembershipCardTable;