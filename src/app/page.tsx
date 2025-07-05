"use client";

import { useState } from "react";
import type { OptimizeTravelDatesOutput } from "@/ai/flows/optimize-travel-dates";
import { TravelOptimizerForm } from "@/components/travel-optimizer-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, CalendarDays, Map, Lightbulb, Search, MapPin, DollarSign, PlaneTakeoff, Hotel, UtensilsCrossed, PartyPopper, Bus, Star, ExternalLink, ClipboardList, Train } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  const [optimizationResult, setOptimizationResult] = useState<OptimizeTravelDatesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleFormSubmit = (data: { source: string; destination: string; }) => {
    setSource(data.source);
    setDestination(data.destination);
  };

  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    INR: "₹",
  };
  
  const currencySymbol = optimizationResult ? currencySymbols[optimizationResult.currency] : '₹';

  const renderSkeletons = () => (
    <>
      <Skeleton className="h-10 w-3/4 mb-6" />
      <div className="space-y-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-7 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  const renderResults = () => {
    if (!optimizationResult) return null;
    
    return (
      <>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-3xl font-bold font-headline text-gray-800 mb-2 sm:mb-0">Trip Analysis for {source} to {destination}</h2>
          <Card className="shadow-md bg-primary text-primary-foreground p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6"/>
              <span className="text-sm">Total Est. Cost (p.p.)</span>
            </div>
             <p className="text-2xl font-bold text-right">
                ~{currencySymbol}{optimizationResult.totalEstimatedCostPerPerson.toLocaleString()}
              </p>
          </Card>
        </div>
        
        <Card className="shadow-lg bg-white mb-8">
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

        <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-primary">
                  <CalendarDays />
                  Optimal Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground prose">
                <p className="font-semibold text-lg">{optimizationResult.optimalDates}</p>
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
                <p className="font-semibold text-lg">{optimizationResult.alternativeDestinations}</p>
              </CardContent>
            </Card>
        </div>

        <Card className="shadow-lg bg-white mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-primary">
              <PlaneTakeoff />
              Cheapest Flight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">{optimizationResult.cheapestFlight.airline}</p>
              <p className="font-bold text-lg text-primary">{currencySymbol}{optimizationResult.cheapestFlight.price.toLocaleString()}</p>
            </div>
            <p className="text-sm text-muted-foreground">{optimizationResult.cheapestFlight.details}</p>
          </CardContent>
        </Card>
        
        {optimizationResult.directTrains && optimizationResult.directTrains.length > 0 && (
          <Card className="shadow-lg bg-white mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-primary">
                <Train />
                Direct Trains
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizationResult.directTrains.map((train, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start gap-4">
                      <div>
                          <h3 className="font-bold">{train.trainName}</h3>
                          <p className="text-sm text-muted-foreground">From {train.departureStation} to {train.arrivalStation}</p>
                          <p className="text-sm text-muted-foreground">{train.details}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                          <p className="font-bold text-primary">{currencySymbol}{train.price.toLocaleString()}</p>
                      </div>
                  </div>
                  {index < optimizationResult.directTrains.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg bg-white mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-primary">
              <Hotel />
             Recommended Accommodations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {optimizationResult.recommendedAccommodations.map((hotel, index) => (
              <div key={index}>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="font-bold">{hotel.name} <Badge variant="secondary">{hotel.type}</Badge></h3>
                        <div className="flex items-center gap-1 text-sm text-amber-500">
                            <Star className="h-4 w-4 fill-current" /> <span>{hotel.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-bold text-primary">{currencySymbol}{hotel.pricePerNight.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ night</span></p>
                        <Link href={hotel.bookingLink} target="_blank" className="text-sm text-blue-500 hover:underline flex items-center justify-end gap-1">
                            Book Now <ExternalLink className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
                {index < optimizationResult.recommendedAccommodations.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white mt-8">
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

        {optimizationResult.itinerary && optimizationResult.itinerary.length > 0 && (
          <Card className="shadow-lg bg-white mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-primary">
                <ClipboardList />
                Daily Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {optimizationResult.itinerary.map((dayPlan, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="font-bold text-left hover:no-underline">
                      Day {dayPlan.day}: {dayPlan.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pl-4 border-l-2 border-primary/20 ml-2 mt-2">
                        {dayPlan.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="relative">
                            <div className="absolute -left-[1.45rem] top-1 h-4 w-4 rounded-full bg-primary border-2 border-background" />
                            <p className="font-semibold">{activity.time}: {activity.activity}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg bg-white mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-primary">
                    <PartyPopper />
                    Recommended Activities
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {optimizationResult.recommendedActivities.map((activity, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold">{activity.name}</h3>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                            <p className="font-bold text-primary whitespace-nowrap pl-4">
                                {activity.price > 0 ? `${currencySymbol}${activity.price.toLocaleString()}` : 'Free'}
                            </p>
                        </div>
                        {index < optimizationResult.recommendedActivities.length - 1 && <Separator className="my-4" />}
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card className="shadow-lg bg-white mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-primary">
                    <UtensilsCrossed />
                    Famous Food Spots
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {optimizationResult.famousFoodSpots.map((spot, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">{spot.name} <Badge variant="outline">{spot.cuisine}</Badge></h3>
                            <p className="font-bold text-amber-600">{spot.estimatedCost}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{spot.location}</p>
                        {index < optimizationResult.famousFoodSpots.length - 1 && <Separator className="my-4" />}
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card className="shadow-lg bg-white mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-primary">
                    <Bus />
                    Local Transportation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {optimizationResult.localTransportation.map((transport, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">{transport.type}</h3>
                            <p className="text-sm font-semibold text-muted-foreground">{transport.estimatedCost}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{transport.details}</p>
                        {index < optimizationResult.localTransportation.length - 1 && <Separator className="my-4" />}
                    </div>
                ))}
            </CardContent>
        </Card>

      </>
    );
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
                  Tell us your dream destination and travel dates, and our AI will create a detailed itinerary for you.
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
              {isLoading 
                ? renderSkeletons() 
                : optimizationResult 
                ? renderResults() 
                : (
                <Card className="flex flex-col items-center justify-center text-center p-12 shadow-lg h-full bg-card">
                  <Image src="https://media.istockphoto.com/id/1226000546/vector/vector-coach-bus-travelling.jpg?s=1024x1024&w=is&k=20&c=lQscKFwwvylixQLuoGGdP65N_GSlaWgfe8gNT-7dKmQ=" alt="Famous world landmarks around the globe" width={400} height={267} data-ai-hint="world landmarks travel" className="mb-6 rounded-lg shadow-md"/>
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
