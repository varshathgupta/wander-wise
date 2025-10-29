"use client";

import { TravelOptimizerForm } from "@/components/travel-optimizer-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Plane className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">
                WanderWise
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-headline">
                <Search className="h-6 w-6 text-primary" />
                Find Your Perfect Trip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Tell us your dream destination and travel dates, and our AI will create a detailed itinerary for you.
              </p>
              <TravelOptimizerForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
