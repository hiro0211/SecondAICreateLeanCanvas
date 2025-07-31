export interface Persona {
  id: number;
  description: string;
  needs: {
    explicit: string;
    implicit: string;
  };
}

export interface BusinessIdea {
  id: number;
  persona: string;
  idea: string;
  osborneMethod: string;
}

export interface ProductName {
  id: number;
  name: string;
  reason: string;
  pros: string;
  cons: string;
}

export interface LeanCanvas {
  problem: string[];
  solution: string[];
  keyMetrics: string[];
  uniqueValueProposition: string[];
  unfairAdvantage: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface DifyMessage {
  answer: string;
  conversation_id: string;
  message_id: string;
}

export interface WorkflowState {
  currentStep: number;
  conversationId: string;
  keyword: string;
  personas: Persona[];
  selectedPersona: Persona | null;
  businessIdeas: BusinessIdea[];
  selectedBusinessIdea: BusinessIdea | null;
  productDetails: {
    category: string;
    features: string;
    brandImage: string;
  };
  productNames: ProductName[];
  selectedProductName: ProductName | null;
  leanCanvas: LeanCanvas | null;
}

export interface WorkflowContextType {
  state: WorkflowState;
  updateState: (updates: Partial<WorkflowState>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetWorkflow: () => void;
}