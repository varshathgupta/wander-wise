import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { FormNavigationProps } from "./form-schema";

export function FormNavigation({
  currentLevel,
  isSubmitting,
  onPreviousLevel,
  onNextLevel,
  showSubmitOnly = false,
  onEarlyOptimizeIntent,
  isPersonalised
}: FormNavigationProps) {
  const OptimizeButton = (
    <Button
      type="submit"
      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
      disabled={isSubmitting}
      onClick={() => onEarlyOptimizeIntent?.()}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Optimize My Trip
      <Check className="h-4 w-4" />
    </Button>
  );

  const NextButton = (
    <Button
      type="button"
      onClick={onNextLevel}
      className="flex items-center gap-2"
      disabled={isSubmitting}
    >
      Next
      <ArrowRight className="h-4 w-4" />
    </Button>
  );

  // Decide what goes on the right side
  let rightContent: React.ReactNode;
  if (showSubmitOnly) {
    rightContent = OptimizeButton;
  } else if (currentLevel === 2) {
    // If personalised experience is chosen, don't show early Optimize button on level 2
    if (isPersonalised) {
      rightContent = NextButton;
    } else {
    rightContent = (
      <div className="flex items-center gap-3">
        {NextButton}
        {OptimizeButton}
      </div>
    );
    }
  } else if (currentLevel < 3) {
    rightContent = NextButton;
  } else {
    rightContent = OptimizeButton;
  }

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
      {rightContent}
    </div>
  );
}