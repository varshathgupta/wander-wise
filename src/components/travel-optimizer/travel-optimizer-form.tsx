"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { optimizeTravel } from "@/app/actions";

import { Form } from "@/components/ui/form";
import { PersonalizationToggle } from "./level2-form/personalization-toggle";

import { FormHeader } from "./form-header";
import { Level1Form } from "./level1-form";
import { Level2Form } from "./level2-form";
import { Level3Form } from "./level3-form";
import { FormNavigation } from "./form-navigation";

import { 
  formSchema, 
  TravelOptimizerFormProps, 
  TravelFormValues,
  getDefaultBudgetRange
} from "./form-schema";

export function TravelOptimizerForm({ 
  setOptimizationResult, 
  setIsLoading, 
  onFormSubmit, 
  isMinimized = false, 
  onToggleMinimize, 
  hasResults = false 
}: TravelOptimizerFormProps) {
  const { toast } = useToast();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelChoice, setShowLevelChoice] = useState(false);

  const form = useForm<TravelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
      to: "",
      place: "",
      tripType: "leisure",
      budgetRange: getDefaultBudgetRange('INR'),
      currency: "INR",
      dateRange: undefined,
  easyBooking: false,
  standardPlans: true,
      travelOptions: [],
      stayOptions: [],
      isPersonalised: false,
    },
  });

  const watchedValues = useWatch({ control: form.control });
  const tripType = watchedValues.tripType;
  const currency = watchedValues.currency || 'INR';
  const destination = watchedValues.to || '';
  const isPersonalised = watchedValues.isPersonalised;
  const easyBookingValue = watchedValues.easyBooking;

  // Handle level progression
  const handleNextLevel = async () => {
    let isValid = false;
    
    if (currentLevel === 1) {
      isValid = await form.trigger(['from', 'to', 'dateRange', 'place', 'tripType', 'budgetRange', 'currency']);
    } else {
      isValid = true; // Level 2 and 3 are optional
    }

    if (isValid) {
      if (currentLevel < 3) {
        setCurrentLevel(currentLevel + 1);
        setShowLevelChoice(false);
      } else {
        // Submit form if on level 3
        handleSubmit();
      }
    } else {
      toast({
        variant: "destructive",
        title: "Please complete all required fields",
        description: "Fill in all the required information before proceeding.",
      });
    }
  };

  const handlePreviousLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      setShowLevelChoice(false);
    }
  };

  const handleSubmit = async () => {
    const values = form.getValues();
    setIsLoading(true);
    setOptimizationResult(null);
    onFormSubmit({ source: values.from, destination: values.to });

    try {
      const result = await optimizeTravel({
        source: values.from,
        destination: values.to,
        startDate: format(values.dateRange.from!, 'yyyy-MM-dd'),
        endDate: format(values.dateRange.to!, 'yyyy-MM-dd'),
        travelerDetails: JSON.stringify({
          place: values.place,
          tripType: values.tripType,
          budgetRange: values.budgetRange,
          level2: currentLevel >= 2 ? {
            easyBooking: values.easyBooking,
            standardPlans: values.standardPlans,
            honeymoonType: values.honeymoonType,
            honeymoonAddOns: values.honeymoonAddOns,
            adventureLevel: values.adventureLevel,
            adventureMembers: values.adventureMembers,
            leisurePreference: values.leisurePreference,
            activityLevel: values.activityLevel,
          } : null,
          level3: currentLevel >= 3 ? {
            culturalImmersion: values.culturalImmersion,
            culturalActivities: values.culturalActivities,
            languageBarriers: values.languageBarriers,
            foodDining: values.foodDining,
            foodPreference: values.foodPreference,
            nightlifeInterest: values.nightlifeInterest,
          } : null,
        }),
        currency: values.currency,
      });

      if (result.error) {
        throw new Error(result.error);
      }
      
      setOptimizationResult(result.data);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
      setOptimizationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isMinimized ? 'h-20 overflow-hidden' : 'h-auto'}`}>
      <Form {...form}>
        {/* Form Header with Progress */}
        <FormHeader 
          currentLevel={currentLevel}
          isMinimized={isMinimized}
          hasResults={hasResults}
          onToggleMinimize={onToggleMinimize}
        />

        {!isMinimized && (
          <form className="space-y-8">
            {/* Level 1: Basic Trip Details */}
            {currentLevel === 1 && (
              <Level1Form 
                control={form.control}
                tripType={tripType}
                currency={currency}
                destination={destination}
              />
            )}

            {/* Level 2: Trip Character */}
            {currentLevel === 2 && (
              <>
                <Level2Form 
                  control={form.control}
                  tripType={tripType}
                  easyBookingValue={easyBookingValue}
                />
                {!easyBookingValue && (
                  <PersonalizationToggle control={form.control} />
                )}
              </>
            )}

            {/* Level 3: Trip Experience */}
            {currentLevel === 3 && (
              <Level3Form 
                control={form.control}
                tripType={tripType}
                isPersonalised={isPersonalised}
              />
            )}

            {/* Navigation Controls */}
            <FormNavigation 
              currentLevel={currentLevel}
              isSubmitting={form.formState.isSubmitting}
              onPreviousLevel={handlePreviousLevel}
              onNextLevel={handleNextLevel}
              onSubmit={handleSubmit}
              showSubmitOnly={currentLevel === 2 && !!easyBookingValue}
            />
          </form>
        )}
      </Form>
    </div>
  );
}