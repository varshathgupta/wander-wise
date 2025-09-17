import { z } from "zod";
import { type DateRange } from "react-day-picker";

// Define budget ranges based on destination type and trip type
export const getBudgetRanges = (destination: string, tripType: string, currency: string) => {
  const baseRanges = {
    'USD': { low: [500, 1500], medium: [1500, 3500], high: [3500, 7500], luxury: [7500, 15000] },
    'EUR': { low: [450, 1300], medium: [1300, 3200], high: [3200, 6800], luxury: [6800, 13500] },
    'INR': { low: [5000, 75000], medium: [75000, 175000], high: [175000, 375000], luxury: [375000, 750000] },
  };
  return baseRanges[currency as keyof typeof baseRanges] || baseRanges.INR;
};

export const formSchema = z.object({
  // Level 1: Basic Trip Details
  from: z.string().min(2, "Source location is required"),
  to: z.string().min(2, "Destination is required"),
  dateRange: z.any().refine((value): value is DateRange => !!value?.from && !!value?.to, {
    message: "A complete date range is required.",
  }),
  place: z.string().optional(),
  tripType: z.enum(['adventure', 'honeymoon', 'leisure', 'luxury', 'pilgrim', 'others']),
  budgetRange: z.array(z.number()).length(2),
  currency: z.enum(['USD', 'EUR', 'INR']),
  
  // Level 2: Trip Character (conditional based on trip type)
  easyBooking: z.boolean().optional(),
  standardPlans: z.boolean().optional(),
  travelOptions: z.array(z.string()).optional(),
  stayOptions: z.array(z.string()).optional(),
  
  // Honeymoon specific
  honeymoonType: z.enum(['private', 'social', 'mix']).optional(),
  honeymoonAddOns: z.array(z.string()).optional(),
  
  // Adventure specific
  adventureLevel: z.enum(['mild', 'moderate', 'high']).optional(),
  adventureMembers: z.enum(['solo', 'sole-searching', 'group']).optional(),
  
  // Leisure specific
  leisurePreference: z.array(z.string()).optional(),
  activityLevel: z.enum(['complete-rest', 'light-activities', 'balanced', 'active-relaxation']).optional(),
  
  // Level 3: Trip Experience (adaptive)
  isPersonalised: z.boolean().optional(),
  culturalImmersion: z.enum(['tourist-sites', 'authentic-local', 'homestays', 'temporary-local', 'not-keen']).optional(),
  culturalActivities: z.array(z.string()).optional(),
  languageBarriers: z.enum(['comfortable', 'need-help', 'learn-basics', 'not-concern']).optional(),
  foodDining: z.enum(['pure-veg', 'non-veg', 'mix']).optional(),
  foodPreference: z.enum(['familiar', 'local-safe', 'street-authentic']).optional(),
  nightlifeInterest: z.enum(['early-quiet', 'local-bars', 'vibrant-clubs', 'cultural-evening']).optional(),
});

export type TravelFormValues = z.infer<typeof formSchema>;

export type TravelOptimizerFormProps = {
  setOptimizationResult: (result: any | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  onFormSubmit: (data: { source: string; destination: string; }) => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  hasResults?: boolean;
};

export type FormNavigationProps = {
  currentLevel: number;
  isSubmitting: boolean;
  onPreviousLevel: () => void;
  onNextLevel: () => void;
  onSubmit: () => void;
};

export type LevelFormProps = {
  control: any;
  tripType?: string;
  currency?: string;
  destination?: string;
  isPersonalised?: boolean;
};