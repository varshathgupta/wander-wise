import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type FormHeaderProps = {
  currentLevel: number;
  isMinimized?: boolean;
  hasResults?: boolean;
  onToggleMinimize?: () => void;
};

export function FormHeader({ 
  currentLevel, 
  isMinimized = false, 
  hasResults = false, 
  onToggleMinimize 
}: FormHeaderProps) {
  // Progress calculation
  const getProgress = () => {
    return (currentLevel / 3) * 100;
  };

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Level {currentLevel} of 3</Badge>
          {hasResults && onToggleMinimize && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleMinimize}
              className="ml-2"
            >
              {isMinimized ? "Expand Form" : "Minimize Form"}
            </Button>
          )}
        </div>
        <div className="flex-1 max-w-md">
          <Progress value={getProgress()} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Trip Details</span>
            <span>Trip Character</span>
            <span>Trip Experience</span>
          </div>
        </div>
      </div>
    </div>
  );
}