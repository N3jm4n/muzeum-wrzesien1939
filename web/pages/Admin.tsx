import React, { useState, useEffect } from 'react';
import { Shield, Gift, Plus, Image, Save, Check, X, CheckCircle, UploadCloud, Search, Loader, Calendar, Users } from 'lucide-react';
import { User, Donation, Exhibit, ExhibitCategory } from '../types';
import { adminService } from '../services/adminService';
import { bookingService } from '../services/bookingService'; // Upewnij się, że ścieżka jest poprawna
import imageCompression from 'browser-image-compression';

interface AdminProps {
    user: User | null;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'donations' | 'addExhibit' | 'addExhibition' | 'reservations'>('donations');

    const [pendingDonations, setPendingDonations] = useState<Donation[]>([]);
    const [availableExhibits, setAvailableExhibits] = useState<Exhibit[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dailyReservations, setDailyReservations] = useState<any[]>([]);
    const [loadingReservations, setLoadingReservations] = useState(false);

    const [exhibitForm, setExhibitForm] = useState({
        name: '',
        description: '',
        productionYear: '',
        imageUrl: '',
        category: 'UNIFORMS' as ExhibitCategory
    });

    const [exhibitionForm, setExhibitionForm] = useState({
        name: '',
        description: '',
        backgroundImageUrl: '',
        selectedExhibitIds: [] as number[]
    });

    const fetchDonations = async () => {
        try {
            const data = await adminService.getAllDonations();
            setPendingDonations(data.filter(d => d.status === 'PENDING'));
        } catch (error) {
            console.error("Błąd pobierania darowizn", error);
        }
    };

    const fetchExhibits = async () => {
        try {
            const data = await adminService.getAllExhibits();
            setAvailableExhibits(data);
        } catch (error) {
            console.error("Błąd pobierania eksponatów", error);
        }
    };

    useEffect(() => {
        if (user?.role === 'ROLE_ADMIN') {
            if (activeTab === 'donations') fetchDonations();
            if (activeTab === 'addExhibition') fetchExhibits();
        }
    }, [activeTab, user]);

    useEffect(() => {
        if (activeTab === 'reservations') {
            const fetchReservations = async () => {
                setLoadingReservations(true);
                try {
                    const data = await bookingService.getByDate(selectedDate);
                    const sorted = data.sort((a, b) => a.visitTime.localeCompare(b.visitTime));
                    setDailyReservations(sorted);
                } catch (error) {
                    console.error("Błąd pobierania rezerwacji:", error);
                } finally {
                    setLoadingReservations(false);
                }
            };
            fetchReservations();
        }
    }, [selectedDate, activeTab]);

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, formSetter: any, isBanner: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const options = isBanner ? {
                    maxSizeMB: 2.0,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: 'image/jpeg',
                    initialQuality: 0.95
                } : {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 1280,
                    useWebWorker: true,
                    fileType: 'image/webp',
                    initialQuality: 0.8
                };

                setIsLoading(true);
                const compressedFile = await imageCompression(file, options);

