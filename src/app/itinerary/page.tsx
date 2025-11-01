"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useItinerary, useTripMetadata } from "@/store/travel-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ClipboardList,
  MapPin,
  Clock,
  Star,
  ExternalLink,
  Phone,
  Globe,
  Navigation,
  ArrowLeft,
  DollarSign,
  ChevronDown,
  Info,
  Sunrise,
  Sun,
  Moon,
} from "lucide-react";
import type { EnrichedActivity } from "@/lib/enrich-itinerary";
import { Header } from "@/components/header";
import Link from "next/link";

// Helper function to categorize activities by time of day
function categorizeActivitiesByTime(activities: EnrichedActivity[]) {
  const morning: EnrichedActivity[] = [];
  const afternoon: EnrichedActivity[] = [];
  const evening: EnrichedActivity[] = [];

  activities.forEach((activity) => {
    if (!activity.time) {
      afternoon.push(activity); // Default to afternoon if no time
      return;
    }

    const timeStr = activity.time.toLowerCase();
    
    // Parse time ranges like "9:00 AM - 11:00 AM" or single times like "9:00 AM"
    const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
    if (match) {
      let hour = parseInt(match[1]);
      const meridiem = match[3].toLowerCase();
      
      if (meridiem === 'pm' && hour !== 12) hour += 12;
      if (meridiem === 'am' && hour === 12) hour = 0;

      if (hour >= 5 && hour < 12) {
        morning.push(activity);
      } else if (hour >= 12 && hour < 17) {
        afternoon.push(activity);
      } else {
        evening.push(activity);
      }
    } else {
      // If we can't parse the time, use keywords
      if (timeStr.includes('morning') || timeStr.includes('breakfast')) {
        morning.push(activity);
      } else if (timeStr.includes('evening') || timeStr.includes('night') || timeStr.includes('dinner')) {
        evening.push(activity);
      } else {
        afternoon.push(activity);
      }
    }
  });

  return { morning, afternoon, evening };
}

