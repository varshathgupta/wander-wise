# WanderWise: Travel Planning & Optimization App

![WanderWise Logo](https://via.placeholder.com/150?text=WanderWise)

## 🌟 Overview

WanderWise is a comprehensive travel planning application built with Next.js, React, and Google's Gemini AI. It helps travelers optimize their trips by suggesting the best travel dates, alternative destinations, itineraries, accommodations, and activities based on their preferences and constraints.

## ✨ Core Features

- **Trip Details Input**: Enter destination, dates, and traveler information to define your trip
- **AI-powered Travel Optimization**: Get suggestions for better travel dates or alternative destinations based on your preferences
- **Daily Itinerary Builder**: Receive AI-generated day-by-day itineraries with activities and location details
- **Expense Estimation**: Get cost estimates for flights, accommodations, activities, and overall trip expenses
- **Local Recommendations**: Discover recommended attractions, food spots, and transportation options

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS
- **UI Components**: Radix UI with shadcn/ui
- **State Management**: React Hook Form
- **AI Integration**: GenKit with Google AI (Gemini)
- **Validation**: Zod
- **Styling**: Tailwind CSS with animations

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
│   ├── ai/             # AI models and flows
│   │   ├── flows/      # AI workflow definitions
│   │   └── genkit.ts   # GenKit configuration
│   ├── components/     # Reusable React components
│   │   └── ui/         # UI component library
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions and helpers
├── docs/               # Project documentation
└── public/             # Static assets
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

- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `components.json`: UI components configuration
- `tsconfig.json`: TypeScript configuration

## 🧪 Development Tools

- **GenKit Development**:
  ```bash
  npm run genkit:dev
  ```

- **GenKit Watch Mode**:
  ```bash
  npm run genkit:watch
  ```

- **Type Checking**:
  ```bash
  npm run typecheck
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

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

---

Built with ❤️ using Next.js and Google Gemini AI
