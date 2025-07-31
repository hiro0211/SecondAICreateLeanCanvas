'use client';

import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface NavigationButtonsProps {
  canGoNext?: boolean;
  canGoPrev?: boolean;
  isLoading?: boolean;
}

export function NavigationButtons({ 
  canGoNext = true, 
  canGoPrev = true, 
  isLoading = false 
}: NavigationButtonsProps) {
  const { state, prevStep, resetWorkflow } = useWorkflow();
  const { currentStep } = state;

  const handlePrevious = () => {
    if (canGoPrev && currentStep > 0 && !isLoading) {
      prevStep();
    }
  };

  const handleReset = () => {
    if (!isLoading) {
      resetWorkflow();
    }
  };

  if (currentStep === 5) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
      <div className="flex space-x-2">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrev || isLoading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
        )}
        
        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={isLoading}
          className="text-muted-foreground"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          最初から
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        ステップ {currentStep + 1} / 6
      </div>
    </div>
  );
}