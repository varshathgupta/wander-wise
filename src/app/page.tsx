"use client";

import { useState } from "react";
import type { OptimizeTravelDatesOutput } from "@/ai/flows/optimize-travel-dates";
import { TravelOptimizerForm } from "@/components/travel-optimizer-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, CalendarDays, Map, Lightbulb, Search, MapPin, DollarSign } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [optimizationResult, setOptimizationResult] = useState<OptimizeTravelDatesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [destination, setDestination] = useState("");

  const handleFormSubmit = (destination: string) => {
    setDestination(destination);
  };

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

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card className="shadow-lg sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-headline">
                  <Search className="h-6 w-6 text-primary" />
                  Find Your Perfect Trip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Tell us your dream destination and travel dates, and our AI will help you find the best time to go or suggest amazing alternatives.
                </p>
                <TravelOptimizerForm 
                  setOptimizationResult={setOptimizationResult} 
                  setIsLoading={setIsLoading}
                  onFormSubmit={handleFormSubmit}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-8">
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-1/2 mb-4" />
                  <div className="space-y-8">
                    <Card className="shadow-lg">
                      <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardContent>
                    </Card>
                     <Card className="shadow-lg">
                      <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                     <Card className="shadow-lg">
                      <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                      <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                      <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : optimizationResult ? (
                <>
                  <h2 className="text-3xl font-bold font-headline text-gray-800">Trip Analysis for {destination}</h2>
                  
                  <Card className="shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-primary">
                        <Lightbulb />
                        AI-Powered Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-2 prose">
                      <p>{optimizationResult.reasoning}</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-primary">
                        <CalendarDays />
                        Optimal Dates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground prose">
                      <p>{optimizationResult.optimalDates}</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-primary">
                        <Map />
                        Alternative Destinations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground prose">
                       <p>{optimizationResult.alternativeDestinations}</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-primary">
                        <MapPin />
                        Places to Visit
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground prose">
                      <ul className="list-disc space-y-2 pl-5">
                        {optimizationResult.placesToVisit.map((place, index) => (
                          <li key={index}>{place}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-primary">
                        <DollarSign />
                        Estimated Expenses (per person)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-gray-800 mb-4">
                        ~${optimizationResult.estimatedExpense.totalPerPerson.toLocaleString()}
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground prose">
                        <p><strong>Flights:</strong> ${optimizationResult.estimatedExpense.breakdown.flights.toLocaleString()}</p>
                        <p><strong>Accommodation:</strong> ${optimizationResult.estimatedExpense.breakdown.accommodation.toLocaleString()}</p>
                        <p><strong>Food (daily):</strong> ${optimizationResult.estimatedExpense.breakdown.food.toLocaleString()}</p>
                        <p><strong>Activities:</strong> ${optimizationResult.estimatedExpense.breakdown.activities.toLocaleString()}</p>
                        <p><strong>Local Transport:</strong> ${optimizationResult.estimatedExpense.breakdown.transportation.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="flex flex-col items-center justify-center text-center p-12 shadow-lg h-full bg-card">
                  <Image src="https://placehold.co/400x300.png" alt="A map and a compass on a desk" width={400} height={300} data-ai-hint="travel adventure" className="mb-6 rounded-lg shadow-md"/>
                  <h2 className="text-2xl font-bold mb-2 font-headline">Your Adventure Awaits</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Fill out the form to get personalized travel recommendations and start planning your next journey.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
