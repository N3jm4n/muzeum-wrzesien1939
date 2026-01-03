import api from './api';

export interface TimeSlot {
    time: string;
    available: boolean;
}

export interface ReservationEntry {
    id: number;
    visitDate: string;
    visitTime: string;
    numberOfGuests: number;
    firstName: string;
    lastName: string;
    userEmail: string;
}

export interface ReservationRequest {
    date: string;
    time: string;
    numberOfGuests: number;
}

export const bookingService = {
    getAvailableSlots: async (date: string): Promise<TimeSlot[]> => {
        const response = await api.get<TimeSlot[]>('/reservations/available-slots', {
            params: { date }
        });
        return response.data;
    },

    createReservation: async (data: ReservationRequest) => {
        const response = await api.post('/reservations', data);
        return response.data;
    },

    getMyReservations: async (): Promise<ReservationEntry[]> => {
        const response = await api.get<ReservationEntry[]>('/reservations/my');
        return response.data;
    },

    getByDate: async (date: string): Promise<ReservationEntry[]> => {
        // Backend: GET /api/v1/reservations/by-date?date=YYYY-MM-DD
        const response = await api.get<ReservationEntry[]>('/reservations/by-date', {
            params: { date }
        });
        return response.data;
    }
};