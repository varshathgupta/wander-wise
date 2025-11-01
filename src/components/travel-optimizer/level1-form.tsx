import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { getBudgetRanges, LevelFormProps } from "./form-schema";
import { useFormContext } from "react-hook-form";

export function Level1Form({ 
  control, 
  destination = '', 
  tripType = 'leisure' 
}: LevelFormProps) {
  const { setValue, getValues } = useFormContext();
  
  // Get dynamic budget ranges (INR only for India)
  const budgetRanges = getBudgetRanges(destination, tripType);

  // Handle trip type changes and adjust budget range accordingly
  useEffect(() => {
    const currentBudgetRange = getValues('budgetRange');
    if (currentBudgetRange && budgetRanges) {
      // Check if current budget range is outside the new range
      const [currentMin, currentMax] = currentBudgetRange;
      const [rangeMin, rangeMax] = budgetRanges;
      
      // If current values are outside the valid range, reset to the range
      if (currentMin < rangeMin || currentMax > rangeMax || currentMin > rangeMax || currentMax < rangeMin) {
        setValue('budgetRange', budgetRanges, { shouldValidate: true });
      }
    }
  }, [destination, tripType, budgetRanges, setValue, getValues]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Level 1</Badge>
          Trip Details
        </CardTitle>
        <CardDescription>
          Basic information about your trip
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From *</FormLabel>
                <FormControl>
                  <AutocompleteInput 
                    placeholder="e.g., Chennai" 
                    value={field.value as string} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To *</FormLabel>
                <FormControl>
                  <AutocompleteInput 
                    placeholder="e.g., Kashmir" 
                    value={field.value as string} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <FormField
            control={control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Travel Dates *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "LLL dd, y")} -{" "}
                              {format(field.value.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={(dateRange) => {
                        if (dateRange?.from && dateRange.to) {
                          // Only update when both from and to dates are selected
                          field.onChange(dateRange);
                        } else if (dateRange?.from) {
                          // For single date selection, preserve it but don't complete the range yet
                          field.onChange({ from: dateRange.from, to: undefined });
                        } else {
                          // Reset if cleared
                          field.onChange(undefined);
                        }
                      }}
                      numberOfMonths={1}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <FormField
            control={control}
            name="tripType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trip type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="honeymoon">Honeymoon</SelectItem>
                    <SelectItem value="leisure">Leisure</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="pilgrim">Pilgrimage</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="budgetRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Range (INR)</FormLabel>
              <FormControl>
                <div className="px-3">
                  <Slider
                    min={budgetRanges[0]}
                    max={budgetRanges[1]}
                    step={5000}
                    value={field.value || budgetRanges}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>₹ {(field.value?.[0] || budgetRanges[0]).toLocaleString()}</span>
                    <span>₹ {(field.value?.[1] || budgetRanges[1]).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Min: ₹ {budgetRanges[0].toLocaleString()}</span>
                    <span>Max: ₹ {budgetRanges[1].toLocaleString()}</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Budget ranges are dynamically adjusted based on trip type
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}