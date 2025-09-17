import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type NightlifeSectionProps = {
  control: any;
  tripType?: string;
};

export function NightlifeSection({ control, tripType }: NightlifeSectionProps) {
  // Don't show nightlife options for pilgrim trips
  if (tripType === 'pilgrim') {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="nightlifeInterest"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Nightlife Interest</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="early-quiet" id="early-quiet" />
                  <Label htmlFor="early-quiet">Early evenings & quiet settings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="local-bars" id="local-bars" />
                  <Label htmlFor="local-bars">Local bars & casual nightlife</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vibrant-clubs" id="vibrant-clubs" />
                  <Label htmlFor="vibrant-clubs">Vibrant clubs & party scenes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cultural-evening" id="cultural-evening" />
                  <Label htmlFor="cultural-evening">Cultural evening entertainment</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}