import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type CulturalSectionProps = {
  control: any;
  culturalImmersion?: string;
};

export function CulturalSection({ control, culturalImmersion }: CulturalSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Cultural Immersion</h4>
      <FormField
        control={control}
        name="culturalImmersion"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tourist-sites" id="tourist-sites" />
                  <Label htmlFor="tourist-sites">Tourist sites with local flavor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="authentic-local" id="authentic-local" />
                  <Label htmlFor="authentic-local">Authentic local experiences</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="homestays" id="homestays" />
                  <Label htmlFor="homestays">Live with locals/homestays</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="temporary-local" id="temporary-local" />
                  <Label htmlFor="temporary-local">Become temporary local</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-keen" id="not-keen" />
                  <Label htmlFor="not-keen">Not so keen</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Cultural Activities */}
      {culturalImmersion && culturalImmersion !== 'not-keen' && (
        <FormField
          control={control}
          name="culturalActivities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Cultural Activities Interest</FormLabel>
              </div>
              {['Historical sites & museums', 'Local festivals & ceremonies', 'Traditional crafts & arts', 'Religious/spiritual practices', 'Local lifestyle observation'].map((item) => (
                <FormField
                  key={item}
                  control={control}
                  name="culturalActivities"
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
      )}
    </div>
  );
}