"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, MapPin, Clock, DollarSign, Navigation, Utensils, ExternalLink, Phone, Star, Globe } from "lucide-react";
import { useItinerary } from "@/store/travel-store";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
                <div className="space-y-6 pt-2">
                  {dayPlan.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="border-l-2 border-primary pl-4 space-y-3">
                      {/* Time and Activity Name */}
                      <div>
                        <p className="font-semibold text-sm text-primary flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </p>
                        <p className="font-bold text-lg">{activity.activity}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>

                      {/* Location Details */}
                      {activity.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">{activity.address}</p>
                            {activity.mapUrl && (
                              <a 
                                href={activity.mapUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                              >
                                View on Google Maps <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Rating */}
                      {activity.rating && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{activity.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">Google Rating</span>
                        </div>
                      )}

                      {/* Entry Fee */}
                      {activity.entryFee && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <div>
                            <span className="font-medium">Entry Fee: </span>
                            <Badge variant="secondary">{activity.entryFee}</Badge>
                          </div>
                        </div>
                      )}

                      {/* Opening Hours */}
                      {activity.openingHours && (
                        <div className="flex items-start gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Opening Hours</p>
                            <p className="text-muted-foreground text-xs">{activity.openingHours}</p>
                          </div>
                        </div>
                      )}

                      {/* Contact Information */}
                      <div className="flex flex-wrap gap-3">
                        {activity.websiteUrl && (
                          <a 
                            href={activity.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <Globe className="h-3 w-3" />
                            Website
                          </a>
                        )}
                        {activity.phoneNumber && (
                          <a 
                            href={`tel:${activity.phoneNumber}`}
                            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <Phone className="h-3 w-3" />
                            {activity.phoneNumber}
                          </a>
                        )}
                      </div>

                      {/* Directions */}
                      {activity.directions && (
                        <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                            <Navigation className="h-4 w-4" />
                            How to Reach
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {activity.directions.travelMode}
                              </Badge>
                              <span className="text-muted-foreground">
                                {activity.directions.duration} • {activity.directions.distance}
                              </span>
                            </div>
                            {activity.directions.steps && activity.directions.steps.length > 0 && (
                              <details className="text-xs text-muted-foreground mt-2">
                                <summary className="cursor-pointer hover:text-foreground">View directions</summary>
                                <ol className="list-decimal list-inside space-y-1 mt-2 pl-2">
                                  {activity.directions.steps.map((step, idx) => (
                                    <li key={idx} dangerouslySetInnerHTML={{ __html: step }} />
                                  ))}
                                </ol>
                              </details>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Nearby Dining */}
                      {activity.nearbyDining && activity.nearbyDining.length > 0 && (
                        <div className="bg-orange-50 p-3 rounded-lg space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-orange-900">
                            <Utensils className="h-4 w-4" />
                            Nearby Restaurants & Cafes
                          </div>
                          <div className="space-y-2">
                            {activity.nearbyDining.map((dining, diningIdx) => (
                              <div key={diningIdx} className="text-sm border-l-2 border-orange-300 pl-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="font-medium">{dining.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                      {dining.type.replace(/_/g, ' ')}
                                      {dining.distance && ` • ${dining.distance} away`}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs">{dining.rating.toFixed(1)}</span>
                                      </div>
                                      {dining.priceLevel && (
                                        <Badge variant="outline" className="text-xs">
                                          {dining.priceLevel}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  {dining.mapUrl && (
                                    <a 
                                      href={dining.mapUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {actIndex < dayPlan.activities.length - 1 && (
                        <Separator className="mt-4" />
                      )}
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
