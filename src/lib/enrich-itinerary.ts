import { placesClient, googleMapsClient } from "./google-maps";
import { TravelMode } from "@googlemaps/google-maps-services-js";

export interface NearbyDining {
  name: string;
  type: string;
  rating: number;
  priceLevel?: string;
  address: string;
  mapUrl: string;
  distance?: string;
}

export interface DirectionsInfo {
  origin: string;
  destination: string;
  travelMode: string;
  duration: string;
  distance: string;
  steps?: string[];
}

export interface EnrichedActivity {
  time: string;
  activity: string;
  description: string;
  placeId?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  mapUrl?: string;
  entryFee?: string;
  openingHours?: string;
  rating?: number;
  directions?: DirectionsInfo;
  nearbyDining?: NearbyDining[];
  websiteUrl?: string;
  phoneNumber?: string;
}

/**
 * Search for a place using Google Places Text Search
 */
async function findPlaceDetails(placeName: string, destinationCity: string) {
  try {
    const searchQuery = `${placeName}, ${destinationCity}`;
    
    const [response] = await placesClient.searchText({
      textQuery: searchQuery,
    }, {
      otherArgs: {
        headers: {
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.googleMapsUri,places.websiteUri,places.nationalPhoneNumber,places.regularOpeningHours,places.priceLevel",
        },
      },
    });

    if (response.places && response.places.length > 0) {
      const place = response.places[0];
      return {
        placeId: place.id || undefined,
        address: place.formattedAddress || undefined,
        coordinates: place.location ? {
          lat: place.location.latitude || 0,
          lng: place.location.longitude || 0,
        } : undefined,
        mapUrl: place.googleMapsUri || undefined,
        rating: place.rating || undefined,
        websiteUrl: place.websiteUri || undefined,
        phoneNumber: place.nationalPhoneNumber || undefined,
        openingHours: place.regularOpeningHours?.weekdayDescriptions?.join(', ') || undefined,
        priceLevel: place.priceLevel || undefined,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error finding place details for ${placeName}:`, error);
    return null;
  }
}

/**
 * Get directions between two places
 */
async function getDirections(
  origin: string,
  destination: string,
  mode: TravelMode = TravelMode.driving
): Promise<DirectionsInfo | null> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not defined');
    }

    const directionsResult = await googleMapsClient.directions({
      params: {
        origin,
        destination,
        mode,
        key: process.env.GOOGLE_API_KEY,
      },
    });

    if (directionsResult.data.status === 'OK' && directionsResult.data.routes.length > 0) {
      const route = directionsResult.data.routes[0];
      const leg = route.legs[0];
      
      return {
        origin: leg.start_address,
        destination: leg.end_address,
        travelMode: mode,
        duration: leg.duration?.text || 'N/A',
        distance: leg.distance?.text || 'N/A',
        steps: leg.steps?.slice(0, 5).map(step => step.html_instructions || ''),
      };
    }
    return null;
  } catch (error) {
    console.error(`Error getting directions from ${origin} to ${destination}:`, error);
    return null;
  }
}

/**
 * Get nearby restaurants and cafes
 */
async function getNearbyDining(
  lat: number,
  lng: number,
  limit: number = 3
): Promise<NearbyDining[]> {
  try {
    const [response] = await placesClient.searchNearby({
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 1000, // 1 km radius
        },
      },
      includedTypes: ["restaurant", "cafe"],
      maxResultCount: limit,
    }, {
      otherArgs: {
        headers: {
          "X-Goog-FieldMask": "places.displayName,places.types,places.rating,places.priceLevel,places.formattedAddress,places.googleMapsUri,places.location",
        },
      },
    });

    if (!response.places || response.places.length === 0) return [];

    // Sort by rating
    const sorted = response.places
      .filter((p: any) => p.rating)
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));

    return sorted.slice(0, limit).map((place: any) => {
      // Calculate distance if we have coordinates
      let distance: string | undefined;
      if (place.location?.latitude && place.location?.longitude) {
        const R = 6371; // Earth's radius in km
        const dLat = (place.location.latitude - lat) * Math.PI / 180;
        const dLon = (place.location.longitude - lng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat * Math.PI / 180) * Math.cos(place.location.latitude * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;
        distance = d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
      }

      return {
        name: place.displayName?.text || "Unknown",
        type: place.types?.[0] || "restaurant",
        rating: place.rating || 0,
        priceLevel: place.priceLevel || undefined,
        address: place.formattedAddress || "N/A",
        mapUrl: place.googleMapsUri || "",
        distance,
      };
    });
  } catch (error) {
    console.error("Error fetching nearby dining:", error);
    return [];
  }
}

/**
 * Enrich a single activity with Google Maps data
 */
export async function enrichActivity(
  activity: { time: string; activity: string; description: string },
  destinationCity: string,
  previousLocation?: string
): Promise<EnrichedActivity> {
  const enriched: EnrichedActivity = { ...activity };

  // Skip enrichment for generic activities like "Hotel Check-in", "Dinner", "Relaxation", "Departure"
  const skipKeywords = ['check-in', 'check out', 'checkout', 'dinner at', 'lunch at', 'relaxation', 'departure', 'arrival at', 'breakfast'];
  const shouldSkip = skipKeywords.some(keyword => 
    activity.activity.toLowerCase().includes(keyword) && 
    !activity.activity.toLowerCase().includes('visit') &&
    !activity.activity.toLowerCase().includes('explore')
  );

  if (shouldSkip) {
    return enriched;
  }

  try {
    // Get place details
    const placeDetails = await findPlaceDetails(activity.activity, destinationCity);
    
    if (placeDetails) {
      enriched.placeId = placeDetails.placeId;
      enriched.address = placeDetails.address;
      enriched.coordinates = placeDetails.coordinates;
      enriched.mapUrl = placeDetails.mapUrl;
      enriched.rating = placeDetails.rating;
      enriched.websiteUrl = placeDetails.websiteUrl;
      enriched.phoneNumber = placeDetails.phoneNumber;
      enriched.openingHours = placeDetails.openingHours;

      // Try to determine entry fee from price level
      if (placeDetails.priceLevel) {
        const priceMap: Record<string, string> = {
          'PRICE_LEVEL_FREE': 'Free',
          'PRICE_LEVEL_INEXPENSIVE': '₹0-500',
          'PRICE_LEVEL_MODERATE': '₹500-1500',
          'PRICE_LEVEL_EXPENSIVE': '₹1500-3000',
          'PRICE_LEVEL_VERY_EXPENSIVE': '₹3000+',
        };
        enriched.entryFee = priceMap[placeDetails.priceLevel] || 'Contact venue for pricing';
      }

      // Get directions from previous location if available
      if (previousLocation && placeDetails.address) {
        const directions = await getDirections(
          previousLocation,
          placeDetails.address,
          TravelMode.driving
        );
        if (directions) {
          enriched.directions = directions;
        }
      }

      // Get nearby dining options
      if (placeDetails.coordinates) {
        const nearbyDining = await getNearbyDining(
          placeDetails.coordinates.lat,
          placeDetails.coordinates.lng,
          3
        );
        if (nearbyDining.length > 0) {
          enriched.nearbyDining = nearbyDining;
        }
      }
    }
  } catch (error) {
    console.error(`Error enriching activity "${activity.activity}":`, error);
  }

  return enriched;
}

/**
 * Enrich entire itinerary with Google Maps data
 */
export async function enrichItinerary(
  itinerary: Array<{
    day: number;
    title: string;
    activities: Array<{ time: string; activity: string; description: string }>;
  }>,
  destinationCity: string
): Promise<Array<{
  day: number;
  title: string;
  activities: EnrichedActivity[];
}>> {
  const enrichedItinerary = [];

  for (const day of itinerary) {
    const enrichedActivities: EnrichedActivity[] = [];
    let previousLocation: string | undefined;

    for (const activity of day.activities) {
      const enriched = await enrichActivity(activity, destinationCity, previousLocation);
      enrichedActivities.push(enriched);
      
      // Update previous location for next activity
      if (enriched.address) {
        previousLocation = enriched.address;
      }
    }

    enrichedItinerary.push({
      ...day,
      activities: enrichedActivities,
    });
  }

  return enrichedItinerary;
}
