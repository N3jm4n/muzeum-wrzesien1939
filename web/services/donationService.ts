import api from './api';
import { Donation } from '../types';

interface CreateDonationRequest {
    itemName: string;
    description: string;
    imageUrl: string; // Base64
}

export const donationService = {
    create: async (data: CreateDonationRequest) => {
        const response = await api.post<Donation>('/donations', data);
        return response.data;
    },

    getMyDonations: async () => {
        const response = await api.get<Donation[]>('/donations/my');
        return response.data;
    }
};