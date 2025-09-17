import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type FoodSectionProps = {
  control: any;
};

export function FoodSection({ control }: FoodSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Food & Dining</h4>
      <FormField
        control={control}
        name="foodDining"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Dietary Preference</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pure-veg" id="pure-veg" />
                  <Label htmlFor="pure-veg">Pure Veg</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-veg" id="non-veg" />
                  <Label htmlFor="non-veg">Non Veg</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mix" id="food-mix" />
                  <Label htmlFor="food-mix">Mix</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="foodPreference"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Food Experience</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="familiar" id="familiar" />
                  <Label htmlFor="familiar">Familiar cuisines preferred</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="local-safe" id="local-safe" />
                  <Label htmlFor="local-safe">Local specialties with safe options</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="street-authentic" id="street-authentic" />
                  <Label htmlFor="street-authentic">Street food & authentic local dining</Label>
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