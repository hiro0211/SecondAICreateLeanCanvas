// Difyの各タスクからのレスポンスJSONの型
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
  idea_text: string;
  osborn_hint: string;
}

export interface ProductName {
  id: number;
  name: string;
  reason: string;
  pros: string;
  cons: string;
}

export interface LeanCanvasData {
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

// Dify APIとの通信に関する型
export type DifyTaskType = 'persona' | 'businessidea' | 'productname' | 'canvas';

export interface DifyApiRequest {
  task: DifyTaskType;
  inputs: Record<string, any>;
}

export interface DifyApiResponse<T = any> {
  data: T;
  task: DifyTaskType;
  success: boolean;
  error?: string;
}

// Generator State Management
export interface GeneratorState {
  step: number;
  isLoading: boolean;
  error: string | null;
  keyword: string;
  personas: Persona[];
  selectedPersona: Persona | null;
  businessIdeas: BusinessIdea[];
  selectedIdea: BusinessIdea | null;
  productDetails: {
    category: string;
    features: string;
    brandImage: string;
  };
  productNames: ProductName[];
  selectedProductName: ProductName | null;
  leanCanvas: LeanCanvasData | null;
}

export type GeneratorAction =
  | { type: 'START_GENERATION'; payload: { keyword: string } }
  | { type: 'SET_PERSONAS'; payload: { personas: Persona[] } }
  | { type: 'SELECT_PERSONA'; payload: { persona: Persona } }
  | { type: 'SET_BUSINESS_IDEAS'; payload: { ideas: BusinessIdea[] } }
  | { type: 'SELECT_BUSINESS_IDEA'; payload: { idea: BusinessIdea } }
  | { type: 'SET_PRODUCT_DETAILS'; payload: { details: { category: string; features: string; brandImage: string } } }
  | { type: 'SET_PRODUCT_NAMES'; payload: { names: ProductName[] } }
  | { type: 'SELECT_PRODUCT_NAME'; payload: { name: ProductName } }
  | { type: 'SET_LEAN_CANVAS'; payload: { canvas: LeanCanvasData } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'GO_BACK' }
  | { type: 'RESET' };

export interface GeneratorContextType {
  state: GeneratorState;
  dispatch: (action: GeneratorAction) => void;
  generatePersonas: (keyword: string) => Promise<void>;
  selectPersona: (persona: Persona) => Promise<void>;
  generateBusinessIdeas: (personaId: number) => Promise<void>;
  selectBusinessIdea: (idea: BusinessIdea) => Promise<void>;
  setProductDetails: (details: { category: string; features: string; brandImage: string }) => Promise<void>;
  generateProductNames: () => Promise<void>;
  selectProductName: (name: ProductName) => Promise<void>;
  generateLeanCanvas: () => Promise<void>;
  goBack: () => void;
  reset: () => void;
}