import React, { useState } from 'react';
import { Shield, ArrowLeft, Mail, Lock, LogIn, AlertCircle, User, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginProps {
    onLogin: (user: any) => void;
    onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let user;

            if (isLoginMode) {
                user = await authService.login({ email, password });
            } else {
                user = await authService.register({
                    firstName,
                    lastName,
                    email,
                    password
                });
            }

            onLogin(user);

            if (user.role === 'ROLE_ADMIN') {
                onNavigate('admin');
            } else {
                onNavigate('home');
            }

        } catch (err: any) {
            console.error(err);
            if (isLoginMode) {
                if (err.response && err.response.status === 403) {
                    setError('Błędny email lub hasło.');
                } else {
                    setError('Wystąpił błąd podczas logowania.');
                }
            } else {
                if (err.response && err.response.status === 409) {
                    setError('Taki użytkownik już istnieje.');
                } else {
                    setError('Nie udało się utworzyć konta. Spróbuj ponownie.');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setPassword('');
    };

    return (
        <div className="pt-32 min-h-screen flex justify-center px-4 pb-20 animate-fade-in">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 h-fit transition-all duration-300">

                <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-gray-50 rounded-full text-museum-red">
                        <Shield size={40} />
                    </div>
                </div>

                <h2 className="text-3xl font-serif font-bold mb-2 text-center text-gray-900">
                    {isLoginMode ? 'Witaj ponownie' : 'Utwórz konto'}
                </h2>
                <p className="text-gray-500 mb-8 text-center">
                    {isLoginMode
                        ? 'Wprowadź swoje dane, aby uzyskać dostęp.'
                        : 'Wypełnij formularz, aby dołączyć do nas.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {!isLoginMode && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Imię</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-museum-red/20 outline-none transition"
                                        placeholder="Jan"
                                        required={!isLoginMode}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nazwisko</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-museum-red/20 outline-none transition"
                                        placeholder="Kowalski"
                                        required={!isLoginMode}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adres Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-museum-red/20 outline-none transition"
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hasło</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-museum-red/20 outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl animate-pulse">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-museum-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-70 mt-6"
                    >
                        {isLoading ? (
                            'Przetwarzanie...'
                        ) : isLoginMode ? (
                            <>Zaloguj się <LogIn size={20} /></>
                        ) : (
                            <>Zarejestruj się <UserPlus size={20} /></>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        {isLoginMode ? 'Nie masz jeszcze konta?' : 'Masz już konto?'}
                        <button
                            onClick={toggleMode}
                            className="ml-2 text-museum-red font-bold hover:underline transition focus:outline-none"
                        >
                            {isLoginMode ? 'Zarejestruj się' : 'Zaloguj się'}
                        </button>
                    </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                    <button
                        onClick={() => onNavigate('home')}
                        className="text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2 mx-auto transition"
                    >
                        <ArrowLeft size={14} /> Wróć do strony głównej
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;