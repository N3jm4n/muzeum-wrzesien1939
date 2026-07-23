import React, { useState, useEffect } from 'react';
import { Calendar, Users, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { bookingService } from '@/services/bookingService.ts';

export const AdminReservations: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const d = new Date(selectedDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    const startOfWeek = new Date(d.setDate(diff));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startDateStr = formatDate(startOfWeek);
    const endDateStr = formatDate(endOfWeek);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await bookingService.getByRange(startDateStr, endDateStr);
                setList(data);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        load();
    }, [startDateStr, endDateStr]);

    let totalGuestsWeek = 0;
    const daysArray = Array.from({ length: 7 }, (_, i) => {
        const currentD = new Date(startOfWeek);
        currentD.setDate(startOfWeek.getDate() + i);
        const dateStr = formatDate(currentD);
        
        const dayReservations = list
            .filter(r => r.visitDate === dateStr)
            .sort((a, b) => a.visitTime.localeCompare(b.visitTime));
            
        const guests = dayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
        totalGuestsWeek += guests;

        return {
            dateStr,
            guests,
            reservations: dayReservations
        };
    });

    const toggleDay = (dateStr: string) => {
        if (expandedDay === dateStr) {
            setExpandedDay(null);
        } else {
            setExpandedDay(dateStr);
        }
    };

    const changeWeek = (offset: number) => {
        const newD = new Date(selectedDate);
        newD.setDate(newD.getDate() + offset * 7);
        setSelectedDate(formatDate(newD));
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div><h2 className="text-2xl font-bold text-gray-900">Harmonogram Tygodniowy</h2><p className="text-gray-500">Sprawdź listę gości (od {startDateStr} do {endDateStr}).</p></div>
                <div className="flex items-center gap-2">
                    <button onClick={() => changeWeek(-1)} className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 text-sm font-medium transition">Poprzedni</button>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"><Calendar size={20} className="text-museum-red" /><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent outline-none font-bold text-gray-700" /></div>
                    <button onClick={() => changeWeek(1)} className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 text-sm font-medium transition">Następny</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={32} /></div>
                    <div><div className="text-sm text-gray-500 font-bold uppercase tracking-wider">Łącznie osób w tygodniu</div><div className="text-3xl font-bold text-gray-900">{totalGuestsWeek}</div></div>
                </div>
                <div className="text-right"><div className="text-sm text-gray-400">Liczba rezerwacji</div><div className="text-xl font-bold text-gray-700">{list.length}</div></div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? <div className="p-12 text-center"><Loader className="animate-spin mx-auto"/></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Dzień</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase text-center">Osób</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase text-center">Akcje</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {daysArray.map((dayObj) => (
                                <React.Fragment key={dayObj.dateStr}>
                                    <tr onClick={() => dayObj.guests > 0 && toggleDay(dayObj.dateStr)} className={`transition ${dayObj.guests > 0 ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50'}`}>
                                        <td className="p-6 font-bold text-museum-red">{dayObj.dateStr}</td>
                                        <td className="p-6 text-center"><span className={`px-3 py-1 rounded-full font-bold text-sm ${dayObj.guests > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{dayObj.guests}</span></td>
                                        <td className="p-6 text-center text-gray-400">
                                            {dayObj.guests > 0 && (expandedDay === dayObj.dateStr ? <ChevronUp className="mx-auto" size={20} /> : <ChevronDown className="mx-auto" size={20} />)}
                                        </td>
                                    </tr>
                                    {expandedDay === dayObj.dateStr && dayObj.guests > 0 && (
                                        <tr>
                                            <td colSpan={3} className="bg-gray-50 p-6 border-b border-gray-100">
                                                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                                                    <table className="w-full text-left text-sm">
                                                        <thead className="bg-gray-100 border-b border-gray-200">
                                                            <tr>
                                                                <th className="p-4 font-bold text-gray-500">Godzina</th>
                                                                <th className="p-4 font-bold text-gray-500">Gość</th>
                                                                <th className="p-4 font-bold text-gray-500">Kontakt</th>
                                                                <th className="p-4 font-bold text-gray-500 text-center">Osób</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {dayObj.reservations.map((res: any) => (
                                                                <tr key={res.id} className="hover:bg-gray-50">
                                                                    <td className="p-4 font-bold text-museum-red">{res.visitTime.slice(0, 5)}</td>
                                                                    <td className="p-4 font-medium text-gray-900">{res.firstName} {res.lastName}</td>
                                                                    <td className="p-4 text-gray-500">
                                                                        <div>{res.userEmail}</div>
                                                                        <div>{res.phoneNumber}</div>
                                                                    </td>
                                                                    <td className="p-4 text-center font-bold text-gray-700">{res.numberOfGuests}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};