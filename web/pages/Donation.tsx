import React, { useState } from 'react';
import { Upload, Gift, Camera, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface DonationProps {
    user: User | null;
    onNavigate: (page: string) => void;
}

const Donation: React.FC<DonationProps> = ({ user, onNavigate }) => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: api.post('/donations', { itemName, description, ... })

        console.log('Wysłano darowiznę:', { itemName, description });
        setIsSuccess(true);

        setTimeout(() => {
            setIsSuccess(false);
            setItemName('');
            setDescription('');
        }, 3000);
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">

                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-full bg-red-50 text-museum-red mb-4 shadow-sm">
                        <Gift size={32} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Przekaż Pamiątkę</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Masz w domu przedmioty związane z wrześniem 1939? Zgłoś je do muzeum. <br/>
                        Przyjmujemy zarówno dary fizyczne, jak i cyfrowe skany.
                    </p>
                </div>

                {!user ? (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Wymagane logowanie</h3>
                        <p className="text-gray-500 mb-6 px-4">Aby zgłosić przedmiot, musisz posiadać konto w naszym systemie.</p>
                        <button
                            onClick={() => onNavigate('login')}
                            className="bg-museum-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
                        >
                            Zaloguj się
                        </button>
                    </div>
                ) : isSuccess ? (
                    <div className="flex flex-col items-center justify-center text-center py-10 animate-fade-in-up">
                        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Dziękujemy!</h3>
                        <p className="text-gray-600">Twój przedmiot trafił do weryfikacji przez kustosza. <br/>Status zgłoszenia możesz sprawdzić w panelu.</p>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa przedmiotu</label>
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 transition"
                                placeholder="np. Medal Wojskowy, List z frontu"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Opis historyczny</label>
                            <textarea
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 transition"
                                placeholder="Opisz historię przedmiotu, datę pochodzenia i okoliczności wejścia w jego posiadanie..."
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zdjęcia (Symulacja)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer group">
                                <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-museum-red mb-3 transition" />
                                <p className="text-gray-600 text-sm">
                                    <span className="text-museum-red font-medium">Kliknij, aby dodać zdjęcia</span> lub upuść je tutaj
                                </p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG do 10MB</p>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-museum-red text-white rounded-xl font-bold hover:bg-red-800 transition shadow-lg hover:shadow-red-900/20 transform hover:-translate-y-0.5">
                            Wyślij Zgłoszenie
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Donation;