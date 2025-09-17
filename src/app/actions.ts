"use server";

import { optimizeTravelDates, type OptimizeTravelDatesInput, type OptimizeTravelDatesOutput } from "@/ai/flows/optimize-travel-dates";
import { z } from "zod";

const inputSchema = z.object({
  source: z.string(),
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  travelerDetails: z.string(),
  currency: z.enum(['USD', 'EUR', 'INR']),
});

export async function optimizeTravel(input: any): Promise<{ data: OptimizeTravelDatesOutput | null, error: string | null }> {
  try {
    const travelerDetails = JSON.parse(input.travelerDetails);

    const flatInput = {
      ...input,
      ...travelerDetails,
      ...travelerDetails.level2,
      ...travelerDetails.level3,
    };
    
    delete flatInput.travelerDetails;
    delete flatInput.level2;
    delete flatInput.level3;

    const result = await optimizeTravelDates(flatInput);
    return { data: result, error: null };
  } catch (e) {
    console.error("Error in optimizeTravel action:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred while optimizing your trip.";
    return { data: null, error: errorMessage };
  }
}
