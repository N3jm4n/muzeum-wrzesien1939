import React, { useState, useEffect } from 'react';
import { Landmark, MapPin, Loader, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exhibitionService } from '../services/exhibitionService';
import { Exhibition } from '../types';

const Exhibitions: React.FC = () => {
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExhibitions = async () => {
            try {
                const data = await exhibitionService.getAll();
                setExhibitions(data);
            } catch (error) {
                console.error("Błąd pobierania wystaw:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExhibitions();
    }, []);

    return (
        <div className="pt-32 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Wystawy Muzealne</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Zapraszamy do zapoznania się z naszymi wystawami stałymi i czasowymi.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader className="animate-spin text-museum-red h-10 w-10"/></div>
                ) : (
                    <div className="grid grid-cols-1 gap-12">
                        {exhibitions.map((exhibition, index) => (
                            <Link
                                to={`/exhibitions/${exhibition.id}`}
                                key={exhibition.id}
                                className={`flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 group cursor-pointer border border-gray-100 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="md:w-1/2 h-64 md:h-96 overflow-hidden relative bg-gray-200">
                                    {exhibition.backgroundImageUrl ? (
                                        <img
                                            src={exhibition.backgroundImageUrl}
                                            alt={exhibition.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out grayscale group-hover:grayscale-0"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col">
                                            <ImageIcon size={48} className="opacity-50 mb-2"/> Brak zdjęcia
                                        </div>
                                    )}

                                    <div className="absolute top-4 left-4 bg-museum-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                                        Wystawa Czasowa
                                    </div>
                                </div>

                                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-museum-red font-bold text-sm uppercase tracking-widest mb-3">
                                        <Landmark size={16} /> Kolekcja Muzealna
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4 group-hover:text-museum-red transition-colors">
                                        {exhibition.name}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-8 text-lg line-clamp-3">
                                        {exhibition.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-6">
                     <span className="flex items-center text-gray-500 text-sm gap-2">
                       <MapPin size={16} /> Sala Główna
                     </span>
                                        <span className="px-6 py-2 rounded-full border border-gray-300 text-gray-900 font-medium group-hover:bg-museum-black group-hover:text-white group-hover:border-museum-black transition flex items-center gap-2">
                       Zobacz Wystawę <ArrowRight size={16} />
                     </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exhibitions;