// This file is machine-generated - edit with caution!
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

const OptimizeTravelDatesInputSchema = z.object({
  source: z.string().describe('The starting location for the trip.'),
  destination: z.string().describe('The desired travel destination.'),
  startDate: z.string().describe('The desired start date for the trip (YYYY-MM-DD).'),
  endDate: z.string().describe('The desired end date for the trip (YYYY-MM-DD).'),
  travelerDetails: z.string().describe('Details about the travelers, including their preferences and constraints.'),
  currency: z.enum(['USD', 'EUR', 'INR']).describe('The currency for the expense estimation.'),
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
  optimalDates: z.string().describe('Suggested optimal travel dates (YYYY-MM-DD).'),
  alternativeDestinations: z.string().describe('Suggested alternative travel destinations.'),
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
  prompt: `You are a travel expert specializing in optimizing travel dates and destinations.

  Given the user's starting point, desired destination, dates, traveler details, and preferred currency, provide a comprehensive travel plan.

  Your response MUST be in a valid JSON format that adheres to the provided schema.

  - If the initial choices are not optimal, suggest alternative dates or destinations and explain your reasoning.
  - Provide a list of recommended places to visit.
  - Find the cheapest flight option from the source to the destination and provide its details.
  - If available, provide details for direct trains from the source to the destination.
  - Recommend 2-3 accommodations based on a balance of high ratings and a nominal price.
  - List famous local food spots with their details.
  - Suggest activities and attractions, including their estimated prices.
  - Detail the available local transportation options.
  - Create a detailed day-by-day itinerary for the trip. Each day should have a title and a list of activities with times and descriptions, tailored to the traveler's preferences.
  - Calculate an overall estimated total cost per person for the trip.
  - ALL monetary values MUST be in the user's specified currency: {{{currency}}}.

  User Input:
  - Source: {{{source}}}
  - Destination: {{{destination}}}
  - Start Date: {{{startDate}}}
  - End Date: {{{endDate}}}
  - Traveler Details: {{{travelerDetails}}}
  - Preferred Currency: {{{currency}}}

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
    const {output} = await prompt(input);
    return output!;
  }
);
