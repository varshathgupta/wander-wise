import { placesClient } from "./google-maps";

interface Accommodation {
  name: string;
  type: string;
  rating: number;
  pricePerNight: number;   // placeholder
  bookingLink: string; 
  images?: any[];   // placeholder
}

export async function getTopAccommodations(
  lat: number,
  lng: number,
  limit: number = 7
): Promise<Accommodation[]> {
  // 1. Search nearby
  const [accommodationsResponse] = await placesClient.searchNearby({
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: 5000, 
      },
    },
    includedTypes: [
      // "lodging",
      "hotel",
      "resort_hotel",
      "hostel",
      "guest_house",
      "bed_and_breakfast",
      "motel",
      
    ],
  }, {
    otherArgs: {
      headers: {
        "X-Goog-FieldMask": "places.displayName,places.types,places.rating,places.userRatingCount,places.googleMapsUri,places.priceLevel,places.websiteUri,places.photos",
      },
    },
  });

  if (!accommodationsResponse.places || accommodationsResponse.places.length === 0) return [];

  // 2. Sort by rating, weighted by number of reviews
  const sorted = accommodationsResponse.places
    .filter((p: any) => p.rating) // ignore places with no rating
    .sort((a: any, b: any) => {
      const aScore = (a.rating ?? 0) * (a.userRatingCount ?? 1);
      const bScore = (b.rating ?? 0) * (b.userRatingCount ?? 1);
      return bScore - aScore;
    });

  // 3. Take top N and map to clean object
  return sorted.slice(0, limit).map((place: any) => ({
    name: place.displayName?.text || "Unknown",
    type: place.types?.[0] || "Hotel",
    rating: place.rating || 0,
    pricePerNight: place.price  || 0, 
    bookingLink: place.websiteUri || "",
    images: place.photos || [],
  }));
}
