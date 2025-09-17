import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type LanguageSectionProps = {
  control: any;
};

export function LanguageSection({ control }: LanguageSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="languageBarriers"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Language Barriers</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="comfortable" />
                  <Label htmlFor="comfortable">I'm comfortable navigating</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="need-help" id="need-help" />
                  <Label htmlFor="need-help">I need translation help</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="learn-basics" id="learn-basics" />
                  <Label htmlFor="learn-basics">I want to learn basics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-concern" id="not-concern" />
                  <Label htmlFor="not-concern">Not a concern</Label>
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