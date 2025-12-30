import api from './api';
import { Donation, Exhibit, Exhibition } from '../types';

interface CreateExhibitRequest {
    name: string;
    description: string;
    productionYear: string;
    imageUrl: string;
    category: string;
}

interface CreateExhibitionRequest {
    name: string;
    description: string;
    backgroundImageUrl: string;
    exhibitIds: number[];
}

export const adminService = {

    getAllDonations: async () => {
        const response = await api.get<Donation[]>('/donations');
        return response.data;
    },

    updateDonationStatus: async (id: number, status: 'ACCEPTED' | 'REJECTED') => {
        const response = await api.put(`/donations/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },


    addExhibit: async (data: CreateExhibitRequest) => {
        const response = await api.post<Exhibit>('/exhibits', data);
        return response.data;
    },

    getAllExhibits: async () => {
        const response = await api.get<Exhibit[]>('/exhibits');
        return response.data;
    },


    addExhibition: async (data: CreateExhibitionRequest) => {
        const response = await api.post<Exhibition>('/exhibitions', data);
        return response.data;
    }
};