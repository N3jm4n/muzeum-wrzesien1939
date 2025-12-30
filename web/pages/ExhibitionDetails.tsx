import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Info, Landmark, ChevronRight, Loader, Box } from 'lucide-react';
import { exhibitionService } from '../services/exhibitionService';
import { Exhibition } from '../types';

const ExhibitionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [exhibition, setExhibition] = useState<Exhibition | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await exhibitionService.getById(parseInt(id));
                setExhibition(data);
            } catch (error) {
                console.error("Błąd pobierania wystawy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader className="animate-spin text-museum-red h-12 w-12"/></div>;
    if (!exhibition) return <div className="h-screen flex items-center justify-center">Wystawa nie znaleziona.</div>;

    return (
        <div className="min-h-screen bg-gray-50 animate-fade-in">
            {/* Exhibition Hero */}
            <div className="relative h-[60vh] w-full bg-gray-900">
                {exhibition.backgroundImageUrl ? (
                    <img
                        src={exhibition.backgroundImageUrl}
                        alt={exhibition.name}
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20"><Landmark size={120}/></div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4">
                    <div className="max-w-7xl mx-auto w-full">
                        <Link
                            to="/exhibitions"
                            className="mb-6 text-white/80 hover:text-white flex items-center gap-2 transition w-fit"
                        >
                            <ArrowLeft size={20} /> Wróć do listy wystaw
                        </Link>
                        <div className="inline-block px-3 py-1 bg-museum-red text-white text-xs font-bold tracking-widest uppercase mb-4 rounded-sm">
                            Wystawa Czasowa
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 shadow-sm">
                            {exhibition.name}
                        </h1>
                        <div className="flex items-center text-white/90 gap-2">
                            <MapPin size={18} />
                            <span>Muzeum Września 1939</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Description */}
                <div className="lg:col-span-1">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                        <Info className="text-museum-red" /> O wystawie
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-8 whitespace-pre-line">
                        {exhibition.description}
                    </p>
                </div>

                {/* Exhibit List */}
                <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                        <Landmark className="text-museum-red" /> Eksponaty w tej wystawie
                    </h3>

                    {exhibition.exhibits && exhibition.exhibits.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {exhibition.exhibits.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group border border-gray-100 flex flex-col">
                                    <div className="h-48 overflow-hidden relative bg-gray-200">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400"><Box size={32} opacity={0.5}/></div>
                                        )}

                                        {item.productionYear && (
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-xs font-bold text-gray-800">
                                                {item.productionYear}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="text-xs text-museum-red font-bold uppercase mb-1">{item.category}</div>
                                        <h4 className="font-bold text-gray-900 mb-2">{item.name}</h4>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                            {item.description}
                                        </p>

                                        <div className="text-sm font-medium text-gray-400 flex items-center gap-1 mt-auto pt-4 border-t border-gray-100 cursor-default">
                                            W kolekcji <ChevronRight size={16} />
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
};

export default ExhibitionDetails;