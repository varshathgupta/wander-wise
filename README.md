# WanderWise: Travel Planning & Optimization App

## 🌟 Overview

WanderWise is a comprehensive travel planning application built with Next.js, React, and Google's Gemini AI. It helps travelers optimize their trips by suggesting the best travel dates, alternative destinations, itineraries, accommodations, and activities based on their preferences and constraints.

## ✨ Core Features

### 🎯 Multi-Level Trip Planning
- **Level 1 - Basic Trip Details**: Enter source, destination, dates, trip type, budget range, and currency
- **Level 2 - Trip Character**: Customize booking preferences, travel options, stay options, and trip-specific settings (adventure level, honeymoon style, leisure activities)
- **Level 3 - Personalized Experience**: Fine-tune cultural immersion, food preferences, language comfort, nightlife interests, and lifestyle choices

### 🤖 Enhanced AI-Powered Optimization
- **Smart Travel Suggestions**: Get AI-recommended optimal travel dates and alternative destinations
- **Comprehensive Trip Planning**: Receive detailed itineraries with activities, accommodations, and transportation
- **Dynamic Budget Planning**: Currency-aware budget ranges that adapt to trip type and destination
- **Cultural Personalization**: Tailored recommendations based on cultural preferences and dietary requirements

### 💰 Intelligent Expense Management
- **Multi-Currency Support**: USD, EUR, and INR with region-appropriate budget ranges
- **Comprehensive Cost Breakdown**: Flight costs, accommodation pricing, activity expenses, and local transportation
- **Trip-Type Aware Budgeting**: Different budget ranges for adventure, honeymoon, leisure, luxury, pilgrim, and other trip types

### 🗺️ Detailed Travel Intelligence
- **Daily Itinerary Builder**: AI-generated day-by-day plans with time-specific activities
- **Local Recommendations**: Curated attractions, food spots, and transportation options
- **Accommodation Finder**: Rated accommodations with booking links and pricing
- **Cultural Integration**: Language barrier assistance and authentic local experience suggestions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Framework**: TailwindCSS with Tailwind Animate
- **UI Components**: Radix UI with shadcn/ui (40+ components)
- **Form Management**: React Hook Form with Zod validation
- **AI Integration**: GenKit v1.13 with Google AI (Gemini)
- **Date Handling**: React Day Picker with date-fns
- **Charts & Visualization**: Recharts
- **Development**: Turbopack, ESLint, TypeScript compiler
- **Additional Libraries**: Lucide React (icons), Firebase, Embla Carousel

## 📋 Prerequisites

Before you begin, ensure you have the following:

- Node.js (v18 or later)
- npm or yarn
- Google Gemini API key

## 🚀 Getting Started

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/wander-wise.git
   cd wander-wise
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Google API key
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## 📂 Project Structure

