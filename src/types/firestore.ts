import type { ExtendedOptimizationResult } from '@/store/travel-store';

export interface UserSearch {
  id?: string;
  userId: string;
  source: string;
  destination: string;
  searchDate: Date;
  formData: {
    travelType?: string;
    dates?: {
      startDate: string;
      endDate: string;
    };
    budget?: string;
    preferences?: any;
  };
}

export interface SavedItinerary {
  id?: string;
  userId: string;
  searchId?: string;
  source: string;
  destination: string;
  createdAt: Date;
  optimizationResult: ExtendedOptimizationResult;
  isFavorite?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  lastLogin: Date;
}
