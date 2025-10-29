# State Management Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   page.tsx   │  │ Other Pages  │  │   Results    │          │
│  │              │  │              │  │  Components  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                    │
│         └─────────────────┼─────────────────┘                    │
│                           │                                      │
│                           ▼                                      │
│         ┌─────────────────────────────────┐                     │
│         │     Zustand Store Hooks         │                     │
│         │  (useTravelStore, useItinerary, │                     │
│         │   useCheapestFlight, etc.)      │                     │
│         └─────────────────┬───────────────┘                     │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────────┐
│                           │   Store Layer                         │
│                           ▼                                       │
│         ┌─────────────────────────────────┐                      │
│         │       travel-store.ts           │                      │
│         │  ┌───────────────────────────┐  │                      │
│         │  │  State:                   │  │                      │
│         │  │  - optimizationResult     │  │                      │
│         │  │  - isLoading              │  │                      │
│         │  │  - error                  │  │                      │
│         │  │  - source/destination     │  │                      │
│         │  │  - lastFormData           │  │                      │
│         │  └───────────────────────────┘  │                      │
│         │                                  │                      │
│         │  ┌───────────────────────────┐  │                      │
│         │  │  Actions:                 │  │                      │
│         │  │  - setOptimizationResult  │  │                      │
│         │  │  - setLoading             │  │                      │
│         │  │  - setError               │  │                      │
│         │  │  - setTripMetadata        │  │                      │
│         │  │  - resetStore             │  │                      │
│         │  └───────────────────────────┘  │                      │
│         │                                  │                      │
│         │  ┌───────────────────────────┐  │                      │
│         │  │  Selectors:               │  │                      │
│         │  │  - getCheapestFlight()    │  │                      │
│         │  │  - getAccommodations()    │  │                      │
│         │  │  - getItinerary()         │  │                      │
│         │  │  - etc.                   │  │                      │
│         │  └───────────────────────────┘  │                      │
│         └──────────────┬──────────────────┘                      │
│                        │                                          │
│         ┌──────────────┴──────────────┐                          │
│         │                             │                          │
│         ▼                             ▼                          │
│  ┌─────────────┐              ┌──────────────┐                  │
│  │  Persist    │              │  DevTools    │                  │
│  │ Middleware  │              │  Middleware  │                  │
│  │(localStorage)│             │ (debugging)  │                  │
│  └──────┬──────┘              └──────────────┘                  │
│         │                                                         │
└─────────┼─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Browser Storage   │
│   (localStorage)    │
│  - optimizationResult│
│  - source/destination│
│  - lastFormData     │
└─────────────────────┘
```

## Data Flow

### 1. Form Submission Flow
```
User fills form
      │
      ▼
TravelOptimizerForm
      │
      ├─ setLoading(true)
      ├─ setTripMetadata(source, dest)
      ├─ setLastFormData(data)
      │
      ▼
optimizeTravel() API call
      │
      ├─ Success ─► setOptimizationResult(result)
      │             └─► Auto-persisted to localStorage
      │
      └─ Error ───► setError(message)
```

### 2. Component Data Access Flow
```
Component mounts
      │
      ▼
Uses hook (e.g., useCheapestFlight())
      │
      ▼
Zustand store returns data
      │
      ├─ If data exists ──► Render component
      │
      └─ If no data ──────► Return null or loading state
```

### 3. State Update Flow
```
Action called (e.g., setOptimizationResult)
      │
      ▼
Store state updates
      │
      ├─► Persist middleware saves to localStorage
      ├─► DevTools logs the change
      │
      ▼
Components using that data re-render
      │
      └─► Components not using that data don't re-render ✓
