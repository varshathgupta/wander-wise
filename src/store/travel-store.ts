import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { OptimizeTravelDatesOutput } from '@/ai/flows/optimize-travel-dates';
import type { EnrichedActivity } from '@/lib/enrich-itinerary';

// Extended type that includes data from Google Maps API
export type ExtendedOptimizationResult = OptimizeTravelDatesOutput & {
  directTrains?: Array<{
    trainName: string;
    departureStation: string;
    arrivalStation: string;
    price: any;
    details: string;
  }>;
  recommendedAccommodations?: Array<{
    name: string;
    type: string;
    rating: number;
    pricePerNight: number;
    bookingLink: string;
  }>;
  famousFoodSpots?: Array<{
    name: string;
    type?: string;
    cuisine?: string;
    estimatedCost?: string;
    location?: string;
    rating?: number;
  }>;
  // Override itinerary type with enriched version
  itinerary: Array<{
    day: number;
    title: string;
    activities: EnrichedActivity[];
  }>;
};

interface TravelState {
  // Optimization result data
  optimizationResult: ExtendedOptimizationResult | null;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Trip metadata
  source: string;
  destination: string;
  
  // Form state (optional - can be used to persist form data)
  lastFormData: any | null;
  
  // Actions
  setOptimizationResult: (result: ExtendedOptimizationResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTripMetadata: (source: string, destination: string) => void;
  setLastFormData: (formData: any) => void;
  resetStore: () => void;
  
  // Selectors/computed values (helpers for accessing nested data)
  getCheapestFlight: () => ExtendedOptimizationResult['cheapestFlight'] | null;
  getAccommodations: () => ExtendedOptimizationResult['recommendedAccommodations'] | null;
  getFoodSpots: () => ExtendedOptimizationResult['famousFoodSpots'] | null;
  getItinerary: () => ExtendedOptimizationResult['itinerary'] | null;
  getTotalCost: () => number | null;
  getCurrency: () => string;
  getDirectTrains: () => ExtendedOptimizationResult['directTrains'] | null;
  getLocalTransportation: () => ExtendedOptimizationResult['localTransportation'] | null;
  getRecommendedActivities: () => ExtendedOptimizationResult['recommendedActivities'] | null;
}

const initialState = {
  optimizationResult: null,
  isLoading: false,
  error: null,
  source: '',
  destination: '',
  lastFormData: null,
};

export const useTravelStore = create<TravelState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Actions
        setOptimizationResult: (result) => {
          set({ optimizationResult: result, error: null });
        },
        
        setLoading: (loading) => {
          set({ isLoading: loading });
        },
        
        setError: (error) => {
          set({ error, isLoading: false });
        },
        
        setTripMetadata: (source, destination) => {
          set({ source, destination });
        },
        
        setLastFormData: (formData) => {
          set({ lastFormData: formData });
        },
        
        resetStore: () => {
          set(initialState);
        },
        
        // Selectors
        getCheapestFlight: () => {
          return get().optimizationResult?.cheapestFlight || null;
        },
        
        getAccommodations: () => {
          return get().optimizationResult?.recommendedAccommodations || null;
        },
        
        getFoodSpots: () => {
          return get().optimizationResult?.famousFoodSpots || null;
        },
        
        getItinerary: () => {
          return get().optimizationResult?.itinerary || null;
        },
        
        getTotalCost: () => {
          return get().optimizationResult?.totalEstimatedCostPerPerson || null;
        },
        
        getCurrency: () => {
          // Always return INR for India-specific travel
          return 'INR';
        },
        
        getDirectTrains: () => {
          return get().optimizationResult?.directTrains || null;
        },
        
        getLocalTransportation: () => {
          return get().optimizationResult?.localTransportation || null;
        },
        
        getRecommendedActivities: () => {
          return get().optimizationResult?.recommendedActivities || null;
        },
      }),
      {
        name: 'travel-storage', // unique name for localStorage key
        partialize: (state) => ({
          // Only persist the result and trip metadata, not loading states
          optimizationResult: state.optimizationResult,
          source: state.source,
          destination: state.destination,
          lastFormData: state.lastFormData,
        }),
      }
    ),
    {
      name: 'TravelStore', // name for devtools
    }
  )
);

// Optional: Create selector hooks for common use cases
export const useOptimizationResult = () => useTravelStore((state) => state.optimizationResult);
export const useIsLoading = () => useTravelStore((state) => state.isLoading);
export const useError = () => useTravelStore((state) => state.error);

// Use shallow equality check for object selectors to prevent infinite loops
export const useTripMetadata = () => {
  const source = useTravelStore((state) => state.source);
  const destination = useTravelStore((state) => state.destination);
  return { source, destination };
};

// Selector hooks for specific data parts
export const useCheapestFlight = () => useTravelStore((state) => state.getCheapestFlight());
export const useAccommodations = () => useTravelStore((state) => state.getAccommodations());
export const useFoodSpots = () => useTravelStore((state) => state.getFoodSpots());
export const useItinerary = () => useTravelStore((state) => state.getItinerary());
export const useTotalCost = () => useTravelStore((state) => state.getTotalCost());

// Currency info for India (INR only)
export const useCurrencyInfo = () => {
  return {
    currency: 'INR',
    symbol: '₹',
  };
};
