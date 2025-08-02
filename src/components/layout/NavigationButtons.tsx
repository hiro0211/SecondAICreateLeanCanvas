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
  const { state, goBack, reset } = useWorkflow();
  const { step } = state;

  const handlePrevious = () => {
    if (canGoPrev && step > 0 && !isLoading) {
      goBack();
    }
  };

  const handleReset = () => {
    if (!isLoading) {
      reset();
    }
  };

  if (step === 5) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
      <div className="flex space-x-2">
        {step > 0 && (
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
        ステップ {step + 1} / 6
      </div>
    </div>
  );
}