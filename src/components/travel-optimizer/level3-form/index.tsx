import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LevelFormProps } from "../form-schema";
import { CulturalSection } from "./cultural-section";
import { LanguageSection } from "./language-section";
import { FoodSection } from "./food-section";
import { NightlifeSection } from "./nightlife-section";

export function Level3Form({ 
  control, 
  tripType = 'leisure',
  isPersonalised = false,
}: LevelFormProps) {
  // If personalization is not enabled, show a simplified card
  if (!isPersonalised) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">Level 3</Badge>
            Ready to Optimize
          </CardTitle>
          <CardDescription>
            We're ready to optimize your travel plan based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
            <p>Click "Optimize My Trip" below to generate your personalized travel plan.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Level 3</Badge>
          Trip Experience
        </CardTitle>
        <CardDescription>
          Detailed personalization for an authentic travel experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CulturalSection 
          control={control} 
          culturalImmersion={control._formValues.culturalImmersion}
        />
        <LanguageSection control={control} />
        <FoodSection control={control} />
        <NightlifeSection control={control} tripType={tripType} />
      </CardContent>
    </Card>
  );
}