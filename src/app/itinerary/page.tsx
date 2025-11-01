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
  Download,
} from "lucide-react";
import type { EnrichedActivity } from "@/lib/enrich-itinerary";
import { Header } from "@/components/header";
import Link from "next/link";
import jsPDF from "jspdf";

// Helper function to format price level
function formatPriceLevel(entryFee: string | undefined): string | undefined {
  if (!entryFee) return undefined;
  
  // If it's already a formatted string, return it
  if (['Free', 'Affordable', 'Moderate', 'Expensive', 'Very Expensive', 'As per booking'].includes(entryFee)) {
    return entryFee;
  }
  
  // Handle numeric values (0-4) that might be stored as strings
  const numericPriceMap: Record<string, string> = {
    '0': 'Free',
    '1': 'Affordable',
    '2': 'Moderate',
    '3': 'Expensive',
    '4': 'Very Expensive',
  };
  
  return numericPriceMap[entryFee] || entryFee;
}

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
              {formatPriceLevel(activity.entryFee) && (
                <div className="flex items-center gap-1.5 text-sm bg-green-50 px-2.5 py-1.5 rounded-md">
                  <DollarSign className="h-3.5 w-3.5 text-green-600" />
                  <span className="font-medium text-green-900">{formatPriceLevel(activity.entryFee)}</span>
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
        {formatPriceLevel(activity.entryFee) && (
          <div className="flex items-center gap-1.5 text-sm bg-green-50 px-2.5 py-1.5 rounded-md">
            <DollarSign className="h-3.5 w-3.5 text-green-600" />
            <span className="font-medium text-green-900">{formatPriceLevel(activity.entryFee)}</span>
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

// Function to draw the Plane icon in the PDF
function drawPlaneIcon(doc: jsPDF, x: number, y: number, size: number) {
  // Simple plane icon representation using lines
  doc.setDrawColor(0, 164, 213); // EaseMyTrip Caribbean Blue #00A4D5
  doc.setLineWidth(0.5);
  
  // Draw plane body
  doc.line(x, y, x + size, y);
  doc.line(x + size * 0.3, y - size * 0.3, x + size * 0.7, y - size * 0.3);
  doc.line(x + size * 0.3, y - size * 0.3, x + size * 0.3, y);
  doc.line(x + size * 0.7, y - size * 0.3, x + size * 0.7, y);
  
  // Draw wings
  doc.line(x + size * 0.5, y, x + size * 0.5, y + size * 0.4);
  doc.line(x + size * 0.3, y + size * 0.2, x + size * 0.7, y + size * 0.2);
  
  // Draw tail
  doc.line(x, y, x + size * 0.2, y - size * 0.2);
}

// Function to generate and download PDF
function generatePDF(
  itinerary: Array<{ day: number; title: string; activities: EnrichedActivity[] }>,
  source: string,
  destination: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Add brand logo and title
  drawPlaneIcon(doc, margin, yPosition, 8);
  doc.setFontSize(20);
  doc.setTextColor(0, 91, 155); // EaseMyTrip Nice Blue #005B9B
  doc.setFont("helvetica", "bold");
  doc.text("WanderWise", margin + 12, yPosition + 5);
  
  // Add separator
  doc.setFontSize(14);
  doc.setTextColor(107, 114, 128); // Gray-500
  doc.setFont("helvetica", "normal");
  doc.text("×", margin + 60, yPosition + 5);
  
  // Add EaseMyTrip logo text
  doc.setFontSize(16);
  doc.setTextColor(0, 91, 155); // EaseMyTrip Nice Blue
  doc.setFont("helvetica", "bold");
  doc.text("EaseMyTrip", margin + 68, yPosition + 5);
  
  yPosition += 20;

  // Add itinerary title
  doc.setFontSize(24);
  doc.setTextColor(31, 41, 55); // Gray-800
  doc.text("Your Travel Itinerary", margin, yPosition);
  yPosition += 10;

  // Add trip details
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // Gray-500
  doc.setFont("helvetica", "normal");
  doc.text(`${source} to ${destination}`, margin, yPosition);
  yPosition += 15;

  // Add separator line
  doc.setDrawColor(229, 231, 235); // Gray-200
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Iterate through each day
  itinerary.forEach((dayPlan) => {
    const { morning, afternoon, evening } = categorizeActivitiesByTime(dayPlan.activities);
    
    checkPageBreak(30);
    
    // Day header
    doc.setFillColor(239, 246, 255); // Blue-50
    doc.rect(margin, yPosition - 7, pageWidth - 2 * margin, 12, "F");
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "bold");
    doc.text(`Day ${dayPlan.day}: ${dayPlan.title}`, margin + 5, yPosition);
    yPosition += 15;

    // Helper function to add activities section
    const addActivitiesSection = (title: string, activities: EnrichedActivity[]) => {
      if (activities.length === 0) return;
      
      checkPageBreak(20);
      
      // Section header with background
      doc.setFillColor(219, 234, 254); // Blue-100
      doc.rect(margin + 3, yPosition - 6, pageWidth - 2 * margin - 6, 10, "F");
      doc.setFontSize(11);
      doc.setTextColor(30, 64, 175); // Blue-800
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 5, yPosition);
      yPosition += 10;

      activities.forEach((activity) => {
        const estimatedHeight = 35 + (activity.tags?.length || 0) * 3;
        checkPageBreak(estimatedHeight);
        
        // Activity name with bullet point
        doc.setFontSize(11);
        doc.setTextColor(31, 41, 55);
        doc.setFont("helvetica", "bold");
        doc.circle(margin + 8, yPosition - 1, 1, "F"); // Bullet point
        const activityLines = doc.splitTextToSize(activity.activity, pageWidth - 2 * margin - 15);
        doc.text(activityLines, margin + 12, yPosition);
        yPosition += activityLines.length * 5;

        // Tags
        if (activity.tags && activity.tags.length > 0) {
          doc.setFontSize(8);
          doc.setTextColor(107, 114, 128);
          doc.setFont("helvetica", "italic");
          doc.text(`Tags: ${activity.tags.join(", ")}`, margin + 12, yPosition);
          yPosition += 5;
        }

        // Description
        doc.setFontSize(9);
        doc.setTextColor(75, 85, 99);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(activity.description, pageWidth - 2 * margin - 15);
        doc.text(descLines, margin + 12, yPosition);
        yPosition += descLines.length * 4;

        // Details
        if (activity.address) {
          doc.setFontSize(8);
          doc.setTextColor(107, 114, 128);
          const addressLines = doc.splitTextToSize(`Location: ${activity.address}`, pageWidth - 2 * margin - 15);
          doc.text(addressLines, margin + 12, yPosition);
          yPosition += addressLines.length * 4;
        }

        // Rating and Entry Fee
        let detailsText = "";
        if (activity.rating) {
          detailsText += `Rating: ${activity.rating.toFixed(1)}`;
        }
        const formattedPrice = formatPriceLevel(activity.entryFee);
        if (formattedPrice) {
          detailsText += detailsText ? ` | Price: ${formattedPrice}` : `Price: ${formattedPrice}`;
        }
        if (activity.time) {
          detailsText += detailsText ? ` | Time: ${activity.time}` : `Time: ${activity.time}`;
        }
        
        if (detailsText) {
          doc.setFontSize(8);
          doc.text(detailsText, margin + 12, yPosition);
          yPosition += 5;
        }

        yPosition += 5; // Space between activities
      });

      yPosition += 5;
    };

    // Add activities by time of day
    addActivitiesSection("MORNING (5 AM - 12 PM)", morning);
    addActivitiesSection("AFTERNOON (12 PM - 5 PM)", afternoon);
    addActivitiesSection("EVENING/NIGHT (5 PM onwards)", evening);

    yPosition += 10; // Space between days
  });

  // Add footer on last page
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Generated by WanderWise - Your AI Travel Companion",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Save the PDF
  const fileName = `WanderWise_Itinerary_${source}_to_${destination}.pdf`.replace(/\s+/g, "_");
  doc.save(fileName);
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
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              variant="default"
              size="lg"
              onClick={() => generatePDF(itinerary, source, destination)}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
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
        </div>
      </main>
    </div>
  );
}
