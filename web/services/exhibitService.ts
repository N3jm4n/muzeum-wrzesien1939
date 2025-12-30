import api from './api';
import { Exhibit } from '../types';

export const exhibitService = {
    getAll: async (): Promise<Exhibit[]> => {
        const response = await api.get<Exhibit[]>('/exhibits');
        return response.data;
    },

    getById: async (id: number): Promise<Exhibit> => {
        const response = await api.get<Exhibit>(`/exhibits/${id}`);
        return response.data;
    }
};