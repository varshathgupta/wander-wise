"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { useItinerary } from "@/store/travel-store";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/**
 * Example component demonstrating how to use store selectors
 * This component automatically re-renders only when itinerary data changes
 */
export function ItineraryCard() {
  const itinerary = useItinerary();

  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <ClipboardList />
          Day-by-Day Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {itinerary.map((dayPlan, index) => (
            <AccordionItem key={index} value={`day-${index}`}>
              <AccordionTrigger className="text-left">
                <div>
                  <p className="font-bold">Day {dayPlan.day}</p>
                  <p className="text-sm text-muted-foreground">{dayPlan.title}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {dayPlan.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="border-l-2 border-primary pl-4">
                      <p className="font-semibold text-sm text-primary">{activity.time}</p>
                      <p className="font-bold">{activity.activity}</p>
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
  );
}
