import React, { useState } from 'react';
import {Shield, BarChart2, Check, X, Users, Calendar, Gift, CheckCircle} from 'lucide-react';
import { User, Donation } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminProps {
    user: User | null;
}

const ADMIN_STATS = [
    { name: 'Pon', visits: 45 },
    { name: 'Wt', visits: 120 },
    { name: 'Śr', visits: 150 },
    { name: 'Czw', visits: 110 },
    { name: 'Pt', visits: 240 },
    { name: 'Sob', visits: 380 },
    { name: 'Nd', visits: 310 },
];

const MOCK_PENDING_DONATIONS: Donation[] = [
    {
        id: 1,
        itemName: 'Hełm wz. 31',
        description: 'Znaleziony na strychu, stan dobry.',
        imageUrl: 'https://picsum.photos/id/1/200/200',
        status: 'PENDING',
        createdAt: '2023-10-01',
        donorEmail: 'marek@example.com'
    },
    {
        id: 2,
        itemName: 'Bagnet Mauser',
        description: 'Oryginalny bagnet z pochwą.',
        imageUrl: 'https://picsum.photos/id/2/200/200',
        status: 'PENDING',
        createdAt: '2023-10-02',
        donorEmail: 'anna@example.com'
    }
];

const Admin: React.FC<AdminProps> = ({ user }) => {
    const [pendingDonations, setPendingDonations] = useState<Donation[]>(MOCK_PENDING_DONATIONS);

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="pt-32 text-center min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Shield size={64} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Brak dostępu</h2>
                <p className="text-gray-500 mt-2">Ten panel jest dostępny tylko dla administratorów.</p>
            </div>
        );
    }

    const handleDecision = (id: number, decision: 'ACCEPTED' | 'REJECTED') => {
        // TODO: api.put(`/donations/${id}/status`, decision)

        console.log(`Donation ${id} -> ${decision}`);
        setPendingDonations(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-museum-black text-white rounded-xl">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900">Panel Kustosza</h2>
                        <p className="text-gray-500">Zarządzaj muzeum i zbiorami</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
                        <div>
                            <div className="text-gray-500 text-xs font-bold uppercase">Odwiedzających dziś</div>
                            <div className="text-3xl font-bold text-gray-900">124</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><Calendar size={24} /></div>
                        <div>
                            <div className="text-gray-500 text-xs font-bold uppercase">Rezerwacje</div>
                            <div className="text-3xl font-bold text-gray-900">8</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-red-50 text-museum-red rounded-xl"><Gift size={24} /></div>
                        <div>
                            <div className="text-gray-500 text-xs font-bold uppercase">Nowe Dary</div>
                            <div className="text-3xl font-bold text-gray-900">{pendingDonations.length}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Chart Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart2 size={20} className="text-gray-400" />
                            Statystyki Odwiedzin
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ADMIN_STATS}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip
                                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                    />
                                    <Line type="monotone" dataKey="visits" stroke="#8B0000" strokeWidth={3} dot={{r: 4, fill: '#8B0000'}} activeDot={{r: 6}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Donation Approval Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Gift size={20} className="text-gray-400" />
                            Weryfikacja Darowizn
                        </h3>
                        <div className="space-y-4">
                            {pendingDonations.length > 0 ? (
                                pendingDonations.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4 border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                                <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{item.itemName}</div>
                                                <div className="text-xs text-gray-500">Od: {item.donorEmail}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => handleDecision(item.id, 'ACCEPTED')}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl text-sm font-bold transition flex items-center justify-center gap-1"
                                            >
                                                <Check size={16} /> Przyjmij
                                            </button>
                                            <button
                                                onClick={() => handleDecision(item.id, 'REJECTED')}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-sm font-bold transition flex items-center justify-center gap-1"
                                            >
                                                <X size={16} /> Odrzuć
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <CheckCircle className="mx-auto h-12 w-12 mb-3 opacity-20" />
                                    <p>Brak nowych zgłoszeń do rozpatrzenia.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;