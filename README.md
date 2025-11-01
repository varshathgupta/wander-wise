# WanderWise

> AI-powered travel planning and optimization platform built with Next.js, Google Gemini AI, and Google Maps Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10-orange?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Project Structure](#project-structure)
- [Core Workflows](#core-workflows)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## Overview

WanderWise is an intelligent travel planning platform that leverages Google's Gemini AI to provide personalized trip recommendations, comprehensive itineraries, and budget-optimized travel plans. The application combines real-time data from Google Maps Platform with AI-powered optimization to deliver tailored travel experiences.

### What Makes WanderWise Different?

- **AI-Driven Personalization**: Multi-level questionnaire system that captures nuanced traveler preferences
- **Real-Time Data Integration**: Live pricing from Google Maps Places API for accommodations and restaurants
- **Intelligent Budget Optimization**: Dynamic budget allocation across flights, hotels, activities, and dining
- **Cultural Contextualization**: Language barriers, dietary restrictions, and local customs considered
- **Trip Type Specialization**: Distinct optimization strategies for adventure, honeymoon, leisure, luxury, pilgrim, and custom trips

---

## Key Features

### 🎯 Intelligent Trip Planning

#### Multi-Level Personalization System
```
Level 1: Core Requirements
├── Source & Destination
├── Travel Dates
├── Trip Type (Adventure, Honeymoon, Leisure, Luxury, Pilgrim, Others)
└── Budget Range (USD, EUR, INR)

Level 2: Trip Character
├── Booking Preferences (Easy booking, Standard plans)
├── Transportation (Flight, Train, Car, Bus)
├── Accommodation Type (Hotel, Resort, Hostel, Homestay, Camping)
└── Type-Specific Options
    ├── Adventure: Intensity level, Group size
    ├── Honeymoon: Privacy preferences, Romantic experiences
    └── Leisure: Relaxation vs Activity balance

Level 3: Cultural & Lifestyle Preferences
├── Cultural Immersion Level
├── Food Preferences (Local cuisine, Dietary restrictions)
├── Language Comfort
├── Nightlife Interests
└── Lifestyle Choices (Eco-friendly, Wellness, Photography)
```

### 🤖 AI-Powered Optimization

- **Smart Date Recommendations**: Weather patterns, seasonal pricing, and crowd analysis
- **Alternative Destinations**: Similar experiences within budget constraints
- **Comprehensive Itineraries**: Day-by-day plans with time-specific activities
- **Dynamic Cost Analysis**: Real-time pricing for flights, hotels, and activities
- **Cultural Intelligence**: Local customs, language tips, and safety recommendations

### 💰 Budget Management

- Trip-type specific budget ranges
- Detailed cost breakdown:
  - Round-trip flights
  - Daily accommodation costs
  - Activity expenses per day
  - Estimated food & transportation costs
- Budget optimization suggestions

### 🗺️ Google Maps Integration

- **Places API**: Accommodation and restaurant recommendations with ratings and pricing
- **Routes API**: Transportation options and estimated travel times
- **Places Autocomplete**: Smart location search with suggestions
- **Geocoding**: Accurate coordinate extraction for itinerary planning

---

## Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│  Next.js 15 (App Router) + React 18 + TypeScript + Zustand  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─► Server Actions (actions.ts)
                 │   └─► Authentication Check
                 │
┌────────────────▼────────────────────────────────────────────┐
│                      AI Orchestration Layer                  │
│              GenKit 1.13 + Google Gemini AI                  │
│                                                              │
│  ┌─────────────────────────────────────────────────┐        │
│  │  optimize-travel-dates.ts                       │        │
│  │  • Input validation (Zod schemas)               │        │
│  │  • Google Maps API calls                        │        │
│  │  • AI prompt engineering                        │        │
│  │  • Response parsing & enrichment                │        │
│  └─────────────────────────────────────────────────┘        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─► Google Gemini API (gemini-2.0-flash-exp)
                 ├─► Google Maps Places API
                 ├─► Google Maps Routes API
                 └─► Google Places Autocomplete API
                 │
┌────────────────▼────────────────────────────────────────────┐
│                      Data Persistence Layer                  │
│                    Firebase Firestore                        │
│                                                              │
│  Collections:                                               │
│  • searches: User search history                            │
│  • itineraries: Generated trip plans                        │
│  • users: User profiles (NextAuth)                          │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
User Input → Form Validation → Server Action
    ↓
Authentication Check (NextAuth)
    ↓
AI Flow Orchestration (GenKit)
    ├─► Google Maps Places API (parallel)
    ├─► Google Maps Routes API (parallel)
    └─► Gemini AI Generation
    ↓
Response Enrichment
    ├─► getTopAccommodations()
    ├─► getTopRestaurants()
    └─► enrichItinerary()
    ↓
Firestore Storage (searches + itineraries)
    ↓
Client State Update (Zustand) → UI Render
```

---

## Tech Stack

### Core Framework
- **Next.js 15.3.3** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5** - Type safety

### AI & ML
- **GenKit 1.13.0** - AI orchestration framework
- **@genkit-ai/googleai** - Google Gemini integration
- **Google Gemini 2.0 Flash** - Large language model

### UI & Styling
- **TailwindCSS 3.4** - Utility-first CSS
- **Radix UI** - Accessible component primitives (40+ components)
- **shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **tailwindcss-animate** - Animation utilities

### Forms & Validation
- **React Hook Form 7.54** - Form state management
- **Zod 3.24** - Schema validation
- **@hookform/resolvers** - Form validation integration

### State Management
- **Zustand 5.0** - Lightweight state management

### Backend & Database
- **Firebase 11.10** - Backend platform
- **Firebase Admin 13.5** - Server-side SDK
- **Firestore** - NoSQL database
- **NextAuth 4.24** - Authentication

### Maps & Location
- **@googlemaps/google-maps-services-js** - Google Maps APIs
- **@googlemaps/places** - Places API client

### Data Visualization
- **Recharts 2.15** - Chart library
- **date-fns 3.6** - Date utilities
- **React Day Picker 8.10** - Date picker

### Development Tools
- **Turbopack** - Fast bundler (Next.js 15)
- **ESLint** - Linting
- **TypeScript Compiler** - Type checking
- **genkit-cli** - AI flow development

### Additional Libraries
- **embla-carousel-react** - Carousel component
- **html2canvas** - Screenshot generation (itinerary export)
- **jspdf** - PDF generation
- **class-variance-authority** - Component variant management
- **clsx** - Class name utilities

---

## Prerequisites

### Required
- **Node.js** >= 18.0.0 (recommended: 20.x LTS)
- **npm** >= 9.0.0 or **yarn** >= 1.22.0
- **Git**

### API Keys Required
- **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)
- **Google Maps API Key** - [Google Cloud Console](https://console.cloud.google.com/)
  - Enable: Places API, Routes API, Geocoding API, Places Autocomplete
- **Firebase Project** - [Firebase Console](https://console.firebase.google.com/)
  - Firestore enabled
  - Authentication configured (Google OAuth)

### Recommended Tools
- **VS Code** with extensions:
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript
- **Postman** or **Thunder Client** (API testing)
- **Firebase Emulator Suite** (local development)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/wander-wise.git
cd wander-wise
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter peer dependency issues:
```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Google AI
GOOGLE_API_KEY=your_google_gemini_api_key

# Google Maps Platform
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_generate_with_openssl

# Firebase Admin (Service Account)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 5. Firebase Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init firestore

# Deploy Firestore rules and indexes
firebase deploy --only firestore
```

### 6. Verify Installation

```bash
npm run typecheck
npm run lint
```

---

## Configuration

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable APIs:
   - Places API (New)
   - Routes API
   - Geocoding API
   - Places Autocomplete API
4. Create credentials → API Key
5. Restrict key (recommended):
   - Application restrictions: HTTP referrers
   - API restrictions: Enable only required APIs

### Firebase Firestore Rules

Located in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Searches collection
    match /searches/{searchId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Itineraries collection
    match /itineraries/{itineraryId} {
      allow read: if request.auth != null && 
                    resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

### NextAuth Configuration

Located in `src/lib/auth.ts`:

```typescript
export function getAuthOptions() {
  return {
    adapter: FirestoreAdapter(adminDb),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    callbacks: {
      session: async ({ session, user }) => {
        session.user.id = user.id;
        return session;
      },
    },
  };
}
```

---

## Development

### Available Scripts

```bash
# Development server (with Turbopack)
npm run dev

# GenKit AI development server
npm run genkit:dev

# GenKit with hot reload
npm run genkit:watch

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Type checking
npm run typecheck
```

### Local Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   Application runs at `http://localhost:3000`

2. **Start GenKit Development Server** (separate terminal)
   ```bash
   npm run genkit:watch
   ```
   GenKit UI available at `http://localhost:4000`

3. **Firebase Emulators** (optional, for local testing)
   ```bash
   firebase emulators:start
   ```

### GenKit Development

The GenKit dev server provides:
- **Flow Testing**: Test AI flows in isolation
- **Prompt Engineering**: Iterate on prompts quickly
- **Trace Debugging**: See detailed execution traces
- **Schema Validation**: Test input/output schemas

Access at `http://localhost:4000` after running `npm run genkit:dev`

### Hot Reload

Turbopack provides near-instant hot reloads for:
- React components
- TypeScript files
- Tailwind CSS
- Server actions (with automatic re-compilation)

---

## Project Structure

```
wander-wise/
├── public/                      # Static assets
│   ├── images/                  # Images (hero, icons, etc.)
│   └── favicon.ico
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Global styles
│   │   ├── actions.ts          # Server actions
│   │   │
│   │   ├── api/                # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts    # NextAuth endpoint
│   │   │   └── places/
│   │   │       └── autocomplete/
│   │   │           └── route.ts    # Places autocomplete
│   │   │
│   │   ├── itinerary/          # Itinerary display page
│   │   │   └── page.tsx
│   │   ├── suggestions/        # AI suggestions page
│   │   │   └── page.tsx
│   │   ├── past-searches/      # Search history
│   │   │   └── page.tsx
│   │   └── debug/              # Debug utilities
│   │
│   ├── ai/                     # AI orchestration
│   │   ├── genkit.ts          # GenKit configuration
│   │   ├── dev.ts             # GenKit dev server entry
│   │   └── flows/
│   │       └── optimize-travel-dates.ts   # Main AI flow
│   │
│   ├── components/             # React components
│   │   ├── auth-button.tsx    # Auth UI
│   │   ├── auth-provider.tsx  # Auth context
│   │   ├── header.tsx         # App header
│   │   ├── travel-loader.tsx  # Loading states
│   │   │
│   │   ├── travel-optimizer/   # Multi-level form
│   │   │   ├── index.ts
│   │   │   ├── form-schema.ts         # Zod schemas
│   │   │   ├── form-header.tsx        # Form header
│   │   │   ├── form-navigation.tsx    # Level navigation
│   │   │   ├── level1-form.tsx        # Basic details
│   │   │   ├── level2-form/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── booking-preferences.tsx
│   │   │   │   ├── adventure-form.tsx
│   │   │   │   ├── honeymoon-form.tsx
│   │   │   │   ├── leisure-form.tsx
│   │   │   │   └── personalization-toggle.tsx
│   │   │   └── level3-form/
│   │   │       ├── index.tsx
│   │   │       ├── cultural-section.tsx
│   │   │       ├── food-section.tsx
│   │   │       ├── language-section.tsx
│   │   │       └── nightlife-section.tsx
│   │   │
│   │   ├── travel-results/     # Results display
│   │   │   ├── cost-breakdown-card.tsx
│   │   │   ├── flight-card.tsx
│   │   │   └── itinerary-card.tsx
│   │   │
│   │   └── ui/                 # shadcn/ui components (40+)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       └── ... (35+ more)
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-mobile.tsx     # Responsive detection
│   │   └── use-toast.ts       # Toast notifications
│   │
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── firebase-admin.ts  # Firebase Admin SDK
│   │   ├── google-maps.ts     # Google Maps clients
│   │   ├── get-top-accommodations.ts   # Hotels/stays
│   │   ├── get-top-restaurants.ts      # Dining options
│   │   ├── enrich-itinerary.ts         # Activity enrichment
│   │   └── utils.ts           # General utilities
│   │
│   ├── store/                  # Zustand state management
│   │   ├── index.ts           # Store configuration
│   │   ├── travel-store.ts    # Travel state
│   │   └── travel-hooks.ts    # Typed hooks
│   │
│   └── types/                  # TypeScript definitions
│       ├── firestore.ts       # Firestore schemas
│       └── next-auth.d.ts     # NextAuth types
│
├── firebase.json               # Firebase configuration
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
├── apphosting.yaml            # Firebase App Hosting
│
├── components.json             # shadcn/ui config
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── postcss.config.mjs         # PostCSS configuration
│
├── package.json
├── .env.local                 # Environment variables (git-ignored)
└── README.md
```

---

## Core Workflows

### 1. Travel Optimization Flow

**File**: `src/ai/flows/optimize-travel-dates.ts`

```typescript
export const optimizeTravelDates = ai.defineFlow({
  name: 'optimizeTravelDates',
  inputSchema: OptimizeTravelDatesInputSchema,
  outputSchema: OptimizeTravelDatesOutputSchema,
}, async (input) => {
  // 1. Fetch real-time data from Google Maps
  const [accommodations, restaurants, routes] = await Promise.all([
    getTopAccommodations(input.destination),
    getTopRestaurants(input.destination),
    calculateRoutes(input.source, input.destination)
  ]);

  // 2. Generate AI-powered itinerary
  const aiResponse = await ai.generate({
    model: gemini20FlashExp,
    prompt: buildTravelPrompt(input, accommodations, restaurants),
    output: { schema: OptimizeTravelDatesOutputSchema }
  });

  // 3. Enrich activities with Google Places data
  const enrichedItinerary = await enrichItinerary(
    aiResponse.output.itinerary, 
    input.destination
  );

  return {
    ...aiResponse.output,
    itinerary: enrichedItinerary
  };
});
```

### 2. Server Action Flow

**File**: `src/app/actions.ts`

```typescript
export async function optimizeTravel(input: any) {
  // 1. Authentication check
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return { data: null, error: "Authentication required" };
  }

  // 2. Call AI flow
  const result = await optimizeTravelDates(flattenedInput);

  // 3. Save to Firestore
  const searchRef = await adminDb.collection('searches').add({
    userId: session.user.id,
    source: input.source,
    destination: input.destination,
    searchDate: new Date(),
    formData: input
  });

  const itineraryRef = await adminDb.collection('itineraries').add({
    userId: session.user.id,
    searchId: searchRef.id,
    ...result
  });

  return { data: result, error: null };
}
```

### 3. Form Submission Flow

**Component**: `src/components/travel-optimizer/travel-optimizer-form.tsx`

```typescript
const handleSubmit = async (values: FormValues) => {
  setIsLoading(true);
  
  // 1. Client-side validation (Zod + React Hook Form)
  // Already validated by React Hook Form
  
  // 2. Call server action
  const { data, error } = await optimizeTravel({
    source: values.source,
    destination: values.destination,
    startDate: format(values.dateRange.from, 'yyyy-MM-dd'),
    endDate: format(values.dateRange.to, 'yyyy-MM-dd'),
    tripType: values.tripType,
    budgetRange: values.budgetRange,
    travelerDetails: JSON.stringify({
      level2: values.level2,
      level3: values.level3
    })
  });
  
  // 3. Update Zustand store
  if (data) {
    setTravelResults(data);
    router.push('/suggestions');
  }
  
  setIsLoading(false);
};
```

---

## API Integration

### Google Maps Places API

**File**: `src/lib/get-top-accommodations.ts`

```typescript
export async function getTopAccommodations(location: string) {
  // 1. Geocode location
  const geocodeResponse = await googleMapsClient.geocode({
    params: { address: location, key: process.env.GOOGLE_API_KEY! }
  });
  
  const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
  
  // 2. Search nearby places
  const placesResponse = await placesClient.searchNearby({
    includedTypes: ['hotel', 'lodging', 'resort_hotel'],
    maxResultCount: 10,
    locationRestriction: {
      circle: { center: { latitude: lat, longitude: lng }, radius: 5000 }
    }
  });
  
  // 3. Format results
  return placesResponse.places.map(place => ({
    name: place.displayName?.text,
    rating: place.rating,
    priceLevel: place.priceLevel,
    googleMapsUri: place.googleMapsUri
  }));
}
```

### Google Gemini AI Integration

**File**: `src/ai/genkit.ts`

```typescript
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY
    })
  ]
});

export const gemini20FlashExp = ai.model({
  name: 'googleai/gemini-2.0-flash-exp',
  config: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 8192
  }
});
```

---

## State Management

### Zustand Store

**File**: `src/store/travel-store.ts`

```typescript
interface TravelState {
  // Form state
  formData: TravelFormData | null;
  currentLevel: 1 | 2 | 3;
  
  // Results state
  travelResults: OptimizeTravelDatesOutput | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFormData: (data: TravelFormData) => void;
  setCurrentLevel: (level: 1 | 2 | 3) => void;
  setTravelResults: (results: OptimizeTravelDatesOutput) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

export const useTravelStore = create<TravelState>((set) => ({
  formData: null,
  currentLevel: 1,
  travelResults: null,
  isLoading: false,
  error: null,
  
  setFormData: (data) => set({ formData: data }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setTravelResults: (results) => set({ travelResults: results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error }),
  resetStore: () => set({
    formData: null,
    currentLevel: 1,
    travelResults: null,
    isLoading: false,
    error: null
  })
}));
```

### Usage in Components

```typescript
import { useTravelStore } from '@/store';

function MyComponent() {
  const { travelResults, setTravelResults } = useTravelStore();
  
  // Component logic
}
```

---

## Authentication

### NextAuth with Firebase Adapter

**Configuration**: `src/lib/auth.ts`

```typescript
import { FirestoreAdapter } from '@auth/firebase-adapter';
import GoogleProvider from 'next-auth/providers/google';

export function getAuthOptions() {
  return {
    adapter: FirestoreAdapter(getAdminDb()),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    callbacks: {
      session: async ({ session, user }) => {
        if (session.user) {
          session.user.id = user.id;
        }
        return session;
      },
    },
    pages: {
      signIn: '/',
    },
  };
}
```

### Protected Routes

```typescript
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await getServerSession(getAuthOptions());
  
  if (!session) {
    redirect('/');
  }
  
  return <div>Protected Content</div>;
}
```

### Client-Side Auth

```typescript
'use client';
import { useSession } from 'next-auth/react';

export function AuthButton() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  
  if (session) {
    return <button onClick={() => signOut()}>Sign Out</button>;
  }
  
  return <button onClick={() => signIn('google')}>Sign In</button>;
}
```

---

## Database Schema

### Firestore Collections

#### `users` Collection
```typescript
interface User {
  id: string;                    // Auto-generated
  email: string;
  name: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
}
```

#### `searches` Collection
```typescript
interface Search {
  id: string;                    // Auto-generated
  userId: string;                // User reference
  source: string;                // Origin location
  destination: string;           // Target location
  searchDate: Date;              // Timestamp
  formData: {
    dates: {
      startDate: string;         // YYYY-MM-DD
      endDate: string;           // YYYY-MM-DD
    };
    travelerDetails: {
      level2: Level2FormData;
      level3: Level3FormData;
    };
  };
}
```

#### `itineraries` Collection
```typescript
interface Itinerary {
  id: string;                    // Auto-generated
  userId: string;                // User reference
  searchId: string;              // Search reference
  createdAt: Date;
  
  // AI-generated content
  optimalTravelDates: {
    startDate: string;
    endDate: string;
    reasons: string[];
  };
  alternativeDestinations: Array<{
    destination: string;
    reasons: string[];
    estimatedBudget: number;
  }>;
  itinerary: Array<{
    day: number;
    date: string;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
      estimatedCost: number;
      googleMapsLink?: string;
      placeDetails?: {
        rating: number;
        reviews: number;
        photos: string[];
      };
    }>;
  }>;
  estimatedCosts: {
    flights: number;
    accommodation: number;
    activities: number;
    food: number;
    transportation: number;
    total: number;
    currency: 'USD' | 'EUR' | 'INR';
  };
  accommodationRecommendations: Array<{
    name: string;
    type: string;
    pricePerNight: number;
    rating: number;
    googleMapsUri: string;
  }>;
  travelTips: string[];
}
```

### Firestore Indexes

**File**: `firestore.indexes.json`

```json
{
  "indexes": [
    {
      "collectionGroup": "searches",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "searchDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "itineraries",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## Deployment

### Firebase App Hosting

**Configuration**: `apphosting.yaml`

```yaml
runConfig:
  runtime: nodejs20
  
env:
  - variable: GOOGLE_API_KEY
    secret: google-api-key
  - variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    secret: google-maps-api-key
  - variable: NEXTAUTH_SECRET
    secret: nextauth-secret
```

### Deployment Steps

```bash
# 1. Build the application
npm run build

# 2. Test production build locally
npm start

# 3. Deploy to Firebase
firebase deploy

# 4. Deploy Firestore rules
firebase deploy --only firestore:rules

# 5. Deploy indexes
firebase deploy --only firestore:indexes
```

### Environment Variables in Firebase

```bash
# Set secrets
firebase apphosting:secrets:set GOOGLE_API_KEY
firebase apphosting:secrets:set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
firebase apphosting:secrets:set NEXTAUTH_SECRET
```

### Vercel Deployment (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Add environment variables in Vercel dashboard under Project Settings → Environment Variables.

---

## Contributing

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/wander-wise.git
   cd wander-wise
   git remote add upstream https://github.com/original-owner/wander-wise.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow TypeScript best practices
   - Use existing components from `src/components/ui`
   - Add types in `src/types`
   - Update tests if applicable

4. **Commit with Conventional Commits**
   ```bash
   git commit -m "feat: add new travel preference option"
   git commit -m "fix: resolve date picker timezone issue"
   git commit -m "docs: update API integration guide"
   ```

5. **Push & Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with TypeScript
- **Hooks**: Custom hooks in `src/hooks`
- **Naming**: 
  - Components: PascalCase (`TravelForm.tsx`)
  - Utilities: camelCase (`formatDate.ts`)
  - Types: PascalCase with `I` prefix for interfaces
- **Imports**: Absolute imports using `@/` alias

### Testing

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## Troubleshooting

### Common Issues

#### 1. Google Maps API Not Working

**Error**: `Google Maps API key is required`

**Solution**:
```bash
# Verify environment variable
echo $NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Ensure key is in .env.local with NEXT_PUBLIC_ prefix
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Restart dev server
npm run dev
```

#### 2. Firebase Authentication Fails

**Error**: `FirebaseError: Missing or insufficient permissions`

**Solution**:
```bash
# Check Firestore rules
firebase firestore:rules

# Deploy updated rules
firebase deploy --only firestore:rules

# Verify user is authenticated
# Check session in browser DevTools → Application → Cookies
```

#### 3. GenKit Flow Errors

**Error**: `Flow execution failed: Invalid schema`

**Solution**:
```typescript
// Validate input schema matches flow definition
// Check src/ai/flows/optimize-travel-dates.ts

// Test flow in GenKit UI
npm run genkit:dev
// Navigate to http://localhost:4000
```

#### 4. Build Errors

**Error**: `Module not found: Can't resolve '@/components/...'`

**Solution**:
```json
// Verify tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 5. Dependency Conflicts

**Error**: `ERESOLVE unable to resolve dependency tree`

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### Debug Mode

Enable detailed logging:

```typescript
// src/ai/genkit.ts
export const ai = genkit({
  plugins: [googleAI()],
  enableTracingAndMetrics: true,
  telemetry: {
    logger: 'console'
  }
});
```

### Performance Optimization

```bash
# Analyze bundle size
npm run build
# Check .next/analyze/ folder

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/wander-wise/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/wander-wise/discussions)
- **Email**: support@wanderwise.app

---

## Acknowledgments

- **Google Gemini AI** - Powering intelligent trip recommendations
- **Google Maps Platform** - Real-time location data
- **shadcn/ui** - Beautiful, accessible UI components
- **Next.js Team** - Amazing React framework
- **Firebase** - Reliable backend infrastructure

---

**Built with ❤️ by developers, for travelers**
