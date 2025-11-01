"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  useOptimizationResult, 
  useTripMetadata, 
  useCurrencyInfo 
} from "@/store/travel-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  CalendarDays, 
  Map, 
  PlaneTakeoff, 
  Train, 
  Bus,
  Hotel,
  UtensilsCrossed,
  MapPin,
  Star,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";

export default function SuggestionsPage() {
  const router = useRouter();
  const optimizationResult = useOptimizationResult();
  const { source, destination } = useTripMetadata();
  const { symbol: currencySymbol } = useCurrencyInfo();

  // Redirect to home if no optimization result
  useEffect(() => {
    if (!optimizationResult) {
      router.push("/");
    }
  }, [optimizationResult, router]);

  if (!optimizationResult) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Amount Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-gray-800 mb-1">
              {source} to {destination}
            </h1>
            <p className="text-sm text-muted-foreground">Your personalized travel suggestions</p>
          </div>
          <Card className="shadow-md bg-primary text-primary-foreground p-4 rounded-lg flex-shrink-0">
            <div className="text-center">
              <p className="text-xs mb-1">Estimated Cost</p>
              <p className="text-2xl font-bold">
                {currencySymbol}{optimizationResult.totalEstimatedCostPerPerson.toLocaleString()}
              </p>
              <p className="text-xs opacity-90 mt-1">per person</p>
            </div>
          </Card>
        </div>

        {/* AI Suggestions + Optimal Dates + Alternative Destinations */}
        <div className="grid gap-4 mb-6">
          <Card className="shadow-md bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-headline text-primary text-lg">
                <Lightbulb className="h-4 w-4" />
                AI-Powered Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm pt-0">
              <p>{optimizationResult.reasoning}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="shadow-md bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-headline text-primary text-base">
                  <CalendarDays className="h-4 w-4" />
                  Optimal Travel Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm pt-0">
                <p className="font-semibold text-gray-800">
                  {optimizationResult.optimalDates}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-headline text-primary text-base">
                  <Map className="h-4 w-4" />
                  Alternative Destinations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm pt-0">
                <p className="font-semibold text-gray-800">
                  {optimizationResult.alternativeDestinations}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mode of Reach (Flight, Bus, Train) + Local Transportation */}
        <div className="mb-6">
          <h2 className="text-xl font-bold font-headline text-gray-800 mb-3">
            Transportation Options
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Flight */}
            <Card className="shadow-md bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-headline text-primary text-base">
                  <PlaneTakeoff className="h-4 w-4" />
                  Flights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {optimizationResult.cheapestFlight ? (
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-sm">{optimizationResult.cheapestFlight.airline}</p>
                        <p className="text-xs text-muted-foreground mt-1">{optimizationResult.cheapestFlight.details}</p>
                      </div>
                      <p className="font-bold text-sm text-primary ml-2">
                        {currencySymbol}{(Number(optimizationResult.cheapestFlight.price) * 2).toLocaleString()}

                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No flight options available</p>
                )}
              </CardContent>
            </Card>

            {/* Train */}
            <Card className="shadow-md bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-headline text-primary text-base">
                  <Train className="h-4 w-4" />
                  Trains & Bus
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {optimizationResult.directTrains && optimizationResult.directTrains.length > 0 ? (
                  optimizationResult.directTrains.slice(0, 3).map((train, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-sm">{train.trainName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {train.departureStation} → {train.arrivalStation}
                          </p>
                        </div>
                        <p className="font-bold text-sm text-primary ml-2">
                          {currencySymbol}{train.price.toLocaleString()}
                        </p>
                      </div>
                      {index < Math.min(optimizationResult.directTrains?.length ?? 0, 3) - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No train options available</p>
                )}
                {optimizationResult.directTrains && optimizationResult.directTrains.length > 3 && (
                  <p className="text-xs text-primary font-medium mt-2">
                    +{optimizationResult.directTrains.length - 3} more options
                  </p>
                )}
              </CardContent>
            </Card>

            {/*  Local Transportation */}
            <Card className="shadow-md bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-headline text-primary text-base">
                  <Bus className="h-4 w-4" />
                  Local Transit
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {optimizationResult.localTransportation && optimizationResult.localTransportation.length > 0 ? (
                  optimizationResult.localTransportation.slice(0, 3).map((transport, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-sm">{transport.type}</p>
                          <p className="text-xs text-muted-foreground mt-1">{transport.details}</p>
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground ml-2">
                          {currencySymbol} {transport.estimatedCost}
                        </p>
                      </div>
                      {index < Math.min(optimizationResult.localTransportation?.length ?? 0, 3) - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">Local transportation info coming soon</p>
                )}
                {optimizationResult.localTransportation && optimizationResult.localTransportation.length > 3 && (
                  <p className="text-xs text-primary font-medium mt-2">
                    +{optimizationResult.localTransportation.length - 3} more options
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Must Visit Places */}
        <div className="mb-6">
          <h2 className="text-xl font-bold font-headline text-gray-800 mb-3">
            Must Visit Places
          </h2>
          <Card className="shadow-md bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-headline text-primary text-base">
                <MapPin className="h-4 w-4" />
                Top Attractions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {optimizationResult.placesToVisit && optimizationResult.placesToVisit.length > 0 ? (
                <ul className="grid md:grid-cols-2 gap-2">
                  {optimizationResult.placesToVisit.map((place, index) => (
                    <li key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{place}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No places listed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Accommodations and Famous Food Spots */}
        <div className="mb-6">
          <h2 className="text-xl font-bold font-headline text-gray-800 mb-3">
            Where to Stay & Eat
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Accommodations */}
            <Card className="shadow-md bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-headline text-primary text-base">
                  <Hotel className="h-4 w-4" />
                  Recommended Stays
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {optimizationResult.recommendedAccommodations && optimizationResult.recommendedAccommodations.length > 0 ? (
                  optimizationResult.recommendedAccommodations.slice(0, 3).map((hotel, index) => (
                    <div key={index}>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm break-words">{hotel.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{hotel.type}</Badge>
                              <div className="flex items-center gap-1 text-xs text-amber-500">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                          <Link 
                            href={hotel.bookingLink} 
                            target="_blank" 
                            className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                          >
                            Book Now <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                      {index < Math.min(optimizationResult.recommendedAccommodations?.length ?? 0, 3) - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No accommodations available.</p>
                )}
                {optimizationResult.recommendedAccommodations && optimizationResult.recommendedAccommodations.length > 3 && (
                  <p className="text-xs text-primary font-medium mt-2">
                    +{optimizationResult.recommendedAccommodations.length - 3} more options
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Famous Food Spots */}
            <Card className="shadow-md bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-headline text-primary text-base">
                  <UtensilsCrossed className="h-4 w-4" />
                  Famous Food Spots
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {optimizationResult.famousFoodSpots && optimizationResult.famousFoodSpots.length > 0 ? (
                  optimizationResult.famousFoodSpots.slice(0, 5).map((spot, index) => (
                    <div key={index}>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                        <UtensilsCrossed className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-semibold text-sm break-words">{spot.name}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">{spot.type || spot.cuisine}</Badge>
                            {spot.rating && spot.rating > 0 && (
                              <div className="flex items-center gap-1 text-xs text-amber-500">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="font-semibold">{spot.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < Math.min(optimizationResult.famousFoodSpots?.length ?? 0, 5) - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No food spots available.</p>
                )}
                {optimizationResult.famousFoodSpots && optimizationResult.famousFoodSpots.length > 5 && (
                  <p className="text-xs text-primary font-medium mt-2">
                    +{optimizationResult.famousFoodSpots.length - 5} more spots
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-8 mb-6">
          <Button
            variant="outline"
            size="default"
            onClick={() => router.push("/")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>
          <Button
            size="default"
            onClick={() => router.push("/itinerary")}
            className="w-full sm:w-auto"
          >
            View Detailed Itinerary
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
