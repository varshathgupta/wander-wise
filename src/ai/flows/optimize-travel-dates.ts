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
  destination: z.string().describe('The desired travel destination.'),
  startDate: z.string().describe('The desired start date for the trip (YYYY-MM-DD).'),
  endDate: z.string().describe('The desired end date for the trip (YYYY-MM-DD).'),
  travelerDetails: z.string().describe('Details about the travelers, including their preferences and constraints.'),
});
export type OptimizeTravelDatesInput = z.infer<typeof OptimizeTravelDatesInputSchema>;

const ExpenseBreakdownSchema = z.object({
  flights: z.number().describe('Estimated cost of round-trip flights per person in USD.'),
  accommodation: z.number().describe('Estimated cost of accommodation per person for the trip duration in USD.'),
  food: z.number().describe('Estimated daily food cost per person in USD.'),
  activities: z.number().describe('Estimated cost for activities and sightseeing per person in USD.'),
  transportation: z.number().describe('Estimated local transportation cost per person in USD.'),
});

const OptimizeTravelDatesOutputSchema = z.object({
  optimalDates: z.string().describe('Suggested optimal travel dates (YYYY-MM-DD).'),
  alternativeDestinations: z.string().describe('Suggested alternative travel destinations.'),
  reasoning: z.string().describe('Reasoning for the date and/or destination changes.'),
  placesToVisit: z.array(z.string()).describe('A list of 3-5 recommended places to visit at the destination.'),
  estimatedExpense: z.object({
    totalPerPerson: z.number().describe('The overall estimated expense per person for the trip in USD.'),
    breakdown: ExpenseBreakdownSchema.describe('A detailed breakdown of the estimated expenses per person in USD.'),
  }).describe('Estimated expenses for the trip in USD.'),
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

  Given the user's desired destination, dates, and traveler details, suggest alternative dates or destinations if the initial choices are not optimal. Explain your reasoning for any changes.

  Also provide a list of recommended places to visit and a detailed breakdown of the estimated expenses per person in USD. The expense breakdown should include flights, accommodation, food (as a daily estimate), activities, and local transportation. Calculate a total estimated cost per person.

  Destination: {{{destination}}}
  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}
  Traveler Details: {{{travelerDetails}}}

  Consider factors such as weather, crowds, events, and pricing to determine the optimal travel plan.

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
