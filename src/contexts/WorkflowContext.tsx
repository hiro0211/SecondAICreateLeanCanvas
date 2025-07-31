'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WorkflowState, WorkflowContextType } from '@/types';

const initialState: WorkflowState = {
  currentStep: 0,
  conversationId: '',
  keyword: '',
  personas: [],
  selectedPersona: null,
  businessIdeas: [],
  selectedBusinessIdea: null,
  productDetails: {
    category: '',
    features: '',
    brandImage: ''
  },
  productNames: [],
  selectedProductName: null,
  leanCanvas: null
};

type WorkflowAction = 
  | { type: 'UPDATE_STATE'; payload: Partial<WorkflowState> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET_WORKFLOW' };

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'UPDATE_STATE':
      return { ...state, ...action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 5) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case 'RESET_WORKFLOW':
      return { ...initialState };
    default:
      return state;
  }
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  const updateState = (updates: Partial<WorkflowState>) => {
    dispatch({ type: 'UPDATE_STATE', payload: updates });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const resetWorkflow = () => {
    dispatch({ type: 'RESET_WORKFLOW' });
  };

  const contextValue: WorkflowContextType = {
    state,
    updateState,
    nextStep,
    prevStep,
    resetWorkflow
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}