```

## Hook Categories

### Basic Hooks (from travel-store.ts)
```
useOptimizationResult() ──► Full result object
useIsLoading() ─────────► Boolean loading state
useError() ─────────────► Error message string
useTripMetadata() ──────► { source, destination }
useCurrencyInfo() ──────► { currency, symbol }
```

### Data Selector Hooks (from travel-store.ts)
```
useCheapestFlight() ────► Flight object
useAccommodations() ────► Accommodations array
useFoodSpots() ─────────► Food spots array
useItinerary() ─────────► Itinerary array
useTotalCost() ─────────► Total cost number
```

### Advanced Hooks (from travel-hooks.ts)
```
useHasResults() ────────► Boolean
useTripSummary() ───────► Formatted summary object
useTransportation() ────► All transport options
useCostBreakdown() ─────► Detailed cost analysis
useOptimizationWorkflow()─► Workflow management
```

## Component Communication

### Before (Prop Drilling)
```
Page
 │ props: result, setResult, isLoading, setLoading
 ├─► TravelOptimizerForm
 │    │ props: setResult, setLoading
 │    ├─► Level1Form
 │    │    │ props: passed down
 │    │    └─► Input (needs access but far from source)
 │    │
 │    ├─► Level2Form
 │    └─► Level3Form
 │
 └─► ResultsDisplay
      │ props: result
      ├─► FlightCard (props: result.flight)
      ├─► HotelCard (props: result.hotels)
      └─► ItineraryCard (props: result.itinerary)
```

### After (Zustand)
```
Page ──────────────┐
                   │
TravelOptimizerForm│
 ├─► Level1Form    │
 ├─► Level2Form    ├──► All components connect
 └─► Level3Form    │    directly to store
                   │
ResultsDisplay     │    No prop drilling!
 ├─► FlightCard    │
 ├─► HotelCard     │
 └─► ItineraryCard─┘
```

## Storage Architecture

```
┌──────────────────────────────────────┐
│         Zustand Store                │
│  ┌────────────────────────────────┐  │
│  │  In-Memory State (fast)        │  │
│  │  - optimizationResult          │  │
│  │  - isLoading (not persisted)   │  │
│  │  - error (not persisted)       │  │
│  │  - source                      │  │
│  │  - destination                 │  │
│  └────────┬───────────────────────┘  │
│           │                           │
│           ▼                           │
│  ┌────────────────────────────────┐  │
│  │  Persist Middleware            │  │
│  │  (selective persistence)       │  │
│  └────────┬───────────────────────┘  │
└───────────┼───────────────────────────┘
            │
            ▼
┌───────────────────────────────────────┐
│  localStorage: "travel-storage"       │
│  {                                    │
│    state: {                           │
│      optimizationResult: {...},      │
│      source: "New York",              │
│      destination: "Paris",            │
│      lastFormData: {...}              │
│    },                                 │
│    version: 0                         │
│  }                                    │
└───────────────────────────────────────┘
```

## Re-render Optimization

```
Store Update: optimizationResult.cheapestFlight changes
      │
      ├─── Component A: useCheapestFlight()
      │    └─► ✓ Re-renders (uses this data)
      │
      ├─── Component B: useAccommodations()
      │    └─► ✗ Does NOT re-render (different data)
      │
      ├─── Component C: useOptimizationResult()
      │    └─► ✓ Re-renders (full result includes flight)
      │
      └─── Component D: useIsLoading()
           └─► ✗ Does NOT re-render (different data)
```

## Best Practices Visualization

### ✅ Good: Specific Selectors
```
Component
   │
   ├─► useCheapestFlight() ──► Only flight data
   └─► Re-renders only when flight changes
```

### ❌ Avoid: Full Store Access
```
Component
   │
   ├─► useTravelStore() ──► Entire store
   └─► Re-renders on ANY store change
```

### ✅ Good: Multiple Related Selectors
```
Component
   │
   ├─► useTripMetadata() ──► { source, destination }
   └─► Re-renders when either changes
```

## File Structure
```
src/
├── store/
│   ├── index.ts              # Centralized exports
│   ├── travel-store.ts       # Main store + basic hooks
│   └── travel-hooks.ts       # Advanced custom hooks
│
├── components/
│   ├── travel-optimizer/
│   │   └── travel-optimizer-form.tsx  # Uses store
│   │
│   └── travel-results/
│       ├── flight-card.tsx            # Example component
│       ├── itinerary-card.tsx         # Example component
│       └── cost-breakdown-card.tsx    # Example component
│
└── app/
    └── page.tsx              # Uses store (no local state)
```

This architecture provides a clean separation of concerns and optimal performance!
