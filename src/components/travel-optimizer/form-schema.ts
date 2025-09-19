import { z } from "zod";
import { type DateRange } from "react-day-picker";

// Define budget ranges based on destination type and trip type
export const getBudgetRanges = (destination: string, tripType: string, currency: string) => {
  const baseBudgets = {
    'USD': {
      adventure: { low: [800, 2000], medium: [2000, 4500], high: [4500, 9000], luxury: [9000, 18000] },
      honeymoon: { low: [1200, 3000], medium: [3000, 6000], high: [6000, 12000], luxury: [12000, 25000] },
      leisure: { low: [500, 1500], medium: [1500, 3500], high: [3500, 7500], luxury: [7500, 15000] },
      luxury: { low: [2000, 5000], medium: [5000, 10000], high: [10000, 20000], luxury: [20000, 50000] },
      pilgrim: { low: [300, 800], medium: [800, 2000], high: [2000, 4000], luxury: [4000, 8000] },
      others: { low: [500, 1500], medium: [1500, 3500], high: [3500, 7500], luxury: [7500, 15000] }
    },
    'EUR': {
      adventure: { low: [720, 1800], medium: [1800, 4000], high: [4000, 8100], luxury: [8100, 16200] },
      honeymoon: { low: [1080, 2700], medium: [2700, 5400], high: [5400, 10800], luxury: [10800, 22500] },
      leisure: { low: [450, 1300], medium: [1300, 3200], high: [3200, 6800], luxury: [6800, 13500] },
      luxury: { low: [1800, 4500], medium: [4500, 9000], high: [9000, 18000], luxury: [18000, 45000] },
      pilgrim: { low: [270, 720], medium: [720, 1800], high: [1800, 3600], luxury: [3600, 7200] },
      others: { low: [450, 1300], medium: [1300, 3200], high: [3200, 6800], luxury: [6800, 13500] }
    },
    'INR': {
      adventure: { low: [40000, 100000], medium: [100000, 225000], high: [225000, 450000], luxury: [450000, 900000] },
      honeymoon: { low: [60000, 150000], medium: [150000, 300000], high: [300000, 600000], luxury: [600000, 1250000] },
      leisure: { low: [25000, 75000], medium: [75000, 175000], high: [175000, 375000], luxury: [375000, 750000] },
      luxury: { low: [100000, 250000], medium: [250000, 500000], high: [500000, 1000000], luxury: [1000000, 2500000] },
      pilgrim: { low: [15000, 40000], medium: [40000, 100000], high: [100000, 200000], luxury: [200000, 400000] },
      others: { low: [25000, 75000], medium: [75000, 175000], high: [175000, 375000], luxury: [375000, 750000] }
    }
  };

  const currencyRanges = baseBudgets[currency as keyof typeof baseBudgets] || baseBudgets.INR;
  return currencyRanges[tripType as keyof typeof currencyRanges] || currencyRanges.leisure;
};

// Get default budget range for a given currency
export const getDefaultBudgetRange = (currency: string = 'INR') => {
  const ranges = getBudgetRanges('', 'leisure', currency);
  return ranges.medium; // Use medium as default
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
  showSubmitOnly?: boolean; // when true, show only the Optimize button even before final level
};

export type LevelFormProps = {
  control: any;
  tripType?: string;
  currency?: string;
  destination?: string;
  isPersonalised?: boolean;
};