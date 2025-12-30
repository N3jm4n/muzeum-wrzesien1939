import api from './api';
import { AuthResponse, User, LoginRequest, RegisterRequest } from '../types';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    role: string;
    iat: number;
    exp: number;
    userId?: number;
    firstName?: string;
    lastName?: string;
}

export const authService = {
    login: async (data: LoginRequest): Promise<User> => {
        const response = await api.post<AuthResponse>('/auth/authenticate', data);
        const { token } = response.data;

        localStorage.setItem('token', token);

        const decoded = jwtDecode<JwtPayload>(token);

        const user: User = {
            id: decoded.userId || 0,
            email: decoded.sub,
            firstName: decoded.firstName || 'Użytkownik',
            lastName: decoded.lastName || '',
            role: decoded.role === 'ROLE_ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER',
        };

        return user;
    },

    register: async (data: RegisterRequest) => {
        return api.post<AuthResponse>('/auth/register', data);
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: (): User | null => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                return null;
            }

            return {
                id: 0,
                email: decoded.sub,
                firstName: 'Użytkownik',
                lastName: '',
                role: decoded.role === 'ROLE_ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER',
            };
        } catch (e) {
            localStorage.removeItem('token');
            return null;
        }
    }
};