'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'キーワード入力',
  'ペルソナ選択',
  'ビジネスアイデア選択',
  'プロダクト詳細入力',
  'プロダクト名選択',
  'リーンキャンバス完成'
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const isUpcoming = currentStep < index;

          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    {
                      'bg-primary text-primary-foreground': isCompleted,
                      'bg-primary/20 text-primary border-2 border-primary': isCurrent,
                      'bg-muted text-muted-foreground': isUpcoming,
                    }
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                <div className="mt-2 text-xs text-center max-w-20">
                  <span className={cn(
                    'font-medium',
                    {
                      'text-primary': isCompleted || isCurrent,
                      'text-muted-foreground': isUpcoming,
                    }
                  )}>
                    {stepLabels[index]}
                  </span>
                </div>
              </div>
              
              {index < totalSteps - 1 && (
                <motion.div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors',
                    {
                      'bg-primary': isCompleted,
                      'bg-muted': !isCompleted,
                    }
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}