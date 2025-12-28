import React from 'react';
import { ChevronRight, BookOpen, Users, Calendar } from 'lucide-react';

interface HomeProps {
    onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden bg-black">
                <div className="absolute inset-0 opacity-50">
                    <img
                        src="https://picsum.photos/seed/history/1920/1080"
                        alt="Historical Background"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>

                <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-4 sm:px-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-6 animate-fade-in-up">
                        <span className="text-white drop-shadow-lg">Wrzesień 1939</span> <br />
                        <span className="text-museum-red drop-shadow-md">
              na Śląsku
            </span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed animate-fade-in-up delay-100">
                        Odkryj historię heroicznej obrony. Zanurz się w interaktywnej opowieści o ludziach, którzy stanęli w obronie wolności.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200 mb-8">
                        {}
                        <button
                            onClick={() => onNavigate('catalog')}
                            className="px-8 py-4 bg-museum-red text-white rounded-full font-medium hover:bg-red-800 transition shadow-lg hover:shadow-red-900/30 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                        >
                            Zobacz Eksponaty <ChevronRight size={18} />
                        </button>
                        <button
                            onClick={() => onNavigate('booking')}
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition flex items-center justify-center"
                        >
                            Zaplanuj Wizytę
                        </button>
                    </div>
                </div>
            </section>

            {/* Intro Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {}
                    <div className="p-8 rounded-3xl bg-gray-50 hover:bg-gray-100 transition duration-500 group">
                        <div className="h-12 w-12 bg-museum-black text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-museum-red transition-colors shadow-lg shadow-black/20">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Interaktywny Katalog</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Przeglądaj zbiory fizyczne i cyfrowe. Poznaj historię każdego przedmiotu dzięki szczegółowym opisom i modelom 3D.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-50 hover:bg-gray-100 transition duration-500 group">
                        <div className="h-12 w-12 bg-museum-black text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-museum-red transition-colors shadow-lg shadow-black/20">
                            <Users size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Wspólna Historia</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Dołącz do społeczności. Podziel się rodzinnymi pamiątkami i pomóż nam ocalić historię od zapomnienia.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-50 hover:bg-gray-100 transition duration-500 group">
                        <div className="h-12 w-12 bg-museum-black text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-museum-red transition-colors shadow-lg shadow-black/20">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Zaplanuj Wizytę</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Zarezerwuj bilet online. Uniknij kolejek i skorzystaj z dedykowanych ścieżek edukacyjnych.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;