```
wander-wise/
├── src/
│   ├── app/            # Next.js app router pages and layouts
│   │   ├── actions.ts  # Server actions for form handling
│   │   ├── layout.tsx  # App layout with global styles
│   │   └── page.tsx    # Main landing page
│   ├── ai/             # AI models and flows
│   │   ├── dev.ts      # Development AI configuration
│   │   ├── genkit.ts   # GenKit configuration and setup
│   │   └── flows/      # AI workflow definitions
│   │       └── optimize-travel-dates.ts  # Main travel optimization flow
│   ├── components/     # Reusable React components
│   │   ├── travel-optimizer-form.tsx     # Main form wrapper
│   │   ├── travel-optimizer/             # Multi-level form system
│   │   │   ├── form-header.tsx          # Form header component
│   │   │   ├── form-navigation.tsx      # Navigation between levels
│   │   │   ├── form-schema.ts           # Zod validation schemas
│   │   │   ├── level1-form.tsx          # Basic trip details
│   │   │   ├── level2-form/             # Trip character forms
│   │   │   │   ├── adventure-form.tsx   # Adventure-specific options
│   │   │   │   ├── booking-preferences.tsx
│   │   │   │   ├── honeymoon-form.tsx   # Honeymoon-specific options
│   │   │   │   ├── leisure-form.tsx     # Leisure trip options
│   │   │   │   └── personalization-toggle.tsx
│   │   │   └── level3-form/             # Personalized experience
│   │   │       ├── cultural-section.tsx
│   │   │       ├── food-section.tsx
│   │   │       ├── language-section.tsx
│   │   │       └── nightlife-section.tsx
│   │   └── ui/         # Radix UI component library (40+ components)
│   ├── hooks/          # Custom React hooks
│   │   ├── use-mobile.tsx    # Mobile detection hook
│   │   └── use-toast.ts      # Toast notification hook
│   └── lib/            # Utility functions and helpers
│       └── utils.ts    # Tailwind merge utilities
├── docs/               # Project documentation
│   └── blueprint.md    # Project blueprint and specifications
├── public/             # Static assets
│   └── images/         # Image assets including hero image
└── Configuration Files
    ├── apphosting.yaml      # Firebase app hosting config
    ├── components.json      # shadcn/ui components config
    ├── next.config.ts       # Next.js configuration
    ├── package.json         # Dependencies and scripts
    ├── tailwind.config.ts   # Tailwind CSS configuration
    └── tsconfig.json        # TypeScript configuration
```

## 🎨 Design Guidelines

- **Color Palette**:
  - Primary: Light orange (#FFB347) - Excitement and energy
  - Background: Off-white (#F8F8F8) - Clean and modern look
  - Accent: Pale yellow (#FFDA63) - Gentle contrast

- **Typography**:
  - Font: 'PT Sans' - Modern and approachable design

## ⚙️ Configuration

The project uses several configuration files:

- `next.config.ts`: Next.js configuration with Turbopack support
- `tailwind.config.ts`: Tailwind CSS configuration with custom animations
- `components.json`: shadcn/ui components configuration
- `tsconfig.json`: TypeScript configuration
- `apphosting.yaml`: Firebase app hosting configuration

## 🎯 Key Features in Detail

### Multi-Level Form System
The application features a sophisticated three-level form system:

1. **Level 1**: Collects basic trip information (source, destination, dates, trip type, budget, currency)
2. **Level 2**: Gathers trip character details specific to the chosen trip type:
   - **Adventure trips**: Intensity level, group composition
   - **Honeymoon trips**: Privacy preferences, special add-ons
   - **Leisure trips**: Activity preferences, relaxation level
3. **Level 3**: Personalizes the experience with cultural, food, and lifestyle preferences

### Dynamic Budget System
- **Currency-aware budgeting**: Supports USD, EUR, and INR with region-appropriate ranges
- **Trip-type specific ranges**: Different budget categories for each trip type
- **Intelligent cost estimation**: AI calculates comprehensive trip costs within specified budgets

### AI-Powered Optimization
- **Comprehensive travel analysis**: Evaluates dates, destinations, and preferences
- **Detailed itinerary generation**: Creates day-by-day plans with specific activities and timings
- **Local expertise**: Provides authentic recommendations for food, culture, and activities
- **Multi-currency cost analysis**: Accurate pricing in user's preferred currency

## 🧪 Development Tools

- **Next.js Development**:
  ```bash
  npm run dev          # Start development server with Turbopack
  ```

- **GenKit Development**:
  ```bash
  npm run genkit:dev   # Start GenKit development server
  npm run genkit:watch # Start GenKit in watch mode
  ```

- **Code Quality**:
  ```bash
  npm run lint         # Run ESLint
  npm run typecheck    # TypeScript type checking
  ```

- **Production**:
  ```bash
  npm run build        # Build for production
  npm start           # Start production server
  ```

## 🔒 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
GOOGLE_API_KEY=your_google_api_key_here
```

Or alternatively:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [GenKit Documentation](https://genkit.dev/docs)
- [Google AI Documentation](https://ai.google.dev/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/wander-wise/issues).



Built with ❤️ using Next.js and Google Gemini AI
