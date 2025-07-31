'use client';

import { AnimatePresence } from 'framer-motion';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { StepIndicator } from '@/components/layout/StepIndicator';
import { NavigationButtons } from '@/components/layout/NavigationButtons';
import { KeywordInput } from '@/components/steps/KeywordInput';
import { PersonaSelection } from '@/components/steps/PersonaSelection';
import { BusinessIdeaSelection } from '@/components/steps/BusinessIdeaSelection';
import { ProductDetailsInput } from '@/components/steps/ProductDetailsInput';
import { ProductNameSelection } from '@/components/steps/ProductNameSelection';
import { LeanCanvasDisplay } from '@/components/steps/LeanCanvasDisplay';

const stepComponents = [
  KeywordInput,
  PersonaSelection,
  BusinessIdeaSelection,
  ProductDetailsInput,
  ProductNameSelection,
  LeanCanvasDisplay,
];

export default function Home() {
  const { state } = useWorkflow();
  const { currentStep } = state;

  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="max-w-7xl mx-auto">
      <StepIndicator currentStep={currentStep} totalSteps={6} />
      
      <AnimatePresence mode="wait">
        <CurrentStepComponent key={currentStep} />
      </AnimatePresence>
      
      <NavigationButtons />
    </div>
  );
}