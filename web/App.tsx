import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { User, UserRole } from './types';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Exhibitions from './pages/Exhibitions';
import Booking from './pages/Booking';
import Donation from './pages/Donation';
import Admin from './pages/Admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  //TODO W przyszłości tutaj podepniemy API: api.post('/auth/login', ...)
  const handleLogin = (isAdmin: boolean = false) => {
    setUser({
      id: 1,
      email: isAdmin ? 'admin@muzeum.pl' : 'jan@kowalski.pl',
      firstName: isAdmin ? 'Jan' : 'Jan',
      lastName: isAdmin ? 'Kustosz' : 'Kowalski',
      role: isAdmin ? 'ADMIN' : 'USER'
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-museum-paper">
        <Navbar
            user={user}
            onNavigate={handleNavigate}
            currentPage={currentPage}
            onLogout={handleLogout}
        />

        <main className="flex-grow">
          {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
          {currentPage === 'catalog' && <Catalog user={user} />}
          {currentPage === 'exhibitions' && <Exhibitions />}
          {currentPage === 'booking' && <Booking user={user} onNavigate={handleNavigate} />}
          {currentPage === 'donate' && <Donation user={user} onNavigate={handleNavigate} />}
          {currentPage === 'admin' && <Admin user={user} />}

          {currentPage === 'login' && (
              <div className="pt-32 flex justify-center pb-20 px-4">
                <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full border border-gray-100">
                  <h2 className="text-3xl font-serif font-bold mb-2">Witaj w Muzeum</h2>
                  <p className="text-gray-500 mb-8">Wybierz tryb logowania (Symulacja)</p>

                  <div className="space-y-4">
                    <button
                        onClick={() => { handleLogin(false); handleNavigate('home'); }}
                        className="w-full bg-museum-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition shadow-lg"
                    >
                      Zaloguj jako Użytkownik
                    </button>

                    <button
                        onClick={() => { handleLogin(true); handleNavigate('admin'); }}
                        className="w-full bg-white border-2 border-museum-red text-museum-red px-8 py-4 rounded-xl font-medium hover:bg-red-50 transition"
                    >
                      Zaloguj jako Administrator
                    </button>
                  </div>

                  <button
                      onClick={() => handleNavigate('home')}
                      className="mt-8 text-sm text-gray-400 hover:text-gray-600 underline"
                  >
                    Wróć do strony głównej bez logowania
                  </button>
                </div>
              </div>
          )}
        </main>

        {currentPage !== 'login' && <Footer />}
      </div>
  );
};

export default App;