/**
 * Centralized exports for all store-related functionality
 * Import from this file for convenience
 */

// Main store and basic hooks
export {
  useTravelStore,
  useOptimizationResult,
  useIsLoading,
  useError,
  useTripMetadata,
  useCheapestFlight,
  useAccommodations,
  useFoodSpots,
  useItinerary,
  useTotalCost,
  useCurrencyInfo,
} from './travel-store';

// Advanced custom hooks
export {
  useHasResults,
  useTripSummary,
  useTransportation,
  useAccommodationAndFood,
  useActivitiesAndItinerary,
  useOptimizationWorkflow,
  useFilteredAccommodations,
  useFilteredFoodSpots,
  useTripDuration,
  useTotalAccommodationCost,
  useCostBreakdown,
} from './travel-hooks';

// Types (re-export from the flow definitions)
export type { OptimizeTravelDatesOutput } from '@/ai/flows/optimize-travel-dates';
