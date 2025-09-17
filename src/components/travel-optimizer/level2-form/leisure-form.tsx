import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type LeisureFormProps = {
  control: any;
};

export function LeisureForm({ control }: LeisureFormProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Leisure Preferences</h4>
      <FormField
        control={control}
        name="leisurePreference"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Preference</FormLabel>
            </div>
            {['Beach/pool lounging', 'Spa & wellness treatments', 'Scenic nature settings', 'Urban comfort & convenience'].map((item) => (
              <FormField
                key={item}
                control={control}
                name="leisurePreference"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={item}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item])
                              : field.onChange(
                                  field.value?.filter(
                                    (value: string) => value !== item
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="activityLevel"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Activity Level Preference</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complete-rest" id="complete-rest" />
                  <Label htmlFor="complete-rest">Complete rest & minimal movement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light-activities" id="light-activities" />
                  <Label htmlFor="light-activities">Light activities & gentle exploration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <Label htmlFor="balanced">Balanced rest + moderate activities</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active-relaxation" id="active-relaxation" />
                  <Label htmlFor="active-relaxation">Active relaxation (yoga, light sports)</Label>
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