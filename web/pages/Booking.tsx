import React, { useState } from 'react';
import { MapPin, Clock, Calendar, Users, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface BookingProps {
    user: User | null;
    onNavigate: (page: string) => void;
}

const Booking: React.FC<BookingProps> = ({ user, onNavigate }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('10:00');
    const [guests, setGuests] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Tutaj wkrótce będzie: api.post('/reservations', { ... })

        console.log('Symulacja wysłania rezerwacji:', { date, time, guests });
        setIsSuccess(true);

        setTimeout(() => {
            setIsSuccess(false);
            setDate('');
        }, 3000);
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 px-4 pb-12 flex items-center justify-center animate-fade-in">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                <div className="md:w-1/2 bg-museum-black p-10 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                        <img src="https://picsum.photos/id/102/600/800" className="w-full h-full object-cover grayscale" alt="Museum interior" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif font-bold mb-4">Zaplanuj wizytę</h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Odwiedź nas i poczuj historię na własnej skórze. Rezerwacja online gwarantuje wejście bez kolejki.
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <MapPin className="text-museum-red" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Adres</p>
                                    <p className="font-medium">ul. Wojska Polskiego 1939, Tychy</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <Clock className="text-museum-red" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Czas zwiedzania</p>
                                    <p className="font-medium">ok. 90 minut</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-1/2 p-10 bg-white">
                    {!user ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <Users size={32} className="text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Wymagane logowanie</h3>
                                <p className="text-gray-500 mt-2">Musisz być zalogowany, aby dokonać rezerwacji wizyty.</p>
                            </div>
                            <button
                                onClick={() => onNavigate('login')}
                                className="px-8 py-3 bg-museum-red text-white rounded-xl font-medium hover:bg-red-800 transition w-full shadow-lg shadow-red-900/20"
                            >
                                Przejdź do logowania
                            </button>
                        </div>
                    ) : isSuccess ? (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up">
                            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Rezerwacja przyjęta!</h3>
                            <p className="text-gray-600">Dziękujemy za zgłoszenie. Potwierdzenie wysłaliśmy na Twój email.</p>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} /> Data wizyty
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-museum-red/20 outline-none transition"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Clock size={16} /> Godzina
                                    </label>
                                    <select
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-museum-red/20 outline-none transition"
                                    >
                                        <option>10:00</option>
                                        <option>12:00</option>
                                        <option>14:00</option>
                                        <option>16:00</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Users size={16} /> Liczba osób
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={guests}
                                        onChange={(e) => setGuests(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-museum-red/20 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full py-4 bg-museum-red text-white rounded-xl font-bold hover:bg-red-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Potwierdź rezerwację
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-4">
                                    Rezerwacja jest bezpłatna. Płatność za bilet odbywa się w kasie muzeum.
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Booking;