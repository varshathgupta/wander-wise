import { z } from "zod";
import { type DateRange } from "react-day-picker";

// Define budget ranges based on trip type (INR only for India)
export const getBudgetRanges = (destination: string, tripType: string) => {
  const budgetRanges = {
    adventure: [30000, 100000],
    honeymoon: [60000, 150000],
    leisure: [25000, 75000],
    luxury: [100000, 250000],
    pilgrim: [15000, 40000],
    others: [25000, 75000]
  };

  return budgetRanges[tripType as keyof typeof budgetRanges] || budgetRanges.leisure;
};

// Get default budget range (INR only)
export const getDefaultBudgetRange = () => {
  return getBudgetRanges('', 'leisure');
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
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  hasResults?: boolean;
};

export type FormNavigationProps = {
  currentLevel: number;
  isSubmitting: boolean;
  onPreviousLevel: () => void;
  onNextLevel: () => void;
  showSubmitOnly?: boolean; // when true, show only the Optimize button even before final level
  onEarlyOptimizeIntent?: () => void; // mark user intent for early submit
  isPersonalised?: boolean; // if user opted into personalised experience, suppress early optimize button at level 2
};

export type LevelFormProps = {
  control: any;
  tripType?: string;
  destination?: string;
  isPersonalised?: boolean;
};