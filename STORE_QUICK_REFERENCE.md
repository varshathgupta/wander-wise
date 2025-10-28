# State Management Quick Reference

## Import Everything From One Place

```tsx
import { 
  useTravelStore,           // Main store hook
  useOptimizationResult,    // Get optimization result
  useIsLoading,             // Get loading state
  useCheapestFlight,        // Get flight data
  useAccommodations,        // Get hotel data
  useFoodSpots,             // Get restaurant data
  useItinerary,             // Get day-by-day plan
  useCurrencyInfo,          // Get currency & symbol
  useCostBreakdown,         // Get cost analysis
  useHasResults,            // Check if results exist
} from '@/store';
```

## Common Patterns

### Display Component (Read-Only)
```tsx
import { useCheapestFlight, useCurrencyInfo } from '@/store';

export function FlightDisplay() {
  const flight = useCheapestFlight();
  const { symbol } = useCurrencyInfo();
  
  if (!flight) return null;
  
  return <div>{flight.airline}: {symbol}{flight.price}</div>;
}
```

### Update Component (Write)
```tsx
import { useTravelStore } from '@/store';

export function ResetButton() {
  const resetStore = useTravelStore((state) => state.resetStore);
  return <button onClick={resetStore}>Reset</button>;
}
```

### Complex Component (Read + Write)
```tsx
import { useOptimizationWorkflow } from '@/store';
import { optimizeTravel } from '@/app/actions';

export function OptimizeButton({ formData }) {
  const { startOptimization, completeOptimization, failOptimization, isLoading } = useOptimizationWorkflow();
  
  const handleClick = async () => {
    startOptimization(formData.source, formData.destination, formData);
    
    try {
      const result = await optimizeTravel(formData);
      if (result.data) {
        completeOptimization(result.data);
      } else {
        failOptimization(result.error || 'Unknown error');
      }
    } catch (error) {
      failOptimization(error.message);
    }
  };
  
  return <button onClick={handleClick} disabled={isLoading}>Optimize</button>;
}
```

## Available Hooks

### Basic Data Access
- `useOptimizationResult()` - Full result object
- `useIsLoading()` - Loading state
- `useError()` - Error message if any
- `useTripMetadata()` - Source & destination

### Specific Data Selectors
- `useCheapestFlight()` - Flight information
- `useAccommodations()` - Hotel/lodging options
- `useFoodSpots()` - Restaurant recommendations
- `useItinerary()` - Day-by-day schedule
- `useTotalCost()` - Total trip cost
- `useCurrencyInfo()` - Currency code & symbol

### Advanced Hooks
- `useHasResults()` - Boolean if results exist
- `useTripSummary()` - Formatted summary
- `useTransportation()` - All transport options
- `useCostBreakdown()` - Detailed cost analysis
- `useTripDuration()` - Number of days
- `useOptimizationWorkflow()` - Manage optimization process

### Filter Hooks
- `useFilteredAccommodations(maxPrice)` - Filter by price
- `useFilteredFoodSpots(cuisineType)` - Filter by cuisine

## Store Actions

```tsx
const store = useTravelStore();

// Set data
store.setOptimizationResult(result);
store.setLoading(true);
store.setError('Error message');
store.setTripMetadata('New York', 'Paris');
store.setLastFormData(formData);

// Reset
store.resetStore();

// Get computed values
const flight = store.getCheapestFlight();
const hotels = store.getAccommodations();
```

## Example Components

See these files for working examples:
- `src/components/travel-results/flight-card.tsx`
- `src/components/travel-results/itinerary-card.tsx`
- `src/components/travel-results/cost-breakdown-card.tsx`

## Key Features

✅ **Automatic Persistence** - Results saved to localStorage  
✅ **Type Safe** - Full TypeScript support  
✅ **Optimized Re-renders** - Only update when selected data changes  
✅ **DevTools Support** - Debug with Redux DevTools  
✅ **Simple API** - Easy to learn and use  

## Performance Tips

1. **Select only what you need:**
   ```tsx
   // ❌ Bad - re-renders on any state change
   const store = useTravelStore();
   
   // ✅ Good - re-renders only when flight changes
   const flight = useCheapestFlight();
   ```

2. **Use specific hooks:**
   ```tsx
   // ❌ Less optimal
   const result = useOptimizationResult();
   const flight = result?.cheapestFlight;
   
   // ✅ Better
   const flight = useCheapestFlight();
   ```

3. **Combine related selections:**
   ```tsx
   // ✅ Good for multiple related values
   const { source, destination } = useTripMetadata();
   ```
