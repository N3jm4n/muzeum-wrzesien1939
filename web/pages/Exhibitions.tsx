import React, { useState } from 'react';
import { MapPin, ArrowLeft, Info, Landmark, ChevronRight, Filter } from 'lucide-react';
import { Exhibition } from '../types';

const Exhibitions: React.FC = () => {
    const [selectedExhibitionId, setSelectedExhibitionId] = useState<number | null>(null);

    // TODO: Tu wkrótce podepniemy api.get('/exhibitions')
    // Na razie pusta tablica = stan ładowania
    const [exhibitions] = useState<Exhibition[]>([]);

    // Helper do znalezienia wybranej wystawy
    const selectedExhibition = exhibitions.find(e => e.id === selectedExhibitionId);

    // --- WIDOK SZCZEGÓŁÓW ---
    if (selectedExhibitionId && selectedExhibition) {
        return (
            <div className="min-h-screen bg-gray-50 animate-fade-in">
                {/* Exhibition Hero */}
                <div className="relative h-[60vh] w-full">
                    <img
                        src={selectedExhibition.backgroundImageUrl}
                        alt={selectedExhibition.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4">
                        <div className="max-w-7xl mx-auto w-full">
                            <button
                                onClick={() => setSelectedExhibitionId(null)}
                                className="mb-6 text-white/80 hover:text-white flex items-center gap-2 transition"
                            >
                                <ArrowLeft size={20} /> Wróć do listy wystaw
                            </button>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 shadow-sm">
                                {selectedExhibition.name}
                            </h1>
                            {/* Opcjonalnie: Lokalizacja, jeśli backend ją zwróci (teraz w typach jej nie mamy, więc pomijam) */}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Description */}
                    <div className="lg:col-span-1">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Info className="text-museum-red" /> O wystawie
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg mb-8 whitespace-pre-line">
                            {selectedExhibition.description}
                        </p>
                    </div>

                    {/* Exhibit List */}
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Landmark className="text-museum-red" /> Eksponaty w tej wystawie
                        </h3>

                        {selectedExhibition.exhibits && selectedExhibition.exhibits.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedExhibition.exhibits.map(item => (
                                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group border border-gray-100 flex flex-col">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-xs font-bold">
                                                {item.productionYear}
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="text-xs text-museum-red font-bold uppercase mb-1">{item.category}</div>
                                            <h4 className="font-bold text-gray-900 mb-2">{item.name}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{item.description}</p>

                                            {/* Przycisk jest tylko wizualny, bo nie mamy widoku pojedynczego eksponatu */}
                                            <div className="text-sm font-medium text-gray-900 hover:text-museum-red flex items-center gap-1 mt-auto pt-4 border-t border-gray-100 cursor-pointer">
                                                Zobacz szczegóły <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 bg-white rounded-2xl border border-gray-100 text-center text-gray-500">
                                Ta wystawa nie ma jeszcze przypisanych eksponatów cyfrowych.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- WIDOK LISTY ---
    return (
        <div className="pt-32 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Wystawy Muzealne</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Zapraszamy do zapoznania się z naszymi wystawami stałymi i czasowymi.
                    </p>
                </div>

                {exhibitions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-12">
                        {exhibitions.map((exhibition, index) => (
                            <div
                                key={exhibition.id}
                                className={`flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 group cursor-pointer ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                                onClick={() => setSelectedExhibitionId(exhibition.id)}
                            >
                                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                                    <img
                                        src={exhibition.backgroundImageUrl}
                                        alt={exhibition.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out grayscale group-hover:grayscale-0"
                                    />
                                </div>
                                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-museum-red font-bold text-sm uppercase tracking-widest mb-3">
                                        <Landmark size={16} /> Wystawa
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4 group-hover:text-museum-red transition-colors">
                                        {exhibition.name}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-8 text-lg line-clamp-3">
                                        {exhibition.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                     <span className="flex items-center text-gray-500 text-sm gap-2">
                       <MapPin size={16} /> Zobacz kolekcję
                     </span>
                                        <button className="px-6 py-2 rounded-full border border-gray-300 text-gray-900 font-medium hover:bg-museum-black hover:text-white hover:border-museum-black transition">
                                            Wejdź
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <Filter className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Ładowanie wystaw z serwera...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exhibitions;