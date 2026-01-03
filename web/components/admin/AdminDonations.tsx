import React, { useState, useEffect } from 'react';
import { Gift, Check, X, CheckCircle, ChevronDown, ChevronUp, FileText, Image as ImageIcon, Archive } from 'lucide-react';
import { Donation } from '@/types.ts';
import { adminService } from '@/services/adminService.ts';

export const AdminDonations: React.FC = () => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [msg, setMsg] = useState('');

    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                // Get all donations from backend
                const data = await adminService.getAllDonations();
                setDonations(data);
            } catch (error) {
                console.error("Error fetching donations:", error);
            }
        };
        fetchDonations();
    }, []);

    const handleDecision = async (id: number, decision: 'ACCEPTED' | 'REJECTED') => {
        try {
            await adminService.updateDonationStatus(id, decision);

            setDonations(prev => prev.map(d =>
                d.id === id ? { ...d, status: decision } : d
            ));

            setMsg(`Donation ${decision === 'ACCEPTED' ? 'accepted' : 'rejected'}`);

            if (expandedId === id) setExpandedId(null);

            setTimeout(() => setMsg(''), 3000);
        } catch (e) {
            alert("Server error occurred");
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const pendingList = donations.filter(d => d.status === 'PENDING');
    const acceptedList = donations.filter(d => d.status === 'ACCEPTED');

    const renderDonationCard = (item: Donation, isPending: boolean) => {
        const isExpanded = expandedId === item.id;

        return (
            <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isPending
                        ? (isExpanded ? 'bg-white border-museum-red/30 shadow-md' : 'bg-gray-50 border-gray-100')
                        : 'bg-white border-gray-200 opacity-90'
                }`}
            >
                {/* HEADER (Clickable) */}
                <div
                    onClick={() => toggleExpand(item.id)}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 cursor-pointer hover:bg-gray-100/50 transition gap-4"
                >
                    <div className="flex items-center gap-4 flex-1">
                        {/* Thumbnail */}
                        <div className="h-16 w-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div>
                            <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                {item.itemName}
                                {isExpanded ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                            </div>

                            {!isExpanded && (
                                <div className="text-sm text-gray-600 mb-1 line-clamp-1">{item.description}</div>
                            )}
                            <div className="text-xs text-gray-400">Donor: {item.donorEmail}</div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
                        {isPending ? (
                            <>
                                <button
                                    onClick={() => handleDecision(item.id, 'ACCEPTED')}
                                    className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl font-bold transition text-sm"
                                >
                                    <Check size={18}/> Accept
                                </button>
                                <button
                                    onClick={() => handleDecision(item.id, 'REJECTED')}
                                    className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold transition text-sm"
                                >
                                    <X size={18}/> Reject
                                </button>
                            </>
                        ) : (
                            <span className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-green-700 rounded-xl font-bold text-sm">
                                <CheckCircle size={18}/> Accepted
                            </span>
                        )}
                    </div>
                </div>

                {/* EXPANDED CONTENT */}
                {isExpanded && (
                    <div className="p-6 border-t border-gray-100 bg-white animate-fade-in cursor-default">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Col: Description */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FileText size={16}/> Full Description
                                </h4>
                                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                                    {item.description}
                                </p>

                                <div className="mt-6">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Info</h4>
                                    <p className="text-gray-900 font-medium">{item.donorEmail}</p>
                                </div>
                            </div>

                            {/* Right Col: Large Image */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <ImageIcon size={16}/> Attached Photos
                                </h4>
                                <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt="Full view"
                                            className="w-full h-auto object-contain max-h-[400px]"
                                        />
                                    ) : (
                                        <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                                            <ImageIcon size={48} className="mb-2 opacity-50"/>
                                            <p>No photo provided</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="pb-12">

            {/* --- SECTION 1: PENDING --- */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Gift className="text-gray-400" /> Pending Requests
                </h3>
                {msg && <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg">{msg}</span>}
            </div>

            <div className="space-y-4 mb-12">
                {pendingList.length > 0 ? (
                    pendingList.map(item => renderDonationCard(item, true))
                ) : (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                        <CheckCircle className="mx-auto h-12 w-12 mb-3 opacity-20" />
                        <p>No new requests to verify.</p>
                    </div>
                )}
            </div>

            {/* --- SECTION 2: ACCEPTED HISTORY --- */}
            <div className="flex items-center gap-4 mb-6 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700">
                    <Archive className="text-gray-400" /> Accepted History
                </h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {acceptedList.length}
                </span>
            </div>

            <div className="space-y-4">
                {acceptedList.length > 0 ? (
                    acceptedList.map(item => renderDonationCard(item, false))
                ) : (
                    <p className="text-gray-400 text-sm">No accepted donations yet.</p>
                )}
            </div>

        </div>
    );
};