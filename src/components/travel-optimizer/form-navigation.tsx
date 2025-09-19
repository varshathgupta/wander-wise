import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { FormNavigationProps } from "./form-schema";

export function FormNavigation({
  currentLevel,
  isSubmitting,
  onPreviousLevel,
  onNextLevel,
  onSubmit,
  showSubmitOnly = false
}: FormNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6">
      <Button 
        type="button"
        variant="outline"
        onClick={onPreviousLevel}
        disabled={currentLevel === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>

      {(!showSubmitOnly && currentLevel < 3) ? (
        <Button 
          type="button"
          onClick={onNextLevel}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          type="button"
          onClick={onSubmit}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Optimize My Trip
          <Check className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}