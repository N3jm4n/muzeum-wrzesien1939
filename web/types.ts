export type ExhibitCategory =
    | 'UNIFORMS'
    | 'EQUIPMENT'
    | 'WEAPONRY'
    | 'DOCUMENTS'
    | 'PHOTOS'
    | 'EVERYDAY_OBJECTS'
    | 'OTHER';

export type DonationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';


export interface Exhibit {
  id: number;
  name: string;
  description: string;
  productionYear: string;
  imageUrl: string;
  category: ExhibitCategory;
}

export interface Exhibition {
  id: number;
  name: string;
  description: string;
  backgroundImageUrl: string;
  exhibits: Exhibit[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Reservation {
  id: number;
  visitDate: string;      // Format "YYYY-MM-DD"
  visitTime: string;      // Format "HH:mm"
  numberOfGuests: number;
  firstName: string;
  lastName: string;
  userEmail: string;
}

export interface Donation {
  id: number;
  itemName: string;
  description: string;
  imageUrl: string;
  status: DonationStatus;
  createdAt: string;      // ISO Date String
  donorEmail: string;
}

export interface AuthResponse {
  token: string;
}

export interface ReservationRequest {
  visitDate: string;
  visitTime: string;
  numberOfGuests: number;
}

export interface DonationRequest {
  itemName: string;
  description: string;
  imageUrl: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ExhibitSearchCriteria {
  name?: string;
  category?: ExhibitCategory;
  productionYear?: number;
}