import React, { useState, useEffect } from 'react';
import { Gift, UploadCloud, Clock, CheckCircle, XCircle, Send, Loader, Image as ImageIcon } from 'lucide-react';
import { User, Donation as DonationType } from '../types';
import { donationService } from '../services/donationService';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';

interface DonationProps {
    user: User | null;
    onNavigate?: (page: string) => void;
}

const Donation: React.FC<DonationProps> = ({ user }) => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<DonationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        itemName: '',
        description: '',
        imageUrl: ''
    });

    const fetchHistory = async () => {
        try {
            const data = await donationService.getMyDonations();
            setHistory(data.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Błąd pobierania historii:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1280,
                    useWebWorker: true,
                    fileType: 'image/jpeg'
                };

                const compressedFile = await imageCompression(file, options);

                const reader = new FileReader();
                reader.onloadend = () => {
                    setForm(prev => ({ ...prev, imageUrl: reader.result as string }));
                };
                reader.readAsDataURL(compressedFile);
            } catch (err) {
                alert("Błąd przetwarzania zdjęcia.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.imageUrl) {
            alert("Proszę dodać zdjęcie przedmiotu.");
            return;
        }

        setSubmitting(true);
        try {
            await donationService.create(form);
            alert("Dziękujemy! Twoje zgłoszenie zostało wysłane do kustosza.");
            setForm({ itemName: '', description: '', imageUrl: '' }); // Reset
            fetchHistory(); // Odśwież listę
        } catch (error) {
            alert("Wystąpił błąd podczas wysyłania.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-32 text-center min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <Gift size={64} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Dołącz do darczyńców</h2>
                <p className="text-gray-600 mt-2 mb-6">Musisz się zalogować, aby przekazać pamiątki do muzeum.</p>
                <button onClick={() => navigate('/login')} className="px-6 py-3 bg-museum-red text-white rounded-xl font-bold hover:bg-red-700 transition">
                    Przejdź do logowania
                </button>
            </div>
        );
    }

    return (
        <div className="pt-28 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                <div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Przekaż Pamiątkę</h1>
                        <p className="text-gray-600">
                            Masz w domu przedmioty z 1939 roku? Zgłoś je do nas.
                            Kustosz oceni ich wartość historyczną i zdecyduje o włączeniu do zbiorów.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nazwa przedmiotu</label>
                            <input
                                required
                                type="text"
                                value={form.itemName}
                                onChange={e => setForm({...form, itemName: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-museum-red/20 outline-none"
                                placeholder="np. Legitymacja wojskowa, Hełm wz. 31"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Opis historii przedmiotu</label>
                            <textarea
                                required
                                rows={4}
                                value={form.description}
                                onChange={e => setForm({...form, description: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-museum-red/20 outline-none"
                                placeholder="Skąd pochodzi przedmiot? Do kogo należał?"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Zdjęcie</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative group cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                {form.imageUrl ? (
                                    <div className="relative h-48 rounded-lg overflow-hidden">
                                        <img src={form.imageUrl} alt="Podgląd" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-bold">
                                            Zmień zdjęcie
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-4">
                                        <UploadCloud size={40} className="text-gray-400 mb-2 group-hover:text-museum-red transition"/>
                                        <span className="text-sm text-gray-500">Kliknij, aby dodać zdjęcie</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full py-4 bg-museum-black text-white rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {submitting ? <Loader className="animate-spin"/> : <Send size={20} />}
                            Wyślij Zgłoszenie
                        </button>
                    </form>
                </div>

                {/* right col: history */}
                <div>
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Twoje Zgłoszenia</h2>
                        <p className="text-gray-600">Statusy Twoich poprzednich darowizn.</p>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-10"><Loader className="animate-spin h-8 w-8 mx-auto text-gray-400"/></div>
                        ) : history.length > 0 ? (
                            history.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">

                                    <div className="h-20 w-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-gray-400"/></div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900">{item.itemName}</h3>
                                            {/* STATUS BADGES */}
                                            {item.status === 'PENDING' && (
                                                <span className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          <Clock size={12}/> Weryfikacja
                        </span>
                                            )}
                                            {item.status === 'ACCEPTED' && (
                                                <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          <CheckCircle size={12}/> Przyjęto
                        </span>
                                            )}
                                            {item.status === 'REJECTED' && (
                                                <span className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          <XCircle size={12}/> Odrzucono
                        </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                        <div className="mt-2 text-xs text-gray-400">
                                            ID zgłoszenia: #{item.id}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                                <Gift className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <p className="text-gray-500">Brak historii zgłoszeń.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Donation;