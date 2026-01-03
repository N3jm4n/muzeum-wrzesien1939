import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, Ticket, Plus, Minus, History, Loader, Clock, Info } from 'lucide-react';
import { User } from '../types';
import { bookingService, TimeSlot, ReservationEntry } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';

interface BookingProps {
    user: User | null;
}

const Booking: React.FC<BookingProps> = ({ user }) => {
    const navigate = useNavigate();

    // Stan formularza
    const [date, setDate] = useState('');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [guestCount, setGuestCount] = useState(1); // Prosty licznik gości

    // Stan danych z API
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [myReservations, setMyReservations] = useState<ReservationEntry[]>([]);

    // Stan UI
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // 1. Pobieranie historii
    useEffect(() => {
        if (user) {
            setLoadingHistory(true);
            bookingService.getMyReservations()
                .then(data => setMyReservations(data))
                .catch(err => console.error("Błąd historii:", err))
                .finally(() => setLoadingHistory(false));
        }
    }, [user]);

    // 2. Pobieranie slotów po zmianie daty
    useEffect(() => {
        if (date) {
            setLoadingSlots(true);
            setSelectedTime(null);
            bookingService.getAvailableSlots(date)
                .then(data => setAvailableSlots(data))
                .catch(err => console.error("Błąd slotów:", err))
                .finally(() => setLoadingSlots(false));
        }
    }, [date]);

    const updateGuestCount = (delta: number) => {
        setGuestCount(prev => Math.max(1, prev + delta)); // Minimum 1 osoba
    };

    const formatTime = (time: string) => time.slice(0, 5);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !selectedTime || guestCount < 1) return;

        setSubmitting(true);
        try {
            await bookingService.createReservation({
                date: date,
                time: selectedTime,
                numberOfGuests: guestCount
            });

            setSuccess(true);
            setGuestCount(1);
            setSelectedTime(null);

            const history = await bookingService.getMyReservations();
            setMyReservations(history);

        } catch (error) {
            alert("Nie udało się zarezerwować. Ten termin mógł zostać właśnie zajęty.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-32 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
                <Ticket size={64} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Zarezerwuj wizytę</h2>
                <p className="text-gray-600 mt-2 mb-6">Zaloguj się, aby zarezerwować wejście do muzeum.</p>
                <button onClick={() => navigate('/login')} className="px-6 py-3 bg-museum-red text-white rounded-xl font-bold hover:bg-red-700 transition">Przejdź do logowania</button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="pt-32 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center animate-fade-in">
                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle size={40} /></div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Rezerwacja potwierdzona!</h2>
                <p className="text-gray-600 mb-8">Twoja darmowa wejściówka została zapisana w systemie.</p>
                <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-museum-black text-white rounded-xl font-bold hover:bg-gray-800 transition">Zarezerwuj kolejną wizytę</button>
            </div>
        );
    }

    return (
        <div className="pt-28 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEWA KOLUMNA: WYBÓR */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. DATA */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="text-museum-red"/> 1. Wybierz termin</h2>
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 text-lg font-medium"
                        />
                    </div>

                    {/* 2. GODZINA */}
                    {date && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="text-museum-red"/> 2. Wybierz godzinę wejścia</h2>

                            {loadingSlots ? (
                                <div className="flex justify-center py-4"><Loader className="animate-spin text-museum-red"/></div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {availableSlots.map((slot) => {
                                        // ZMIANA TUTAJ:
                                        // Sprawdzamy 'available' zamiast 'isAvailable'
                                        // Dodatkowo zabezpieczamy się: jeśli 'available' nie istnieje, spróbuj 'isAvailable'
                                        const isTaken = !(slot.available ?? (slot as any).isAvailable);

                                        return (
                                            <button
                                                key={slot.time}
                                                onClick={() => setSelectedTime(slot.time)}
                                                disabled={isTaken} // Jeśli isTaken jest true, przycisk jest nieaktywny (szary)
                                                className={`py-2 px-3 rounded-xl text-sm font-bold border transition ${
                                                    selectedTime === slot.time
                                                        ? 'bg-museum-black text-white border-museum-black scale-105 shadow-md'
                                                        : isTaken
                                                            ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice' // Styl zablokowanego
                                                            : 'bg-white text-gray-700 border-gray-200 hover:border-museum-red hover:text-museum-red' // Styl aktywnego
                                                }`}
                                            >
                                                {formatTime(slot.time)}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500">Brak wolnych terminów w tym dniu.</p>
                            )}
                        </div>
                    )}

                    {/* 3. LICZBA OSÓB - POJAWIA SIĘ DOPIERO PO WYBRANIU GODZINY */}
                    {selectedTime && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Users className="text-museum-red"/> 3. Liczba odwiedzających
                            </h2>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                <div>
                                    <div className="font-bold text-gray-900 text-lg">Wielkość grupy</div>
                                    <div className="text-green-600 font-bold text-sm mt-1">Wstęp bezpłatny</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => updateGuestCount(-1)}
                                        className="h-12 w-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-100 transition text-gray-600"
                                    >
                                        <Minus size={20}/>
                                    </button>

                                    <span className="w-8 text-center font-bold text-2xl">{guestCount}</span>

                                    <button
                                        onClick={() => updateGuestCount(1)}
                                        className="h-12 w-12 flex items-center justify-center rounded-xl bg-museum-black text-white hover:bg-gray-800 transition"
                                    >
                                        <Plus size={20}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* PRAWA KOLUMNA: PODSUMOWANIE */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Ticket className="text-gray-400"/> Podsumowanie</h2>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600"><span>Data:</span><span className="font-medium">{date || '-'}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Godzina:</span><span className="font-medium text-museum-red">{selectedTime ? formatTime(selectedTime) : '-'}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Liczba gości:</span><span className="font-medium">{guestCount} os.</span></div>

                            <div className="mt-4 pt-4 border-t border-gray-100 bg-green-50 p-3 rounded-xl flex items-start gap-2">
                                <Info size={18} className="text-green-600 mt-0.5 flex-shrink-0"/>
                                <span className="text-sm text-green-800 font-medium">Muzeum udostępnia zbiory bezpłatnie. Prosimy o punktualne przybycie.</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !date || !selectedTime}
                            className="w-full py-4 bg-museum-red text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-red-200"
                        >
                            {submitting ? <Loader className="animate-spin" /> : "Zarezerwuj bezpłatnie"}
                        </button>
                    </div>

                    {/* HISTORIA */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><History className="text-gray-400"/> Twoje rezerwacje</h3>
                        {loadingHistory ? <div className="text-center py-4"><Loader className="animate-spin mx-auto text-gray-300"/></div> : (
                            <div className="space-y-3">
                                {myReservations.length > 0 ? myReservations.map((r) => (
                                    <div key={r.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-900">{r.visitDate}</div>
                                            <div className="text-gray-500">{formatTime(r.visitTime)} • Gości: {r.numberOfGuests}</div>
                                        </div>
                                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">AKTYWNA</div>
                                    </div>
                                )) : <p className="text-gray-400 text-sm text-center py-2">Brak nadchodzących wizyt.</p>}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Booking;