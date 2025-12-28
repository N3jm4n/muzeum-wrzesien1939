import React, { useState } from 'react';
import { Search, Heart, ChevronRight, Filter } from 'lucide-react';
import { Exhibit, User } from '../types';

interface CatalogProps {
    user: User | null;
}

const Catalog: React.FC<CatalogProps> = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Wszystkie');

    //TODO Pusta tablica - zaraz podepniemy tu API
    const [exhibits] = useState<Exhibit[]>([]);

    const categories = ['Wszystkie', 'Militaria', 'Uzbrojenie', 'Dokumenty', 'Wirtualne'];

    return (
        <div className="pt-32 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Katalog Zbiorów</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Przeszukaj naszą bazę eksponatów. Od uzbrojenia po osobiste pamiątki.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mb-12 items-center justify-between">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                    selectedCategory === cat
                                        ? 'bg-museum-black text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Szukaj..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border-none shadow-md bg-white focus:ring-2 focus:ring-museum-red/20 outline-none transition"
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
                    </div>
                </div>

                {exhibits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {exhibits.map(item => (
                            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-500 group flex flex-col h-full border border-gray-100">
                                <div className="relative h-64 overflow-hidden">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-museum-black shadow-sm">
                                        {item.productionYear}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs font-bold text-museum-red uppercase tracking-wider mb-2">{item.category}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{item.name}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{item.description}</p>
                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                        <button className="text-sm font-medium text-gray-900 hover:text-museum-red transition flex items-center gap-1 group/btn">
                                            Szczegóły
                                            <ChevronRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition" />
                                        </button>
                                        {user && (
                                            <button className="text-gray-400 hover:text-museum-red transition p-2 hover:bg-red-50 rounded-full">
                                                <Heart className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <Filter className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Ładowanie eksponatów z serwera...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;