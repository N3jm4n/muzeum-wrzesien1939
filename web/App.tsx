import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { User } from './types';
import { authService } from './services/authService';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Exhibitions from './pages/Exhibitions';
import ExhibitionDetails from './pages/ExhibitionDetails';
import Booking from './pages/Booking';
import Donation from './pages/Donation';
import Admin from './pages/Admin';
import Login from './pages/Login';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    navigate('/');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };


  const handleNavigate = (page: string) => {
    switch (page) {
      case 'home': navigate('/'); break;
      case 'catalog': navigate('/catalog'); break;
      case 'exhibitions': navigate('/exhibitions'); break;
      case 'booking': navigate('/booking'); break;
      case 'donate': navigate('/donate'); break;
      case 'admin': navigate('/admin'); break;
      case 'login': navigate('/login'); break;
      default: navigate('/');
    }
    window.scrollTo(0, 0);
  };

  const getCurrentPageKey = () => {
    const path = window.location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/catalog')) return 'catalog';
    if (path.startsWith('/exhibitions')) return 'exhibitions';
    if (path.startsWith('/booking')) return 'booking';
    if (path.startsWith('/donate')) return 'donate';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/login')) return 'login';
    return 'home';
  };

  return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-museum-paper">
        <Navbar
            user={user}
            onNavigate={handleNavigate}
            currentPage={getCurrentPageKey()}
            onLogout={handleLogout}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onNavigate={handleNavigate} />} />
            <Route path="/catalog" element={<Catalog user={user} />} />

            <Route path="/exhibitions" element={<Exhibitions />} />
            <Route path="/exhibitions/:id" element={<ExhibitionDetails />} />

            <Route path="/booking" element={<Booking user={user} onNavigate={handleNavigate} />} />
            <Route path="/donate" element={<Donation user={user} onNavigate={handleNavigate} />} />
            <Route path="/admin" element={<Admin user={user} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} onNavigate={handleNavigate} />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {window.location.pathname !== '/login' && <Footer />}
      </div>
  );
};

const App: React.FC = () => {
  return (
      <Router>
        <AppContent />
      </Router>
  );
};

export default App;