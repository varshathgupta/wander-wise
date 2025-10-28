"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useState, useRef } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { optimizeTravel } from "@/app/actions";
import { useTravelStore } from "@/store/travel-store";

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
  isMinimized = false, 
  onToggleMinimize, 
  hasResults = false 
}: TravelOptimizerFormProps) {
  const { toast } = useToast();
  const [currentLevel, setCurrentLevel] = useState(1);
  // Track whether user explicitly chose to optimize early (Level 2 submit click)
  const userInitiatedSubmitRef = useRef(false);
  
  // Use Zustand store instead of local state
  const { 
    setOptimizationResult, 
    setLoading, 
    setError,
    setTripMetadata,
    setLastFormData 
  } = useTravelStore();

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
  const standardPlansValue = watchedValues.standardPlans ?? true;

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

      } else {
        // On level 3, let form submission handle final optimize
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
    }
  };

  const onValidSubmit = async (values: TravelFormValues) => {
    // New guard: ALWAYS require explicit Optimize button intent (userInitiatedSubmitRef)
    // This prevents automatic optimization when simply navigating to level 3 or pressing Enter in a field.
    const isEarlySubmitMode = currentLevel === 2 && (
      !!values.easyBooking || ((values.standardPlans ?? true) && !values.isPersonalised)
    );

    const userClickedOptimize = userInitiatedSubmitRef.current;

    // Allow submit only if user explicitly clicked Optimize (sets ref) AND:
    //  - On level 3 (final) OR
    //  - In early submit mode (level 2 with qualifying options)
    if (!userClickedOptimize) {
      return; // Ignore implicit submits (e.g., Enter key)
    }
    if (!(currentLevel === 3 || isEarlySubmitMode)) {
      return; // Not eligible level/state even with intent
    }
    // Reset the intent immediately to avoid duplicate submissions (e.g., double Enter)
    userInitiatedSubmitRef.current = false;
    setLoading(true);
    setOptimizationResult(null);
    setTripMetadata(values.from, values.to);
    setLastFormData(values);

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
      setLoading(false);
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
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onValidSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const values = form.getValues();
                const isEarlySubmitMode = currentLevel === 2 && (
                  !!values.easyBooking || ((values.standardPlans ?? true) && !values.isPersonalised)
                );
                const eligible = currentLevel === 3 || isEarlySubmitMode;

                if (!eligible) {
                  // Block Enter from moving to submit when not eligible
                  e.preventDefault();
                  return;
                }
                // If eligible, we still require explicit button click normally.
                // We won't set the intent automatically here to avoid accidental submits by Enter inside a field.
                // Users must click the Optimize button; Enter will only work if button focused (which triggers onClick intent).
              }
            }}
          >
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
              showSubmitOnly={
                currentLevel === 2 && (
                  !!easyBookingValue || (standardPlansValue && !isPersonalised)
                )
              }
              onEarlyOptimizeIntent={() => { userInitiatedSubmitRef.current = true; }}
              isPersonalised={isPersonalised}
            />
            {/* Hidden submit button click handler enhancer */}
            <div className="hidden">
              {/* Intercept capture phase on submit button click to mark user intent */}
            </div>
          </form>
        )}
      </Form>
    </div>
  );
}