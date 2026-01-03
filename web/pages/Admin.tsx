import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { User } from '../types';
import { AdminDonations } from '../components/admin/AdminDonations';
import { AdminExhibitForm } from '../components/admin/AdminExhibitForm';
import { AdminExhibitionsManager } from '../components/admin/AdminExhibitionsManager';
import { AdminReservations } from '../components/admin/AdminReservations';

interface AdminProps {
    user: User | null;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'donations' | 'addExhibit' | 'addExhibition' | 'reservations'>('donations');

    if (!user || user.role !== 'ROLE_ADMIN') {
        return (
            <div className="pt-32 text-center min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Shield size={64} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Brak dostępu</h2>
                <p className="text-gray-500 mt-2">Zaloguj się jako Administrator, aby zobaczyć ten panel.</p>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-museum-black text-white rounded-xl"><Shield size={24} /></div>
                        <div><h2 className="text-3xl font-serif font-bold text-gray-900">Panel Kustosza</h2><p className="text-gray-500">Zarządzanie zbiorami muzeum</p></div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-1">
                    <button onClick={() => setActiveTab('donations')} className={`px-6 py-3 font-medium rounded-t-xl transition-all ${activeTab === 'donations' ? 'bg-white text-museum-red border-b-2 border-museum-red shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>Weryfikacja Darowizn</button>
                    <button onClick={() => setActiveTab('addExhibit')} className={`px-6 py-3 font-medium rounded-t-xl transition-all ${activeTab === 'addExhibit' ? 'bg-white text-museum-red border-b-2 border-museum-red shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>Dodaj Eksponat</button>
                    <button onClick={() => setActiveTab('addExhibition')} className={`px-6 py-3 font-medium rounded-t-xl transition-all ${activeTab === 'addExhibition' ? 'bg-white text-museum-red border-b-2 border-museum-red shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>Zarządzaj Wystawami</button>
                    <button onClick={() => setActiveTab('reservations')} className={`px-6 py-3 font-medium rounded-t-xl transition-all ${activeTab === 'reservations' ? 'bg-white text-museum-red border-b-2 border-museum-red shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>Rezerwacje</button>
                </div>

                {/* CONTENT */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
                    {activeTab === 'donations' && <AdminDonations />}
                    {activeTab === 'addExhibit' && <AdminExhibitForm />}
                    {activeTab === 'addExhibition' && <AdminExhibitionsManager />}
                    {activeTab === 'reservations' && <AdminReservations />}
                </div>
            </div>
        </div>
    );
};

export default Admin;