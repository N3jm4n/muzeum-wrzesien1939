import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-museum-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-xl mb-4 text-museum-red">Muzeum Września 1939</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Upamiętniamy bohaterską walkę żołnierzy Wojska Polskiego na Śląsku we wrześniu 1939 roku.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Godziny otwarcia</h4>
          <ul className="text-gray-400 text-sm space-y-3">
            <li className="flex justify-between items-center">
              <span>Wtorek - Niedziela</span>
              <span className="text-museum-red font-medium">9:00 - 17:00</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Poniedziałek</span>
              <span className="text-gray-500">Nieczynne</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Kontakt</h4>
          <ul className="text-gray-400 text-sm space-y-3">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-museum-red mt-0.5 shrink-0" />
              <span>Wyzwolenia 73A, 42-583 Bobrowniki</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-museum-red shrink-0" />
              <span>+48 506 196 338</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-museum-red shrink-0" />
              <span>adominiec@wp.pl</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Muzeum Września 1939. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
};

export default Footer;