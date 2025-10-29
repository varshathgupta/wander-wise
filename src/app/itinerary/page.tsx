"use client";

import { useEffect } from "react";
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
  ClipboardList,
  MapPin,
  Clock,
  Star,
  ExternalLink,
  Phone,
  Globe,
  Navigation,
  ArrowLeft,
  Plane,
  DollarSign,
} from "lucide-react";
import type { EnrichedActivity } from "@/lib/enrich-itinerary";

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
      <div className="space-y-4 py-2">
        {activities.map((activity, idx) => (
          <div key={idx} className="space-y-2 pb-4 border-b last:border-b-0">
            {/* Time and Activity Name */}
            <div>
              {activity.time && (
                <p className="text-xs text-primary font-semibold flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </p>
              )}
              <h4 className="font-bold text-sm mt-1">{activity.activity}</h4>
              <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
            </div>

            {/* Location */}
            {activity.address && (
              <div className="flex items-start gap-1 text-xs">
                <MapPin className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground">{activity.address}</p>
                  {activity.mapUrl && (
                    <a
                      href={activity.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      Map <ExternalLink className="h-2 w-2" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Rating */}
            {activity.rating && (
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{activity.rating.toFixed(1)}</span>
              </div>
            )}

            {/* Entry Fee */}
            {activity.entryFee && (
              <div className="flex items-center gap-1 text-xs">
                <DollarSign className="h-3 w-3 text-green-600" />
                <Badge variant="secondary" className="text-xs">{activity.entryFee}</Badge>
              </div>
            )}

            {/* Opening Hours */}
            {activity.openingHours && (
              <div className="text-xs text-muted-foreground">
                <Clock className="h-3 w-3 inline mr-1" />
                {activity.openingHours}
              </div>
            )}

            {/* Contact Links */}
            <div className="flex flex-wrap gap-2">
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
              <div className="bg-blue-50 p-2 rounded text-xs space-y-1">
                <div className="flex items-center gap-1 font-semibold text-blue-900">
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
          </div>
        ))}
      </div>
    </TableCell>
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-headline text-gray-800 mb-2">
            Your Detailed Itinerary
          </h1>
          <p className="text-muted-foreground">
            {source} to {destination} - Day by Day Plan
          </p>
        </div>

        {/* Itinerary Table */}
        <Card className="shadow-lg bg-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-primary">
              <ClipboardList className="h-5 w-5" />
              Day-by-Day Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24 font-bold">Day</TableHead>
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
