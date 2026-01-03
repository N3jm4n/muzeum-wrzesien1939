import React, { useState, useEffect } from 'react';
import { Calendar, Users, Loader } from 'lucide-react';
import { bookingService } from '@/services/bookingService.ts';

export const AdminReservations: React.FC = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await bookingService.getByDate(date);
                setList(data.sort((a, b) => a.visitTime.localeCompare(b.visitTime)));
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        load();
    }, [date]);

    const totalGuests = list.reduce((sum, r) => sum + r.numberOfGuests, 0);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div><h2 className="text-2xl font-bold text-gray-900">Harmonogram Wizyt</h2><p className="text-gray-500">Sprawdź listę gości.</p></div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"><Calendar size={20} className="text-museum-red" /><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent outline-none font-bold text-gray-700" /></div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={32} /></div>
                    <div><div className="text-sm text-gray-500 font-bold uppercase tracking-wider">Łącznie osób</div><div className="text-3xl font-bold text-gray-900">{totalGuests}</div></div>
                </div>
                <div className="text-right"><div className="text-sm text-gray-400">Liczba grup</div><div className="text-xl font-bold text-gray-700">{list.length}</div></div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? <div className="p-12 text-center"><Loader className="animate-spin mx-auto"/></div> : list.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Godzina</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Gość</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Email</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase text-center">Osób</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {list.map((res) => (
                                <tr key={res.id} className="hover:bg-gray-50 transition">
                                    <td className="p-6 font-bold text-museum-red">{res.visitTime.slice(0, 5)}</td>
                                    <td className="p-6 font-medium text-gray-900">{res.firstName} {res.lastName}</td>
                                    <td className="p-6 text-gray-500 text-sm">{res.userEmail}</td>
                                    <td className="p-6 text-center"><span className="px-3 py-1 bg-gray-100 rounded-full font-bold text-sm text-gray-700">{res.numberOfGuests}</span></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400"><Calendar size={48} className="mb-4 mx-auto opacity-20"/><p>Brak rezerwacji.</p></div>
                )}
            </div>
        </div>
    );
};