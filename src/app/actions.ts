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

export async function optimizeTravel(input: OptimizeTravelDatesInput): Promise<{ data: OptimizeTravelDatesOutput | null, error: string | null }> {
  const parsedInput = inputSchema.safeParse(input);

  if (!parsedInput.success) {
    console.error("Invalid input:", parsedInput.error.flatten());
    return { data: null, error: "Invalid input." };
  }
  
  try {
    const result = await optimizeTravelDates(parsedInput.data);
    return { data: result, error: null };
  } catch (e) {
    console.error("Error in optimizeTravel action:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred while optimizing your trip.";
    return { data: null, error: errorMessage };
  }
}
