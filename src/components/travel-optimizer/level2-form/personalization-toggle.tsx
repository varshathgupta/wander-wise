import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";

type PersonalizationToggleProps = {
  control: any;
};

export function PersonalizationToggle({ control }: PersonalizationToggleProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={control}
          name="isPersonalised"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Personalised Experience
                </FormLabel>
                <FormDescription>
                  Enable detailed customization for cultural preferences, food, and lifestyle choices
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}