'use server';
/**
 * @fileOverview A travel date/destination optimizer AI agent.
 *
 * - optimizeTravelDates - A function that handles the travel date/destination optimization process.
 * - OptimizeTravelDatesInput - The input type for the optimizeTravelDates function.
 * - OptimizeTravelDatesOutput - The return type for the optimizeTravelDates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleMapsClient } from '@/lib/google-maps';
import { Place, PlaceType2, TravelMode, TransitMode } from '@googlemaps/google-maps-services-js';

const OptimizeTravelDatesInputSchema = z.object({
  source: z.string().describe('The starting location for the trip.'),
  destination: z.string().describe('The desired travel destination.'),
  startDate: z.string().describe('The desired start date for the trip (YYYY-MM-DD).'),
  endDate: z.string().describe('The desired end date for the trip (YYYY-MM-DD).'),
  tripType: z.enum(['adventure', 'honeymoon', 'leisure', 'luxury', 'pilgrim', 'others']).describe('The type of trip.'),
  budgetRange: z.array(z.number()).length(2).describe('The budget range for the trip.'),
  currency: z.enum(['USD', 'EUR', 'INR']).describe('The currency for the expense estimation.'),
  
  // Level 2: Trip Character
  easyBooking: z.boolean().optional().describe('Preference for easy booking options.'),
  standardPlans: z.boolean().optional().describe('Preference for standard, pre-made plans.'),
  travelOptions: z.array(z.string()).optional().describe('Preferred travel options (e.g., flight, train).'),
  stayOptions: z.array(z.string()).optional().describe('Preferred accommodation types (e.g., hotel, hostel).'),
  
  // Honeymoon specific
  honeymoonType: z.enum(['private', 'social', 'mix']).optional().describe('The style of honeymoon.'),
  honeymoonAddOns: z.array(z.string()).optional().describe('Requested add-ons for the honeymoon.'),
  
  // Adventure specific
  adventureLevel: z.enum(['mild', 'moderate', 'high']).optional().describe('The desired intensity of adventure activities.'),
  adventureMembers: z.enum(['solo', 'sole-searching', 'group']).optional().describe('The group composition for the adventure trip.'),
  
  // Leisure specific
  leisurePreference: z.array(z.string()).optional().describe('Preferences for leisure activities.'),
  activityLevel: z.enum(['complete-rest', 'light-activities', 'balanced', 'active-relaxation']).optional().describe('The desired activity level for a leisure trip.'),
  
  // Level 3: Trip Experience
  isPersonalised: z.boolean().optional().describe('Whether the user wants a personalized plan.'),
  culturalImmersion: z.enum(['tourist-sites', 'authentic-local', 'homestays', 'temporary-local', 'not-keen']).optional().describe('The desired level of cultural immersion.'),
  culturalActivities: z.array(z.string()).optional().describe('Specific cultural activities of interest.'),
  languageBarriers: z.enum(['comfortable', 'need-help', 'learn-basics', 'not-concern']).optional().describe('Comfort level with language barriers.'),
  foodDining: z.enum(['pure-veg', 'non-veg', 'mix']).optional().describe('Dietary preferences.'),
  foodPreference: z.enum(['familiar', 'local-safe', 'street-authentic']).optional().describe('Preference for food types.'),
  nightlifeInterest: z.enum(['early-quiet', 'local-bars', 'vibrant-clubs', 'cultural-evening']).optional().describe('Interest in nightlife.'),
});
export type OptimizeTravelDatesInput = z.infer<typeof OptimizeTravelDatesInputSchema>;

const FlightDetailsSchema = z.object({
    airline: z.string().describe('The airline for the cheapest flight option.'),
    price: z.number().describe('The estimated price of the round-trip flight per person.'),
    details: z.string().describe('Additional details about the flight, like layovers or duration.'),
});

const TrainDetailsSchema = z.object({
    trainName: z.string().describe('The name or number of the train.'),
    departureStation: z.string().describe('The departure station.'),
    arrivalStation: z.string().describe('The arrival station.'),
    price: z.number().describe('The estimated price of the train ticket per person.'),
    details: z.string().describe('Additional details about the train journey, like duration or class.'),
});

const AccommodationDetailsSchema = z.object({
    name: z.string().describe('The name of the accommodation.'),
    type: z.string().describe('Type of accommodation (e.g., Hotel, Hostel, Airbnb).'),
    rating: z.number().describe('The rating of the accommodation (e.g., 4.5).'),
    pricePerNight: z.number().describe('The estimated price per night.'),
    bookingLink: z.string().describe('A link to book the accommodation.'),
});

const FoodSpotSchema = z.object({
    name: z.string().describe('The name of the food spot.'),
    cuisine: z.string().describe('The type of cuisine served.'),
    estimatedCost: z.string().describe('Estimated cost per person (e.g., $, $$, $$$).'),
    location: z.string().describe('The location or address of the food spot.'),
});

const ActivityDetailsSchema = z.object({
    name: z.string().describe('The name of the activity or attraction.'),
    description: z.string().describe('A brief description of the activity.'),
    price: z.number().describe('The estimated price for the activity per person. Use 0 for free activities.'),
});

const TransportationDetailsSchema = z.object({
    type: z.string().describe('The type of local transportation (e.g., Metro, Bus, Ride-sharing).'),
    estimatedCost: z.string().describe('Estimated cost for using this transportation (e.g., cost per ride, or daily pass cost).'),
    details: z.string().describe('Additional details or tips about using this transportation.'),
});

const ItineraryItemSchema = z.object({
    time: z.string().describe("Time of day for the activity (e.g., Morning, 9:00 AM, Afternoon, Evening)."),
    activity: z.string().describe("The name of the activity or place to visit."),
    description: z.string().describe("A brief description of the activity and why it's recommended."),
});

const DailyItinerarySchema = z.object({
    day: z.number().describe("The day number of the trip (e.g., 1, 2, 3)."),
    title: z.string().describe("A catchy title for the day's plan (e.g., 'Historical Heart of the City')."),
    activities: z.array(ItineraryItemSchema).describe("A list of activities planned for the day."),
});


const OptimizeTravelDatesOutputSchema = z.object({
  optimalDates: z.string().describe('Suggested optimal travel dates (YYYY-MM-DD) only if applicable.'),
  alternativeDestinations: z.string().describe('Suggested alternative travel destinations only if applicable.'),
  reasoning: z.string().describe('Reasoning for the date and/or destination changes.'),
  placesToVisit: z.array(z.string()).describe('A list of 3-5 recommended places to visit at the destination.'),
  totalEstimatedCostPerPerson: z.number().describe('The overall estimated total expense per person for the entire trip.'),
  currency: z.enum(['USD', 'EUR', 'INR']).describe('The currency used for all cost estimations.'),
  cheapestFlight: FlightDetailsSchema.describe('Details for the cheapest flight option found.'),
  directTrains: z.array(TrainDetailsSchema).optional().describe('Details for direct train options, if available.'),
  recommendedAccommodations: z.array(AccommodationDetailsSchema).describe('A list of 2-3 recommended accommodations based on high ratings and nominal price.'),
  famousFoodSpots: z.array(FoodSpotSchema).describe('A list of famous local food spots.'),
  recommendedActivities: z.array(ActivityDetailsSchema).describe('A list of recommended activities with their prices.'),
  localTransportation: z.array(TransportationDetailsSchema).describe('Details about local transportation options.'),
  itinerary: z.array(DailyItinerarySchema).describe("A detailed day-by-day itinerary for the trip based on the traveler's preferences."),
});
export type OptimizeTravelDatesOutput = z.infer<typeof OptimizeTravelDatesOutputSchema>;

export async function optimizeTravelDates(input: OptimizeTravelDatesInput): Promise<OptimizeTravelDatesOutput> {
  return optimizeTravelDatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeTravelDatesPrompt',
  input: {schema: OptimizeTravelDatesInputSchema},
  output: {schema: OptimizeTravelDatesOutputSchema},
  prompt: `You are a local travel expert specializing in optimizing travel dates and destinations.

  Given the user's preferences, provide a comprehensive travel plan. Your response MUST be in a valid JSON format that adheres to the provided schema.

  - If the initial choices are not optimal, suggest alternative dates or destinations and explain your reasoning.
  - Provide a list of recommended places to visit.
  - Find the cheapest flight option from the source to the destination and provide its details.
  - Create a detailed day-by-day itinerary for the trip. Each day should have a title and a list of activities with times and descriptions, tailored to the traveler's preferences for trip type, activity level, cultural immersion, and nightlife.
  - Calculate an overall estimated total cost per person for the trip, staying within the provided budget range.
  - ALL monetary values MUST be in the user's specified currency: {{{currency}}}.

  User Input:
  - Source: {{{source}}}
  - Destination: {{{destination}}}
  - Start Date: {{{startDate}}}
  - End Date: {{{endDate}}}
  - Trip Type: {{{tripType}}}
  - Budget Range: {{{budgetRange}}}
  - Preferred Currency: {{{currency}}}
  - Easy Booking Preference: {{{easyBooking}}}
  - Standard Plan Preference: {{{standardPlans}}}
  - Travel Options: {{{travelOptions}}}
  - Stay Options: {{{stayOptions}}}
  - Honeymoon Type: {{{honeymoonType}}}
  - Honeymoon Add-ons: {{{honeymoonAddOns}}}
  - Adventure Level: {{{adventureLevel}}}
  - Adventure Members: {{{adventureMembers}}}
  - Leisure Preference: {{{leisurePreference}}}
  - Activity Level: {{{activityLevel}}}
  - Personalization Preference: {{{isPersonalised}}}
  - Cultural Immersion: {{{culturalImmersion}}}
  - Cultural Activities: {{{culturalActivities}}}
  - Language Barrier Comfort: {{{languageBarriers}}}
  - Food & Dining: {{{foodDining}}}
  - Food Preference: {{{foodPreference}}}
  - Nightlife Interest: {{{nightlifeInterest}}}

  Output in JSON format.
  `,
});

const optimizeTravelDatesFlow = ai.defineFlow(
  {
    name: 'optimizeTravelDatesFlow',
    inputSchema: OptimizeTravelDatesInputSchema,
    outputSchema: OptimizeTravelDatesOutputSchema,
  },
  async input => {
    // Validate API key
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not defined in environment variables');
    }

    const { output } = await prompt(input);
    
    try {
      const geocodeResult = await googleMapsClient.geocode({
        params: {
          address: input.destination,
          key: process.env.GOOGLE_API_KEY,
        }
      });

      if (geocodeResult.data.status !== 'OK' || geocodeResult.data.results.length === 0) {
        throw new Error(`Could not geocode destination: ${input.destination}. Status: ${geocodeResult.data.status}`);
      }

      const location = geocodeResult.data.results[0].geometry.location;

      const accommodations = await googleMapsClient.placesNearby({
        params: {
          location: location,
          radius: 5000,
          type: "lodging",
          key: process.env.GOOGLE_API_KEY,
        },
      });

      const foodSpots = await googleMapsClient.placesNearby({
          params: {
              location: location,
              radius: 5000,
              type: "restaurant",
              key: process.env.GOOGLE_API_KEY,
          },
      });

      const localTransport = await googleMapsClient.placesNearby({
          params: {
              location: location,
              radius: 5000,
              type: "transit_station",
              key: process.env.GOOGLE_API_KEY,
          },
      });

      const trainDirections = await googleMapsClient.directions({
          params: {
              origin: input.source,
              destination: input.destination,
              mode: TravelMode.transit,
              transit_mode: [TransitMode.train],
              key: process.env.GOOGLE_API_KEY,
          },
      });

      const recommendedAccommodations = accommodations.data.results.slice(0, 3).map((place: Place) => ({
          name: place.name || 'Unknown',
          type: place.types?.[0] || 'lodging',
          rating: place.rating || 0,
          pricePerNight: 0, // Placeholder, as price is not directly available
          bookingLink: '', // Placeholder
      }));

      const famousFoodSpots = foodSpots.data.results.slice(0, 5).map((place: Place) => ({
          name: place.name || 'Unknown',
          cuisine: place.types?.[0] || 'restaurant',
          estimatedCost: place?.price_level ? place.price_level.toString() : '',
          location: place.vicinity || 'Unknown location',
      }));

      const localTransportation = localTransport.data.results.slice(0, 5).map((place: Place) => ({
          type: place.name || 'Unknown',
          estimatedCost: place.price_level ? place.price_level.toString() : '',
          details: place.formatted_address || ''  ,
      }));

      const directTrains = trainDirections.data.routes.map(route => (
        {
          trainName: route.legs[0].steps[0].transit_details?.line.name || 'N/A',
          departureStation: route.legs[0].start_address,
          arrivalStation: route.legs[0].end_address,
          price: 0, // Placeholder
          details: route.summary,
      }));

      return {
          ...output!,
          recommendedAccommodations,
          famousFoodSpots,
          localTransportation,
          directTrains,
      };
    } catch (error: any) {
      console.error('Google Maps API Error:', error.response?.data || error.message);
      throw new Error(`Google Maps API request failed: ${error.response?.data?.error_message || error.message}`);
    }
  }
);
