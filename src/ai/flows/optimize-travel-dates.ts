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

const OptimizeTravelDatesOutputSchema = z.object({
  optimalDates: z.string().describe('Suggested optimal travel dates (YYYY-MM-DD).'),
  alternativeDestinations: z.string().describe('Suggested alternative travel destinations.'),
  reasoning: z.string().describe('Reasoning for the date and/or destination changes.'),
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