// Component to render a single activity cell
function ActivityCell({ activities }: { activities: EnrichedActivity[] }) {
  if (activities.length === 0) {
    return (
      <TableCell className="align-top bg-gray-50">
        <p className="text-sm text-muted-foreground text-center py-4">No activities</p>
      </TableCell>
    );
  }

  return (
    <TableCell className="align-top">
      <div className="space-y-6 py-2">
        {activities.map((activity, idx) => (
          <div key={idx} className="space-y-3 pb-6 border-b last:border-b-0">
            {/* Activity Title with Tags */}
            <div>
              <h4 className="font-bold text-base mb-2">{activity.activity}</h4>
              {activity.tags && activity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {activity.tags.map((tag, tagIdx) => (
                    <Badge 
                      key={tagIdx} 
                      variant="secondary" 
                      className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Location Information */}
            {activity.address && (
              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-blue-900">Location</p>
                    <p className="text-sm text-gray-700">{activity.address}</p>
                    {activity.mapUrl && (
                      <a
                        href={activity.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-1 text-xs font-medium"
                      >
                        Open in Google Maps <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>

            {/* Key Details - Rating and Entry Fee */}
            <div className="flex flex-wrap gap-3">
              {activity.rating && (
                <div className="flex items-center gap-1.5 text-sm bg-yellow-50 px-2.5 py-1.5 rounded-md">
                  <Star className="h-3.5 w-3.5 text-yellow-600 fill-yellow-600" />
                  <span className="font-semibold text-yellow-900">{activity.rating.toFixed(1)}</span>
                  <span className="text-yellow-700 text-xs">Rating</span>
                </div>
              )}
              {activity.entryFee && (
                <div className="flex items-center gap-1.5 text-sm bg-green-50 px-2.5 py-1.5 rounded-md">
                  <DollarSign className="h-3.5 w-3.5 text-green-600" />
                  <span className="font-medium text-green-900">{activity.entryFee}</span>
                </div>
              )}
            </div>

            {/* Collapsible Timing & Additional Details */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
                <Info className="h-4 w-4" />
                <span>View timing & details</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3 pl-6 border-l-2 border-gray-200">
                {/* Time */}
                {activity.time && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3.5 w-3.5 text-gray-600" />
                    <span className="font-medium text-gray-700">Timing:</span>
                    <span className="text-gray-600">{activity.time}</span>
                  </div>
                )}

                {/* Opening Hours */}
                {activity.openingHours && (
                  <div className="text-sm">
                    <p className="font-medium text-gray-700 mb-1">Opening Hours:</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{activity.openingHours}</p>
                  </div>
                )}

                {/* Contact Links */}
                <div className="flex flex-wrap gap-3">
                  {activity.websiteUrl && (
                    <a
                      href={activity.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      Website
                    </a>
                  )}
                  {activity.phoneNumber && (
                    <a
                      href={`tel:${activity.phoneNumber}`}
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      Call
                    </a>
                  )}
                </div>

                {/* Directions */}
                {activity.directions && (
                  <div className="bg-gray-50 p-2.5 rounded text-xs space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <Navigation className="h-3 w-3" />
                      How to Reach
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {activity.directions.travelMode}
                      </Badge>
                      <span className="text-muted-foreground">
                        {activity.directions.duration} • {activity.directions.distance}
                      </span>
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>
    </TableCell>
  );
}

// Mobile-friendly component using Accordion
function MobileItineraryView({ itinerary }: { itinerary: Array<{ day: number; title: string; activities: EnrichedActivity[] }> }) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {itinerary.map((dayPlan) => {
        const { morning, afternoon, evening } = categorizeActivitiesByTime(dayPlan.activities);
        
        return (
          <AccordionItem key={dayPlan.day} value={`day-${dayPlan.day}`} className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="text-left">
                <p className="font-bold text-lg">Day {dayPlan.day}</p>
                <p className="text-sm text-muted-foreground">{dayPlan.title}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-6">
                {/* Morning Activities */}
                {morning.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-amber-600 font-semibold">
                      <Sunrise className="h-4 w-4" />
                      <h3 className="text-sm">Morning (5 AM - 12 PM)</h3>
                    </div>
                    <div className="space-y-4 pl-2 border-l-2 border-amber-200">
                      {morning.map((activity, idx) => (
                        <ActivityCard key={idx} activity={activity} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Afternoon Activities */}
                {afternoon.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-orange-600 font-semibold">
                      <Sun className="h-4 w-4" />
                      <h3 className="text-sm">Afternoon (12 PM - 5 PM)</h3>
                    </div>
                    <div className="space-y-4 pl-2 border-l-2 border-orange-200">
                      {afternoon.map((activity, idx) => (
                        <ActivityCard key={idx} activity={activity} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Evening Activities */}
                {evening.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-indigo-600 font-semibold">
                      <Moon className="h-4 w-4" />
                      <h3 className="text-sm">Evening/Night (5 PM onwards)</h3>
                    </div>
                    <div className="space-y-4 pl-2 border-l-2 border-indigo-200">
                      {evening.map((activity, idx) => (
                        <ActivityCard key={idx} activity={activity} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

// Reusable Activity Card for mobile view
function ActivityCard({ activity }: { activity: EnrichedActivity }) {
  return (
    <div className="space-y-3 pb-4 pl-2">
      {/* Activity Title with Tags */}
      <div>
        <h4 className="font-bold text-base mb-2">{activity.activity}</h4>
        {activity.tags && activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {activity.tags.map((tag, tagIdx) => (
              <Badge 
                key={tagIdx} 
                variant="secondary" 
                className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Location Information */}
      {activity.address && (
        <div className="bg-blue-50 p-3 rounded-lg space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm text-blue-900">Location</p>
              <p className="text-sm text-gray-700">{activity.address}</p>
              {activity.mapUrl && (
                <a
                  href={activity.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-1 text-xs font-medium"
                >
                  Open in Google Maps <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>

      {/* Key Details - Rating and Entry Fee */}
      <div className="flex flex-wrap gap-3">
        {activity.rating && (
          <div className="flex items-center gap-1.5 text-sm bg-yellow-50 px-2.5 py-1.5 rounded-md">
            <Star className="h-3.5 w-3.5 text-yellow-600 fill-yellow-600" />
            <span className="font-semibold text-yellow-900">{activity.rating.toFixed(1)}</span>
            <span className="text-yellow-700 text-xs">Rating</span>
          </div>
        )}
        {activity.entryFee && (
          <div className="flex items-center gap-1.5 text-sm bg-green-50 px-2.5 py-1.5 rounded-md">
            <DollarSign className="h-3.5 w-3.5 text-green-600" />
            <span className="font-medium text-green-900">{activity.entryFee}</span>
          </div>
        )}
      </div>

      {/* Collapsible Timing & Additional Details */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
          <Info className="h-4 w-4" />
          <span>View timing & details</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3 pl-6 border-l-2 border-gray-200">
          {/* Time */}
          {activity.time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-gray-600" />
              <span className="font-medium text-gray-700">Timing:</span>
              <span className="text-gray-600">{activity.time}</span>
            </div>
          )}

          {/* Opening Hours */}
          {activity.openingHours && (
            <div className="text-sm">
              <p className="font-medium text-gray-700 mb-1">Opening Hours:</p>
              <p className="text-xs text-gray-600 leading-relaxed">{activity.openingHours}</p>
            </div>
          )}

          {/* Contact Links */}
          <div className="flex flex-wrap gap-3">
            {activity.websiteUrl && (
              <a
                href={activity.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <Globe className="h-3 w-3" />
                Website
              </a>
            )}
            {activity.phoneNumber && (
              <a
                href={`tel:${activity.phoneNumber}`}
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <Phone className="h-3 w-3" />
                Call
              </a>
            )}
          </div>

          {/* Directions */}
          {activity.directions && (
            <div className="bg-gray-50 p-2.5 rounded text-xs space-y-1">
              <div className="flex items-center gap-1 font-semibold text-gray-900">
                <Navigation className="h-3 w-3" />
                How to Reach
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {activity.directions.travelMode}
                </Badge>
                <span className="text-muted-foreground">
                  {activity.directions.duration} • {activity.directions.distance}
                </span>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default function ItineraryPage() {
  const router = useRouter();
  const itinerary = useItinerary();
  const { source, destination } = useTripMetadata();

  // Redirect to home if no itinerary
  useEffect(() => {
    if (!itinerary || itinerary.length === 0) {
      router.push("/");
    }
  }, [itinerary, router]);

  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline text-gray-800 mb-2">
            Your Detailed Itinerary
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {source} to {destination} - Day by Day Plan
          </p>
        </div>

        {/* Mobile View - Accordion (visible on screens smaller than lg) */}
        <div className="lg:hidden mb-8">
          <Card className="shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-primary text-lg">
                <ClipboardList className="h-5 w-5" />
                Day-by-Day Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MobileItineraryView itinerary={itinerary} />
            </CardContent>
          </Card>
        </div>

        {/* Desktop View - Table (visible on lg screens and above) */}
        <div className="hidden lg:block">
          <Card className="shadow-lg bg-white mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-primary">
                <ClipboardList className="h-5 w-5" />
                Day-by-Day Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="itinerary-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Day</TableHead>
                      <TableHead className="font-bold">Morning (5 AM - 12 PM)</TableHead>
                      <TableHead className="font-bold">Afternoon (12 PM - 5 PM)</TableHead>
                      <TableHead className="font-bold">Evening/Night (5 PM onwards)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itinerary.map((dayPlan) => {
                      const { morning, afternoon, evening } = categorizeActivitiesByTime(
                        dayPlan.activities
                      );
                      
                      return (
                        <TableRow key={dayPlan.day}>
                          <TableCell className="font-bold align-top bg-primary/5">
                            <div className="sticky top-0">
                              <p className="text-lg">Day {dayPlan.day}</p>
                              <p className="text-xs text-muted-foreground font-normal mt-1">
                                {dayPlan.title}
                              </p>
                            </div>
                          </TableCell>
                          <ActivityCell activities={morning} />
                          <ActivityCell activities={afternoon} />
                          <ActivityCell activities={evening} />
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-12 mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/suggestions")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suggestions
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/")}
            className="w-full sm:w-auto"
          >
            Start New Trip
          </Button>
        </div>
      </main>
    </div>
  );
}
