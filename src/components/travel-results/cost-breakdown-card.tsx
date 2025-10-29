"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useCostBreakdown } from "@/store/travel-hooks";
import { useCurrencyInfo } from "@/store/travel-store";
import { Progress } from "@/components/ui/progress";

/**
 * Example component demonstrating advanced store usage
 * Shows cost breakdown with visual representation
 */
export function CostBreakdownCard() {
  const costBreakdown = useCostBreakdown();
  const { symbol } = useCurrencyInfo();

  if (!costBreakdown) {
    return null;
  }

  const { flight, accommodation, activities, other, total } = costBreakdown;

  const getPercentage = (amount: number) => (amount / total) * 100;

  return (
    <Card className="shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <DollarSign />
          Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Flight</span>
              <span className="text-sm font-bold">
                {symbol}
                {flight.toLocaleString()}
              </span>
            </div>
            <Progress value={getPercentage(flight)} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Accommodation</span>
              <span className="text-sm font-bold">
                {symbol}
                {accommodation.toLocaleString()}
              </span>
            </div>
            <Progress value={getPercentage(accommodation)} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Activities</span>
              <span className="text-sm font-bold">
                {symbol}
                {activities.toLocaleString()}
              </span>
            </div>
            <Progress value={getPercentage(activities)} className="h-2" />
          </div>

          {other > 0 && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Other (Food, Transport)</span>
                <span className="text-sm font-bold">
                  {symbol}
                  {other.toLocaleString()}
                </span>
              </div>
              <Progress value={getPercentage(other)} className="h-2" />
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-primary">
              {symbol}
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
