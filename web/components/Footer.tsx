import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-museum-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-xl mb-4 text-museum-red">Muzeum Września 1939</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Upamiętniamy heroiczną walkę żołnierzy Wojska Polskiego i ludności cywilnej na Śląsku we wrześniu 1939 roku.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Godziny otwarcia</h4>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>Wtorek - Piątek: 10:00 - 18:00</li>
            <li>Sobota - Niedziela: 10:00 - 16:00</li>
            <li>Poniedziałek: Nieczynne</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Kontakt</h4>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>Brzozowa 24, 43-100 Tychy</li>
            <li>adominiec@wp.pl</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Muzeum Września 1939 w Tychach. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
};

export default Footer;