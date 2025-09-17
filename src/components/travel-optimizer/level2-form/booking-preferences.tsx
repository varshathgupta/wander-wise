import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

type BookingPreferencesProps = {
  control: any;
};

export function BookingPreferences({ control }: BookingPreferencesProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Booking Preferences</h4>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="easyBooking"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Easy Booking</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="standardPlans"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Standard Plans</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}