"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Plane, MapPin, Globe, Camera, Coffee } from "lucide-react";

const travelContent = [
  {
    type: "joke",
    icon: Coffee,
    title: "Travel Humor",
    items: [
      "Why don't mountains ever get cold? They wear snow caps! ⛰️",
      "What's a traveler's favorite type of math? Plane geometry! ✈️",
      "Why did the tourist bring a ladder? To reach new heights! 🪜",
      "What do you call a well-traveled cat? A globe-trotter! 🐱",
      "Why don't secrets work on vacation? Too many leaks at the beach! 🏖️",
      "What's a traveler's favorite instrument? The travel log! 📔",
    ],
  },
  {
    type: "fact",
    icon: Globe,
    title: "Travel Facts",
    items: [
      "There are 195 countries in the world today. How many have you visited? 🌍",
      "France is the most visited country, welcoming 89 million tourists annually! 🇫🇷",
      "The world's shortest flight is 2 minutes between Scottish islands! ⏱️",
      "Japan has over 6,800 islands, but only 430 are inhabited! 🗾",
      "Dubai's Burj Khalifa is taller than 2.5 Eiffel Towers stacked! 🏗️",
      "There are more than 7,000 languages spoken worldwide! 🗣️",
    ],
  },
  {
    type: "tip",
    icon: MapPin,
    title: "Travel Tips",
    items: [
      "Book flights on Tuesday afternoons for the best deals! 💰",
      "Download offline maps before you travel - lifesaver! 📱",
      "Pack a photocopy of your passport in a separate bag! 📄",
      "Learn basic phrases in the local language - locals love it! 👋",
      "Bring an empty water bottle through security to save money! 💧",
      "Take photos of your hotel card in case you get lost! 📸",
    ],
  },
  {
    type: "stat",
    icon: Camera,
    title: "Travel Stats",
    items: [
      "1.5 billion international trips are made each year! ✈️",
      "Average person travels 22,600 km per year! 🛣️",
      "Tourism contributes $9.6 trillion to global economy! 💵",
      "Most popular travel season: July-August! ☀️",
      "63% of travelers prefer experiences over material things! 🎭",
      "Average vacation length is 7-10 days worldwide! 📅",
    ],
  },
  {
    type: "destination",
    icon: Plane,
    title: "Did You Know?",
    items: [
      "Iceland has no mosquitoes! Perfect summer destination! 🦟",
      "New Zealand has more sheep than people (6:1 ratio)! 🐑",
      "Venice is built on 118 small islands connected by bridges! 🌉",
      "Norway has midnight sun for 76 days straight in summer! 🌞",
      "Singapore bans chewing gum to keep the city clean! 🚫",
      "Finland has 188,000 lakes - the most in the world! 🏞️",
    ],
  },
];

export function TravelLoader() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contentIndex, setContentIndex] = useState(0);

  useEffect(() => {
    // Change content every 10 seconds
    const interval = setInterval(() => {
      setContentIndex((prev) => {
        const nextIndex = (prev + 1) % travelContent.length;
        setCurrentIndex(0); // Reset item index when changing content type
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Rotate through items every 3 seconds
    const itemInterval = setInterval(() => {
      setCurrentIndex((prev) => 
        (prev + 1) % travelContent[contentIndex].items.length
      );
    }, 3000);

    return () => clearInterval(itemInterval);
  }, [contentIndex]);

  const currentContent = travelContent[contentIndex];
  const Icon = currentContent.icon;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="max-w-2xl w-full mx-4 p-8 shadow-2xl">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Loader */}
          <div className="relative">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <Plane className="h-8 w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-headline text-primary">
              Planning Your Perfect Trip
            </h2>
            <p className="text-muted-foreground">
              Our AI is crafting a personalized itinerary just for you...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>

          {/* Travel Content Card */}
          <Card className="w-full p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg font-headline">
                  {currentContent.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed animate-fade-in">
                  {currentContent.items[currentIndex]}
                </p>
              </div>
            </div>
          </Card>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {travelContent.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  idx === contentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
