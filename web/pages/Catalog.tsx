import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Filter, Loader, ArrowUpDown, Box } from 'lucide-react';
import { Exhibit, User, ExhibitCategory } from '../types';
import { exhibitService } from '../services/exhibitService';

interface CatalogProps {
    user: User | null;
}

const CATEGORY_LABELS: Record<string, string> = {
    UNIFORMS: 'Umundurowanie',
    EQUIPMENT: 'Wyposażenie',
    WEAPONRY: 'Uzbrojenie',
    DOCUMENTS: 'Dokumenty',
    PHOTOS: 'Fotografie',
    EVERYDAY_OBJECTS: 'Przedmioty codzienne',
    OTHER: 'Inne'
};

type SortOption = 'NEWEST' | 'OLDEST' | 'ALPHABETICAL';

const Catalog: React.FC<CatalogProps> = ({ user }) => {
    const [exhibits, setExhibits] = useState<Exhibit[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ExhibitCategory | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('NEWEST');

    useEffect(() => {
        const fetchExhibits = async () => {
            try {
                const data = await exhibitService.getAll();
                setExhibits(data);
            } catch (error) {
                console.error("Błąd pobierania katalogu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExhibits();
    }, []);

    const processedExhibits = exhibits
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'ALPHABETICAL') return a.name.localeCompare(b.name);
            if (sortBy === 'OLDEST') return (parseInt(a.productionYear) || 0) - (parseInt(b.productionYear) || 0);
            if (sortBy === 'NEWEST') return b.id - a.id;
            return 0;
        });

    return (
        <div className="pt-32 min-h-screen bg-gray-50 px-4 pb-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Katalog Zbiorów</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Przeszukaj naszą bazę eksponatów. Od uzbrojenia po osobiste pamiątki z września 1939 roku.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start w-full lg:w-auto">
                        <button
                            onClick={() => setSelectedCategory('ALL')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                selectedCategory === 'ALL'
                                    ? 'bg-museum-black text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            Wszystkie
                        </button>
                        {Object.keys(CATEGORY_LABELS).map((catKey) => (
                            <button
                                key={catKey}
                                onClick={() => setSelectedCategory(catKey as ExhibitCategory)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                    selectedCategory === catKey
                                        ? 'bg-museum-red text-white shadow-lg scale-105 border-museum-red'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {CATEGORY_LABELS[catKey]}
                            </button>
                        ))}
                    </div>

                    {/* Right side: search and filter */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Szukaj..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border-none shadow-sm bg-white focus:ring-2 focus:ring-museum-red/20 outline-none transition"
                            />
                            <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
                        </div>

                        <div className="relative w-full sm:w-48">
                            <div className="absolute left-4 top-3.5 pointer-events-none">
                                <ArrowUpDown className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="w-full pl-11 pr-8 py-3 rounded-2xl border-none shadow-sm bg-white focus:ring-2 focus:ring-museum-red/20 outline-none transition appearance-none cursor-pointer text-gray-700"
                            >
                                <option value="NEWEST">Najnowsze</option>
                                <option value="ALPHABETICAL">Alfabetycznie</option>
                                <option value="OLDEST">Najstarsze (Rok)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* grid of outcomes */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                        <Loader className="h-10 w-10 animate-spin text-museum-red mb-4" />
                        <p>Wczytywanie zbiorów...</p>
                    </div>
                ) : processedExhibits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {processedExhibits.map(item => (
                            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-500 group flex flex-col h-full border border-gray-100">

                                {/* Zdjęcie */}
                                <div className="relative h-64 overflow-hidden bg-gray-100">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <Box size={40} className="mb-2 opacity-50"/>
                                            <span className="text-xs">Brak zdjęcia</span>
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-museum-black shadow-sm border border-gray-100">
                                        {item.productionYear}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs font-bold text-museum-red uppercase tracking-wider mb-2">
                                        {CATEGORY_LABELS[item.category] || item.category}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                                        {item.name}
                                    </h3>

                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <button className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-900 font-bold text-sm hover:bg-museum-black hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                                            Karta obiektu
                                            <ChevronRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Filter className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-bold text-gray-900">Brak wyników</h3>
                        <p>Nie znaleźliśmy eksponatów spełniających Twoje kryteria.</p>
                        <button
                            onClick={() => {setSearchTerm(''); setSelectedCategory('ALL');}}
                            className="mt-4 text-museum-red font-bold hover:underline"
                        >
                            Wyczyść filtry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;