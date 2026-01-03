import React, { useState, useEffect } from 'react';
import { Menu, X, Landmark, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';
// @ts-ignore
import logoImage from '../assets/logo_no_bg_cropped.png';

interface NavbarProps {
  user: User | null;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, currentPage, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = currentPage === 'home';
  const showGlass = isScrolled || !isHome;

  const navClass = `fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
      showGlass
          ? 'bg-white/20 backdrop-blur-xl border-b border-white/10 shadow-sm py-3 supports-[backdrop-filter]:bg-white/20'
          : 'bg-transparent py-6'
  }`;

  const textClass = showGlass ? 'text-gray-900' : 'text-white';
  const subTextClass = showGlass ? 'text-gray-600' : 'text-gray-300';
  const iconBgClass = showGlass ? 'bg-museum-red text-white' : 'bg-white/10 text-white';

  const linkClass = (page: string) => `
    cursor-pointer text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full
    ${currentPage === page
      ? 'bg-museum-red text-white shadow-md'
      : showGlass
          ? 'text-gray-700 hover:bg-gray-100 hover:text-museum-red'
          : 'text-white/90 hover:bg-white/10 hover:text-white'
  }
  `;

  const handleMobileNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileOpen(false);
  };

  return (
      <nav className={navClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <div
                className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => onNavigate('home')}
            >
              <img
                  src={logoImage}
                  alt="Muzeum Września 1939"
                  className="h-14 w-auto object-contain"
              />
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              <button onClick={() => onNavigate('home')} className={linkClass('home')}>Strona Główna</button>
              <button onClick={() => onNavigate('exhibitions')} className={linkClass('exhibitions')}>Wystawy</button>
              <button onClick={() => onNavigate('catalog')} className={linkClass('catalog')}>Katalog</button>
              <button onClick={() => onNavigate('booking')} className={linkClass('booking')}>Rezerwacje</button>
              <button onClick={() => onNavigate('donate')} className={linkClass('donate')}>Dla Darczyńców</button>

              {user?.role === 'ROLE_ADMIN' && (
                  <button onClick={() => onNavigate('admin')} className={linkClass('admin')}>Panel Admina</button>
              )}

              {user ? (
                  <div className={`flex items-center gap-3 ml-6 pl-6 border-l ${showGlass ? 'border-gray-200' : 'border-white/20'}`}>
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-bold leading-none ${textClass}`}>{user.firstName} {user.lastName}</span>
                      <span className={`text-xs ${subTextClass}`}>{user.role === 'ROLE_ADMIN' ? 'Kustosz' : 'Zwiedzający'}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className={`p-2 rounded-full transition ${showGlass ? 'hover:bg-red-50 text-gray-500 hover:text-red-600' : 'hover:bg-white/20 text-white'}`}
                        title="Wyloguj się"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
              ) : (
                  <button
                      onClick={() => onNavigate('login')}
                      className="ml-4 px-6 py-2.5 rounded-full bg-museum-black text-white text-sm font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <UserIcon size={16} />
                    Zaloguj się
                  </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden">
              <button onClick={() => setIsMobileOpen(!isMobileOpen)} className={`p-2 transition ${textClass}`}>
                {isMobileOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl py-8 flex flex-col items-center space-y-6 animate-fade-in min-h-screen z-40">
              <button onClick={() => handleMobileNavigate('home')} className="text-gray-900 font-bold text-xl">Strona Główna</button>
              <button onClick={() => handleMobileNavigate('exhibitions')} className="text-gray-900 font-medium text-lg">Wystawy</button>
              <button onClick={() => handleMobileNavigate('catalog')} className="text-gray-900 font-medium text-lg">Katalog</button>
              <button onClick={() => handleMobileNavigate('booking')} className="text-gray-900 font-medium text-lg">Rezerwacje</button>
              <button onClick={() => handleMobileNavigate('donate')} className="text-gray-900 font-medium text-lg">Dla Darczyńców</button>

              {user?.role === 'ROLE_ADMIN' && (
                  <button onClick={() => handleMobileNavigate('admin')} className="text-museum-red font-bold text-lg">Panel Admina</button>
              )}

              <div className="w-16 h-1 bg-gray-100 rounded-full my-4"></div>

              {user ? (
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-gray-500 font-medium">Zalogowano jako: <span className="text-gray-900 font-bold">{user.firstName}</span></span>
                    <button onClick={() => { onLogout(); setIsMobileOpen(false); }} className="flex items-center gap-2 text-red-600 font-medium">
                      <LogOut size={18} /> Wyloguj się
                    </button>
                  </div>
              ) : (
                  <button onClick={() => handleMobileNavigate('login')} className="px-10 py-4 bg-museum-black text-white rounded-2xl font-bold shadow-xl">
                    Zaloguj się
                  </button>
              )}
            </div>
        )}
      </nav>
  );
};

export default Navbar;