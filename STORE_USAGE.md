# Store Usage Guide

This document explains how to use the Zustand state management store in the WanderWise application.

## Overview

The travel store (`src/store/travel-store.ts`) provides centralized state management for:
- Optimization results from the AI
- Loading and error states
- Trip metadata (source, destination)
- Form data persistence

## Basic Usage

### 1. Using Pre-built Hooks

The simplest way to access store data is through the pre-built selector hooks:

```tsx
import { 
  useOptimizationResult,
  useIsLoading,
  useTripMetadata,
  useCheapestFlight,
  useAccommodations,
  useFoodSpots,
  useItinerary,
  useCurrencyInfo
} from '@/store/travel-store';

function MyComponent() {
  const optimizationResult = useOptimizationResult();
  const isLoading = useIsLoading();
  const { source, destination } = useTripMetadata();
  const { currency, symbol } = useCurrencyInfo();
  
  // Use the data...
}
```

### 2. Using the Main Store Hook

For more control, use the main `useTravelStore` hook:

```tsx
import { useTravelStore } from '@/store/travel-store';

function MyComponent() {
  // Select only the data you need (optimizes re-renders)
  const optimizationResult = useTravelStore((state) => state.optimizationResult);
  const isLoading = useTravelStore((state) => state.isLoading);
  
  // Or get multiple values at once
  const { setOptimizationResult, setLoading } = useTravelStore();
}
```

### 3. Updating State

To update the store, use the action methods:

```tsx
import { useTravelStore } from '@/store/travel-store';

function FormComponent() {
  const { 
    setOptimizationResult,
    setLoading,
    setError,
    setTripMetadata,
    setLastFormData,
    resetStore 
  } = useTravelStore();

  const handleSubmit = async (data) => {
    setLoading(true);
    setTripMetadata(data.source, data.destination);
    
    try {
      const result = await optimizeTravel(data);
      setOptimizationResult(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
}
```

## Advanced Features

### 1. Persistence

The store automatically persists certain data to localStorage:
- `optimizationResult`
- `source` and `destination`
- `lastFormData`

Loading states are NOT persisted, so they reset on page refresh.

### 2. DevTools

The store is configured with Redux DevTools support for debugging:
- Install Redux DevTools browser extension
- Open DevTools while developing
- See all state changes and time-travel debug

### 3. Selector Methods

The store provides built-in selector methods for common data access:

```tsx
const store = useTravelStore();

// Get specific parts of the optimization result
const flight = store.getCheapestFlight();
const hotels = store.getAccommodations();
const food = store.getFoodSpots();
const itinerary = store.getItinerary();
const totalCost = store.getTotalCost();
const currency = store.getCurrency();
const trains = store.getDirectTrains();
const transport = store.getLocalTransportation();
const activities = store.getRecommendedActivities();
```

## Example Components

### Simple Display Component

```tsx
import { useCheapestFlight, useCurrencyInfo } from '@/store/travel-store';

export function FlightInfo() {
  const flight = useCheapestFlight();
  const { symbol } = useCurrencyInfo();
  
  if (!flight) return <div>No flight data</div>;
  
  return (
    <div>
      <h3>{flight.airline}</h3>
      <p>{symbol}{flight.price}</p>
      <p>{flight.details}</p>
    </div>
  );
}
```

### Component That Updates State

```tsx
import { useTravelStore } from '@/store/travel-store';

export function ResetButton() {
  const resetStore = useTravelStore((state) => state.resetStore);
  
  return (
    <button onClick={resetStore}>
      Start New Search
    </button>
  );
}
```

### Component With Multiple Selectors

```tsx
import { 
  useOptimizationResult,
  useIsLoading,
  useTripMetadata 
} from '@/store/travel-store';

export function TripSummary() {
  const result = useOptimizationResult();
  const isLoading = useIsLoading();
  const { source, destination } = useTripMetadata();
  
  if (isLoading) return <div>Loading...</div>;
  if (!result) return <div>No trip planned yet</div>;
  
  return (
    <div>
      <h2>{source} to {destination}</h2>
      <p>{result.reasoning}</p>
    </div>
  );
}
```

## Benefits

1. **Centralized State**: All travel data in one place
2. **Persistence**: Data survives page refreshes
3. **Performance**: Components only re-render when their selected data changes
4. **Type Safety**: Full TypeScript support
5. **DevTools**: Easy debugging with Redux DevTools
6. **Simple API**: Minimal boilerplate, easy to use

## Best Practices

1. **Use Selector Hooks**: Prefer the pre-built hooks like `useCheapestFlight()` over accessing raw state
2. **Select Only What You Need**: This optimizes re-renders
3. **Separate Concerns**: Keep UI logic separate from state management
4. **Reset When Needed**: Use `resetStore()` when starting a new search
5. **Handle Loading States**: Always check `isLoading` before displaying data

## Migration from Props

Before (passing props):
```tsx
<MyComponent 
  result={optimizationResult}
  isLoading={isLoading}
  onUpdate={setOptimizationResult}
/>
```

After (using store):
```tsx
<MyComponent />

// Inside MyComponent:
const result = useOptimizationResult();
const isLoading = useIsLoading();
const setResult = useTravelStore((state) => state.setOptimizationResult);
```