                const reader = new FileReader();
                reader.onloadend = () => {
                    formSetter((prev: any) => ({
                        ...prev,
                        imageUrl: reader.result as string,
                        backgroundImageUrl: reader.result as string
                    }));
                    setIsLoading(false);
                };
                reader.readAsDataURL(compressedFile);

            } catch (error) {
                console.error("Błąd przetwarzania:", error);
                setIsLoading(false);
            }
        }
    };

    const toggleExhibitSelection = (id: number) => {
        setExhibitionForm(prev => {
            const isSelected = prev.selectedExhibitIds.includes(id);
            if (isSelected) {
                return { ...prev, selectedExhibitIds: prev.selectedExhibitIds.filter(exId => exId !== id) };
            } else {
                return { ...prev, selectedExhibitIds: [...prev.selectedExhibitIds, id] };
            }
        });
    };

    const handleDonationDecision = async (id: number, decision: 'ACCEPTED' | 'REJECTED') => {
        try {
            await adminService.updateDonationStatus(id, decision);
            setPendingDonations(prev => prev.filter(d => d.id !== id));
            showSuccess(`Zgłoszenie zostało ${decision === 'ACCEPTED' ? 'zaakceptowane' : 'odrzucone'}`);
        } catch (error) {
            alert("Błąd połączenia z serwerem. Sprawdź konsolę.");
        }
    };

    const handleAddExhibit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await adminService.addExhibit(exhibitForm);
            showSuccess('Pomyślnie dodano nowy eksponat do bazy!');
            setExhibitForm({ name: '', description: '', productionYear: '', imageUrl: '', category: 'UNIFORMS' });
        } catch (error) {
            alert("Błąd zapisu. Jeśli zdjęcie jest bardzo duże, może przekraczać limity serwera.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddExhibition = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await adminService.addExhibition({
                name: exhibitionForm.name,
                description: exhibitionForm.description,
                backgroundImageUrl: exhibitionForm.backgroundImageUrl,
                exhibitIds: exhibitionForm.selectedExhibitIds
            });
            showSuccess(`Utworzono wystawę z ${exhibitionForm.selectedExhibitIds.length} eksponatami!`);
            setExhibitionForm({ name: '', description: '', backgroundImageUrl: '', selectedExhibitIds: [] });
        } catch (error) {
            alert("Błąd podczas tworzenia wystawy.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredExhibits = availableExhibits.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalGuests = dailyReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);

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
                        <div className="p-3 bg-museum-black text-white rounded-xl">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900">Panel Kustosza</h2>
                            <p className="text-gray-500">Zarządzanie zbiorami muzeum</p>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 animate-fade-in shadow-sm font-medium">
                            <CheckCircle size={18} /> {successMsg}
                        </div>
                    )}
                </div>

                {/* TABS (Navigation) */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-1">
                    <button
                        onClick={() => setActiveTab('donations')}
                        className={`px-6 py-3 font-medium rounded-t-xl transition-all ${activeTab === 'donations' ? 'bg-white text-museum-red border-b-2 border-museum-red shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Weryfikacja Darowizn
                        {pendingDonations.length > 0 && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">{pendingDonations.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('addExhibit')}
                        className={`px-6 py-3 font-medium rounded-t-xl transition-all ${activeTab === 'addExhibit' ? 'bg-white text-museum-red border-b-2 border-museum-red shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Dodaj Eksponat
                    </button>
                    <button
                        onClick={() => setActiveTab('addExhibition')}
                        className={`px-6 py-3 font-medium rounded-t-xl transition-all ${activeTab === 'addExhibition' ? 'bg-white text-museum-red border-b-2 border-museum-red shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Utwórz Wystawę
                    </button>
                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={`px-6 py-3 font-medium rounded-t-xl transition-all ${activeTab === 'reservations' ? 'bg-white text-museum-red border-b-2 border-museum-red shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Rezerwacje
                    </button>
                </div>

                {/* CONTENT AREA */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">

                    {/* TAB 1: DONATIONS */}
                    {activeTab === 'donations' && (
                        <div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Gift className="text-gray-400" /> Oczekujące zgłoszenia
                            </h3>
                            <div className="space-y-4">
                                {pendingDonations.length > 0 ? (
                                    pendingDonations.map((item) => (
                                        <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4 border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Brak</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-lg">{item.itemName}</div>
                                                    <div className="text-sm text-gray-600 mb-1 line-clamp-1">{item.description}</div>
                                                    <div className="text-xs text-gray-400">Zgłosił: {item.donorEmail}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                                                <button onClick={() => handleDonationDecision(item.id, 'ACCEPTED')} className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl font-bold transition"><Check size={18}/> Przyjmij</button>
                                                <button onClick={() => handleDonationDecision(item.id, 'REJECTED')} className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold transition"><X size={18}/> Odrzuć</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 text-gray-400">
                                        <CheckCircle className="mx-auto h-12 w-12 mb-3 opacity-20" />
                                        <p>Brak nowych zgłoszeń do weryfikacji.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: ADD EXHIBIT */}
                    {activeTab === 'addExhibit' && (
                        <form onSubmit={handleAddExhibit} className="max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="text-gray-400" /> Nowy Eksponat
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa eksponatu</label>
                                    <input required type="text" value={exhibitForm.name} onChange={e => setExhibitForm({...exhibitForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 transition" placeholder="np. Karabin Mauser" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rok powstania</label>
                                    <input required type="text" value={exhibitForm.productionYear} onChange={e => setExhibitForm({...exhibitForm, productionYear: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 transition" placeholder="np. 1939" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                                <select value={exhibitForm.category} onChange={e => setExhibitForm({...exhibitForm, category: e.target.value as ExhibitCategory})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 transition cursor-pointer">
                                    <option value="UNIFORMS">Umundurowanie</option>
                                    <option value="EQUIPMENT">Wyposażenie</option>
                                    <option value="WEAPONRY">Uzbrojenie</option>
                                    <option value="DOCUMENTS">Dokumenty</option>
                                    <option value="PHOTOS">Fotografie</option>
                                    <option value="EVERYDAY_OBJECTS">Przedmioty codzienne</option>
                                    <option value="OTHER">Inne</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
                                <textarea required rows={4} value={exhibitForm.description} onChange={e => setExhibitForm({...exhibitForm, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 transition" placeholder="Krótki opis historyczny..." />
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Zdjęcie</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative group">
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setExhibitForm)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    {exhibitForm.imageUrl ? (
                                        <div className="relative h-48 mx-auto rounded-lg overflow-hidden">
                                            <img src={exhibitForm.imageUrl} alt="Podgląd" className="h-full w-full object-contain" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-bold">Kliknij aby zmienić</div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <UploadCloud size={48} className="mb-2 text-gray-300 group-hover:text-museum-red transition" />
                                            <p>Upuść zdjęcie lub kliknij</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button disabled={isLoading} type="submit" className="w-full py-4 bg-museum-black text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                {isLoading ? <Loader className="animate-spin"/> : <Save size={20} />} Zapisz Eksponat
                            </button>
                        </form>
                    )}

                    {/* TAB 3: CREATE EXHIBITION */}
                    {activeTab === 'addExhibition' && (
                        <form onSubmit={handleAddExhibition} className="max-w-5xl mx-auto">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="text-gray-400" /> Kreator Wystawy
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł wystawy</label>
                                        <input required type="text" value={exhibitionForm.name} onChange={e => setExhibitionForm({...exhibitionForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 transition" />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Opis wystawy</label>
                                        <textarea required rows={4} value={exhibitionForm.description} onChange={e => setExhibitionForm({...exhibitionForm, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 transition" />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Baner wystawy (Tło)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition relative group">
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setExhibitionForm, true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            {exhibitionForm.backgroundImageUrl ? (
                                                <div className="relative h-40 mx-auto rounded-lg overflow-hidden">
                                                    <img src={exhibitionForm.backgroundImageUrl} alt="Podgląd" className="h-full w-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-bold">Zmień baner</div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500 py-6">
                                                    <Image size={32} className="mb-2 text-gray-300 group-hover:text-museum-red transition" />
                                                    <p className="text-sm">Dodaj grafikę tła</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col h-[550px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block font-bold text-gray-900">Dołącz eksponaty</label>
                                        <span className="text-xs bg-museum-black text-white px-2 py-1 rounded-full font-bold">{exhibitionForm.selectedExhibitIds.length}</span>
                                    </div>

                                    {/* Search for exhibits */}
                                    <div className="relative mb-4">
                                        <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            placeholder="Szukaj w bazie..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-museum-red focus:ring-1 focus:ring-museum-red"
                                        />
                                    </div>

                                    {/* List of exhibits */}
                                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {availableExhibits.length === 0 ? (
                                            <p className="text-sm text-gray-500 text-center py-10">Brak eksponatów w bazie. Dodaj najpierw eksponat w drugiej zakładce.</p>
                                        ) : filteredExhibits.length === 0 ? (
                                            <p className="text-sm text-gray-500 text-center py-4">Nie znaleziono.</p>
                                        ) : (
                                            filteredExhibits.map(item => {
                                                const isSelected = exhibitionForm.selectedExhibitIds.includes(item.id);
                                                return (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => toggleExhibitSelection(item.id)}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                                                            isSelected
                                                                ? 'bg-red-50 border-museum-red ring-1 ring-museum-red'
                                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${isSelected ? 'bg-museum-red border-museum-red' : 'border-gray-300 bg-white'}`}>
                                                            {isSelected && <Check size={12} className="text-white" />}
                                                        </div>

                                                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                            {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm text-gray-900 truncate">{item.name}</div>
                                                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{item.category}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full py-4 bg-museum-black text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader className="animate-spin"/> : <Save size={20} />}
                                    Utwórz Wystawę i Przypisz Eksponaty
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB 4: RESERVATIONS */}
                    {activeTab === 'reservations' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Harmonogram Wizyt</h2>
                                    <p className="text-gray-500">Sprawdź listę gości na wybrany dzień.</p>
                                </div>

                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                                    <Calendar size={20} className="text-museum-red" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="bg-transparent outline-none font-bold text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                        <Users size={32} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">Łącznie osób tego dnia</div>
                                        <div className="text-3xl font-bold text-gray-900">{totalGuests}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">Liczba grup/rezerwacji</div>
                                    <div className="text-xl font-bold text-gray-700">{dailyReservations.length}</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                {loadingReservations ? (
                                    <div className="p-12 text-center text-gray-400 flex justify-center"><Loader className="animate-spin" /></div>
                                ) : dailyReservations.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Godzina</th>
                                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Gość</th>
                                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Email</th>
                                                <th className="p-6 text-xs font-bold text-gray-500 uppercase text-center">Liczba osób</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                            {dailyReservations.map((res) => (
                                                <tr key={res.id} className="hover:bg-gray-50 transition">
                                                    <td className="p-6 font-bold text-museum-red whitespace-nowrap">
                                                        {res.visitTime.slice(0, 5)}
                                                    </td>
                                                    <td className="p-6 font-medium text-gray-900">
                                                        {res.firstName} {res.lastName}
                                                    </td>
                                                    <td className="p-6 text-gray-500 text-sm">
                                                        {res.userEmail}
                                                    </td>
                                                    <td className="p-6 text-center">
                                                      <span className="inline-block px-3 py-1 bg-gray-100 rounded-full font-bold text-sm text-gray-700">
                                                        {res.numberOfGuests}
                                                      </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                                        <Calendar size={48} className="mb-4 opacity-20"/>
                                        <p>Brak rezerwacji na ten dzień.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Admin;