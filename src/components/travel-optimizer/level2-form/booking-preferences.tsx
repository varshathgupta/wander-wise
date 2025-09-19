import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

type BookingPreferencesProps = {
  control: any;
  easyBookingValue?: boolean;
};

export function BookingPreferences({ control, easyBookingValue }: BookingPreferencesProps) {
  // Access form methods for mutual exclusivity logic
  const { setValue, getValues } = useFormContext();
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
                  onCheckedChange={(checked) => {
                    const value = !!checked;
                    field.onChange(value);
                    if (value) {
                      // Uncheck standardPlans when easyBooking selected
                      setValue("standardPlans", false, { shouldDirty: true, shouldTouch: true });
                    }
                  }}
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
                  /* Default to checked (standard booking) if undefined */
                  checked={field.value ?? true}
                  onCheckedChange={(checked) => {
                    const value = !!checked;
                    field.onChange(value);
                    if (value) {
                      // Uncheck easyBooking when standardPlans selected
                      setValue("easyBooking", false, { shouldDirty: true, shouldTouch: true });
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Standard Booking</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}