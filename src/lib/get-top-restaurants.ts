
import { placesClient } from "./google-maps";

interface Restaurant {
  name: string;
  type: string;
  rating: number;
  priceLevel: number;      // placeholder
  mapUrl: string;          // placeholder
}

export async function getTopRestaurants(

  lat: number,
  lng: number,
  limit: number = 7
): Promise<any[]> {
  // 1. Search nearby restaurants
  const [restaurantsResponse] = await placesClient.searchNearby({
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: 5000, // 5 km
      },
    },
    includedTypes: ["restaurant", "cafe", ],
  }, {
    otherArgs: {
      headers: {
        "X-Goog-FieldMask": "places.displayName,places.types,places.rating,places.userRatingCount,places.priceLevel,places.googleMapsUri",
      },
    },
  });

  if (!restaurantsResponse.places || restaurantsResponse.places.length === 0) return [];

  // 2. Sort by rating * review count
  const sorted = restaurantsResponse.places
    .filter((p: any) => p.rating)
    .sort((a: any, b: any) => {
      const aScore = (a.rating ?? 0) * (a.userRatingCount ?? 1);
      const bScore = (b.rating ?? 0) * (b.userRatingCount ?? 1);
      return bScore - aScore;
    });

  
  return sorted.slice(0, limit).map((place:any) => ({
    name: place.displayName?.text || "Unknown",
    type: place.types?.[0] || "restaurant",
    rating: place.rating || 0,
    priceLevel: place.price_level || 0,
    mapUrl: place.googleMapsUri || "",
  }));
}
