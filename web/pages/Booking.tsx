import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, Ticket, Plus, Minus, History, Loader, Clock, Info } from 'lucide-react';
import { User } from '../types';
import { bookingService, TimeSlot, ReservationEntry } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';
import { CustomDatePicker } from '../components/ui/CustomDatePicker';

interface BookingProps {
    user: User | null;
}

const TicketPricing = () => (
    <div className="bg-blue-50 p-6 rounded-3xl shadow-sm border border-blue-100 mb-6 text-left w-full mx-auto">
        <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Info className="text-blue-600" /> Cennik biletów (do nabycia w kasie)
        </h2>
        <ul className="space-y-2 text-blue-800 text-sm font-medium">
            <li className="flex justify-between border-b border-blue-200/50 pb-1"><span>Bilet normalny:</span> <span>45 zł</span></li>
            <li className="flex justify-between border-b border-blue-200/50 pb-1"><span>Bilet ulgowy:</span> <span>25 zł</span></li>
            <li className="flex justify-between border-b border-blue-200/50 pb-1"><span>Grupy (od 15 osób):</span> <span>25 zł / os.</span></li>
            <li className="flex justify-between border-b border-blue-200/50 pb-1"><span>Bilet normalny (mieszkaniec gminy Bobrowniki):</span> <span>30 zł</span></li>
            <li className="flex justify-between border-b border-blue-200/50 pb-1"><span>Bilet ulgowy (mieszkaniec gminy Bobrowniki):</span> <span>15 zł</span></li>
            <li className="flex justify-between border-b border-blue-200/50 pb-1 flex-col sm:flex-row gap-1 sm:gap-4"><span className="leading-snug">Bilet rodzinny (wstęp dla 2 dorosłych i 2 dzieci lub 1 osoby dorosłej i 3 dzieci do 18 r.ż.):</span> <span className="whitespace-nowrap sm:text-right">115 zł</span></li>
            <li className="flex justify-between pt-1 text-green-700"><span>Dzieci do 6 roku życia:</span> <span>Za darmo</span></li>
        </ul>
    </div>
);

const Booking: React.FC<BookingProps> = ({ user }) => {
    const navigate = useNavigate();

    // Stan formularza
    const [date, setDate] = useState('');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [guestCount, setGuestCount] = useState(1); // Prosty licznik gości
    const [phoneNumber, setPhoneNumber] = useState('');

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

    const loadSlots = async (selectedDate: string) => {
        if (!selectedDate) return;
        setLoadingSlots(true);
        try {
            const data = await bookingService.getAvailableSlots(selectedDate);
            setAvailableSlots(data);
        } catch (err) {
            console.error("Błąd slotów:", err);
        } finally {
            setLoadingSlots(false);
        }
    };

    // 2. Pobieranie slotów po zmianie daty
    useEffect(() => {
        if (date) {
            setSelectedTime(null);
            loadSlots(date);
        }
    }, [date]);

    const updateGuestCount = (delta: number) => {
        setGuestCount(prev => Math.max(1, prev + delta)); // Minimum 1 osoba
    };

    const formatTime = (time: string) => time.slice(0, 5);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !selectedTime || guestCount < 1 || !phoneNumber.trim()) {
            alert("Proszę wypełnić wszystkie pola, w tym numer telefonu.");
            return;
        }

        setSubmitting(true);
        try {
            await bookingService.createReservation({
                date: date,
                time: selectedTime,
                numberOfGuests: guestCount,
                phoneNumber: phoneNumber.trim()
            });

            setSuccess(true);
            setGuestCount(1);
            setSelectedTime(null);
            setPhoneNumber('');

            const history = await bookingService.getMyReservations();
            setMyReservations(history);
            await loadSlots(date);

        } catch (error) {
            alert("Nie udało się zarezerwować. Ten termin mógł zostać właśnie zajęty.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-32 min-h-screen bg-gray-50 flex flex-col items-center px-4 text-center">
                <div className="max-w-2xl w-full">
                    <TicketPricing />
                    
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-6">
                        <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Rezerwacja zwiedzania</h2>
                        <p className="text-gray-600 mt-2 mb-6">Bilety możesz kupić na miejscu w kasie muzeum, jednak **rezerwacja terminu** dostępna jest tylko dla zalogowanych użytkowników.</p>
                        <button onClick={() => navigate('/login')} className="px-6 py-3 bg-museum-red text-white rounded-xl font-bold hover:bg-red-700 transition">Przejdź do logowania, aby zarezerwować</button>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="pt-32 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center animate-fade-in">
                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle size={40} /></div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Rezerwacja potwierdzona!</h2>
                <p className="text-gray-600 mb-8">Twoja rezerwacja została zapisana w systemie. Bilety do nabycia w kasie na miejscu.</p>
                <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-museum-black text-white rounded-xl font-bold hover:bg-gray-800 transition">Zarezerwuj kolejną wizytę</button>
            </div>
        );
    }

    return (
        <div className="pt-28 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEWA KOLUMNA: WYBÓR */}
                <div className="lg:col-span-2 space-y-6">

                    {/* INFORMACJA O BILETACH */}
                    <TicketPricing />

                    {/* 1. DATA */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-museum-red"/> 1. Wybierz termin</h2>
                        <CustomDatePicker 
                            value={date} 
                            onChange={(newDate) => setDate(newDate)} 
                            minDate={new Date().toISOString().split('T')[0]} 
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
                                        const isTaken = !slot.available;

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
                                    <div className="text-gray-500 font-medium text-sm mt-1">Bilety płatne w kasie</div>
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

                    {/* 4. DANE KONTAKTOWE */}
                    {selectedTime && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Info className="text-museum-red"/> 4. Dane kontaktowe
                            </h2>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Numer telefonu <span className="text-museum-red">*</span></label>
                                <input
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="np. +48 123 456 789"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 text-lg font-medium"
                                />
                                <p className="text-xs text-gray-500 mt-1">Wymagany w razie nagłej potrzeby kontaktu ze strony muzeum.</p>
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
                            <div className="flex justify-between text-gray-600"><span>Telefon:</span><span className="font-medium">{phoneNumber || '-'}</span></div>

                            <div className="mt-4 pt-4 border-t border-gray-100 bg-green-50 p-3 rounded-xl flex items-start gap-2">
                                <Info size={18} className="text-green-600 mt-0.5 flex-shrink-0"/>
                                <span className="text-sm text-green-800 font-medium">Zarezerwuj termin teraz, a bilety opłacisz wygodnie w kasie muzeum przed wejściem.</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !date || !selectedTime || !phoneNumber.trim()}
                            className="w-full py-4 bg-museum-red text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-red-200"
                        >
                            {submitting ? <Loader className="animate-spin" /> : "Zarezerwuj termin"}
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