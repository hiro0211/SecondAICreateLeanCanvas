// src/contexts/WorkflowContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { GeneratorContextType } from "@/types";
import { useGenerator as useGeneratorHook } from "@/hooks/useGenerator";

const GeneratorContext = createContext<GeneratorContextType | undefined>(
  undefined
);

export function GeneratorProvider({ children }: { children: ReactNode }) {
  const generator = useGeneratorHook();

  return (
    <GeneratorContext.Provider value={generator}>
      {children}
    </GeneratorContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(GeneratorContext);
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a GeneratorProvider");
  }
  return context;
}

// Backward compatibility - alias for the new hook
export { useWorkflow as useGenerator };
