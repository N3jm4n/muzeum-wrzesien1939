import React, { useState, useEffect } from 'react';
import { Gift, Check, X, CheckCircle } from 'lucide-react';
import { Donation } from '@/types.ts';
import { adminService } from '@/services/adminService.ts';

export const AdminDonations: React.FC = () => {
    const [pendingDonations, setPendingDonations] = useState<Donation[]>([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const data = await adminService.getAllDonations();
                setPendingDonations(data.filter(d => d.status === 'PENDING'));
            } catch (error) { console.error(error); }
        };
        fetchDonations();
    }, []);

    const handleDecision = async (id: number, decision: 'ACCEPTED' | 'REJECTED') => {
        try {
            await adminService.updateDonationStatus(id, decision);
            setPendingDonations(prev => prev.filter(d => d.id !== id));
            setMsg(`Zgłoszenie ${decision === 'ACCEPTED' ? 'przyjęte' : 'odrzucone'}`);
            setTimeout(() => setMsg(''), 3000);
        } catch (e) { alert("Błąd serwera"); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Gift className="text-gray-400" /> Oczekujące zgłoszenia</h3>
                {msg && <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg">{msg}</span>}
            </div>

            <div className="space-y-4">
                {pendingDonations.length > 0 ? (
                    pendingDonations.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4 border border-gray-100 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
                                    {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Brak</div>}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-lg">{item.itemName}</div>
                                    <div className="text-sm text-gray-600 mb-1 line-clamp-1">{item.description}</div>
                                    <div className="text-xs text-gray-400">Zgłosił: {item.donorEmail}</div>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                                <button onClick={() => handleDecision(item.id, 'ACCEPTED')} className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl font-bold transition"><Check size={18}/> Przyjmij</button>
                                <button onClick={() => handleDecision(item.id, 'REJECTED')} className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold transition"><X size={18}/> Odrzuć</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-gray-400"><CheckCircle className="mx-auto h-12 w-12 mb-3 opacity-20" /><p>Brak nowych zgłoszeń do weryfikacji.</p></div>
                )}
            </div>
        </div>
    );
};