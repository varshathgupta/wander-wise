import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LevelFormProps } from "../form-schema";
import { BookingPreferences } from "./booking-preferences";
import { HoneymoonForm } from "./honeymoon-form";
import { AdventureForm } from "./adventure-form";
import { LeisureForm } from "./leisure-form";

type Level2ExtendedProps = LevelFormProps & { easyBookingValue?: boolean };

export function Level2Form({ 
  control, 
  tripType = 'leisure',
  easyBookingValue = false,
}: Level2ExtendedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Level 2</Badge>
          Trip Character
        </CardTitle>
        <CardDescription>
          Customize your trip experience based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Common booking preferences */}
        <BookingPreferences control={control} easyBookingValue={easyBookingValue} />

        {/* Trip Type Specific Options (hidden for Easy Booking) */}
        {!easyBookingValue && (
          <>
            {tripType === 'honeymoon' && <HoneymoonForm control={control} />}
            {tripType === 'adventure' && <AdventureForm control={control} />}
            {tripType === 'leisure' && <LeisureForm control={control} />}
          </>
        )}
      </CardContent>
    </Card>
  );
}