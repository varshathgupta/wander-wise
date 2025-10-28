import { useMemo } from 'react';
import { useTravelStore } from './travel-store';
import type { OptimizeTravelDatesOutput } from '@/ai/flows/optimize-travel-dates';

/**
 * Custom hooks for common store operations
 */

/**
 * Hook to check if trip results are available
 */
export const useHasResults = () => {
  return useTravelStore((state) => state.optimizationResult !== null);
};

/**
 * Hook to get formatted trip summary
 */
export const useTripSummary = () => {
  const result = useTravelStore((state) => state.optimizationResult);
  const source = useTravelStore((state) => state.source);
  const destination = useTravelStore((state) => state.destination);

  if (!result) return null;

  return {
    source,
    destination,
    dates: result.optimalDates,
    totalCost: result.totalEstimatedCostPerPerson,
    currency: result.currency,
    reasoning: result.reasoning,
    placesToVisit: result.placesToVisit,
  };
};

/**
 * Hook to get all transportation options
 */
export const useTransportation = () => {
  const result = useTravelStore((state) => state.optimizationResult);
  
  return useMemo(() => {
    if (!result) return null;

    return {
      flight: result.cheapestFlight,
      trains: result.directTrains || [],
      localTransport: result.localTransportation || [],
    };
  }, [result]);
};

/**
 * Hook to get all accommodation and food information
 */
export const useAccommodationAndFood = () => {
  const result = useTravelStore((state) => state.optimizationResult);
  
  return useMemo(() => {
    if (!result) return null;

    return {
      accommodations: result.recommendedAccommodations || [],
      foodSpots: result.famousFoodSpots || [],
    };
  }, [result]);
};

/**
 * Hook to get activities and itinerary
 */
export const useActivitiesAndItinerary = () => {
  const result = useTravelStore((state) => state.optimizationResult);
  
  return useMemo(() => {
    if (!result) return null;

    return {
      activities: result.recommendedActivities || [],
      itinerary: result.itinerary || [],
    };
  }, [result]);
};

/**
 * Hook to manage optimization workflow
 */
export const useOptimizationWorkflow = () => {
  const setLoading = useTravelStore((state) => state.setLoading);
  const setError = useTravelStore((state) => state.setError);
  const setOptimizationResult = useTravelStore((state) => state.setOptimizationResult);
  const setTripMetadata = useTravelStore((state) => state.setTripMetadata);
  const setLastFormData = useTravelStore((state) => state.setLastFormData);
  const resetStore = useTravelStore((state) => state.resetStore);
  const isLoading = useTravelStore((state) => state.isLoading);
  const error = useTravelStore((state) => state.error);

  const startOptimization = useMemo(
    () => (source: string, destination: string, formData: any) => {
      setLoading(true);
      setError(null);
      setOptimizationResult(null);
      setTripMetadata(source, destination);
      setLastFormData(formData);
    },
    [setLoading, setError, setOptimizationResult, setTripMetadata, setLastFormData]
  );

  const completeOptimization = useMemo(
    () => (result: OptimizeTravelDatesOutput) => {
      setOptimizationResult(result);
      setLoading(false);
      setError(null);
    },
    [setOptimizationResult, setLoading, setError]
  );

  const failOptimization = useMemo(
    () => (error: string) => {
      setError(error);
      setLoading(false);
      setOptimizationResult(null);
    },
    [setError, setLoading, setOptimizationResult]
  );

  const resetOptimization = useMemo(
    () => () => {
      resetStore();
    },
    [resetStore]
  );

  return useMemo(
    () => ({
      startOptimization,
      completeOptimization,
      failOptimization,
      resetOptimization,
      isLoading,
      error,
    }),
    [startOptimization, completeOptimization, failOptimization, resetOptimization, isLoading, error]
  );
};

/**
 * Hook to filter accommodations by price range
 */
export const useFilteredAccommodations = (maxPrice?: number) => {
  const accommodations = useTravelStore((state) => state.getAccommodations());
  
  return useMemo(() => {
    if (!accommodations) return [];
    
    if (maxPrice === undefined) return accommodations;
    
    return accommodations.filter((acc) => acc.pricePerNight <= maxPrice);
  }, [accommodations, maxPrice]);
};

/**
 * Hook to filter food spots by cuisine type
 */
export const useFilteredFoodSpots = (cuisineType?: string) => {
  const foodSpots = useTravelStore((state) => state.getFoodSpots());
  
  return useMemo(() => {
    if (!foodSpots) return [];
    
    if (!cuisineType) return foodSpots;
    
    return foodSpots.filter((spot) => 
      spot.cuisine.toLowerCase().includes(cuisineType.toLowerCase())
    );
  }, [foodSpots, cuisineType]);
};

/**
 * Hook to get trip duration in days
 */
export const useTripDuration = () => {
  const itinerary = useTravelStore((state) => state.getItinerary());
  
  if (!itinerary) return 0;
  
  return itinerary.length;
};

/**
 * Hook to calculate total accommodation cost estimate
 */
export const useTotalAccommodationCost = () => {
  const accommodations = useTravelStore((state) => state.getAccommodations());
  const tripDuration = useTripDuration();
  
  if (!accommodations || accommodations.length === 0 || tripDuration === 0) return 0;
  
  // Assuming the first accommodation is selected
  const selectedAccommodation = accommodations[0];
  return selectedAccommodation.pricePerNight * tripDuration;
};

/**
 * Hook to get trip cost breakdown
 */
export const useCostBreakdown = () => {
  const result = useTravelStore((state) => state.optimizationResult);
  const accommodationCost = useTotalAccommodationCost();
  
  return useMemo(() => {
    if (!result) return null;
    
    const flightCost = result.cheapestFlight.price;
    const activitiesCost = result.recommendedActivities?.reduce((sum, activity) => sum + activity.price, 0) || 0;
    const totalCost = result.totalEstimatedCostPerPerson;
    const otherCosts = totalCost - flightCost - accommodationCost - activitiesCost;
    
    return {
      flight: flightCost,
      accommodation: accommodationCost,
      activities: activitiesCost,
      other: Math.max(0, otherCosts), // Ensure non-negative
      total: totalCost,
      currency: result.currency,
    };
  }, [result, accommodationCost]);
};
