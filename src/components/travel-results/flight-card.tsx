"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaneTakeoff } from "lucide-react";
import { useCheapestFlight, useCurrencyInfo } from "@/store/travel-store";

/**
 * Example component demonstrating how to use store selectors
 * This component automatically re-renders only when flight data changes
 */
export function FlightCard() {
  const flight = useCheapestFlight();
  const { symbol: currencySymbol } = useCurrencyInfo();

  if (!flight) {
    return null;
  }

  return (
    <Card className="shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <PlaneTakeoff />
          Cheapest Flight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">{flight.airline}</p>
          <p className="font-bold text-lg text-primary">
            {currencySymbol}
            {flight.price.toLocaleString()}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{flight.details}</p>
      </CardContent>
    </Card>
  );
}
