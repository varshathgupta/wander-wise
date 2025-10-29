import { Client } from "@googlemaps/google-maps-services-js";
import { PlacesClient } from "@googlemaps/places";

const googleMapsClient = new Client({});
const placesClient = new PlacesClient({
  apiKey: process.env.GOOGLE_API_KEY
});

export { googleMapsClient, placesClient };