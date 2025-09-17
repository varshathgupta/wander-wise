import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type HoneymoonFormProps = {
  control: any;
};

export function HoneymoonForm({ control }: HoneymoonFormProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Honeymoon Preferences</h4>
      <FormField
        control={control}
        name="honeymoonType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">Private</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="social" id="social" />
                  <Label htmlFor="social">Social</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mix" id="mix" />
                  <Label htmlFor="mix">Mix</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="honeymoonAddOns"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Add-Ons</FormLabel>
            </div>
            {['Romantic Dinner', 'Photography', 'Spa Couples Package', 'Private Tours'].map((item) => (
              <FormField
                key={item}
                control={control}
                name="honeymoonAddOns"
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
    </div>
  );
}