import api from './api';
import { Exhibition } from '../types';

export const exhibitionService = {
    getAll: async (): Promise<Exhibition[]> => {
        const response = await api.get<Exhibition[]>('/exhibitions');
        return response.data;
    },

    getById: async (id: number): Promise<Exhibition> => {
        const response = await api.get<Exhibition>(`/exhibitions/${id}`);
        return response.data;
    }
};