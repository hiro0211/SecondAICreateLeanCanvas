// src/hooks/useGenerator.ts
'use client';

import { useReducer, useCallback } from 'react';
import { 
  GeneratorState, 
  GeneratorAction, 
  DifyApiRequest, 
  DifyApiResponse,
  Persona,
  BusinessIdea,
  ProductName,
  LeanCanvasData
} from '@/types';

const initialState: GeneratorState = {
  step: 0,
  isLoading: false,
  error: null,
  keyword: '',
  personas: [],
  selectedPersona: null,
  businessIdeas: [],
  selectedIdea: null,
  productDetails: {
    category: '',
    features: '',
    brandImage: ''
  },
  productNames: [],
  selectedProductName: null,
  leanCanvas: null
};

function generatorReducer(state: GeneratorState, action: GeneratorAction): GeneratorState {
  switch (action.type) {
    case 'START_GENERATION':
      return {
        ...state,
        step: 1,
        keyword: action.payload.keyword,
        isLoading: true,
        error: null
      };

    case 'SET_PERSONAS':
      return {
        ...state,
        step: 1,
        personas: action.payload.personas,
        isLoading: false,
        error: null
      };

    case 'SELECT_PERSONA':
      return {
        ...state,
        step: 2,
        selectedPersona: action.payload.persona,
        isLoading: true,
        error: null
      };

    case 'SET_BUSINESS_IDEAS':
      return {
        ...state,
        step: 2,
        businessIdeas: action.payload.ideas,
        isLoading: false,
        error: null
      };

    case 'SELECT_BUSINESS_IDEA':
      return {
        ...state,
        step: 3,
        selectedIdea: action.payload.idea,
        isLoading: false,
        error: null
      };

    case 'SET_PRODUCT_DETAILS':
      return {
        ...state,
        step: 4,
        productDetails: action.payload.details,
        isLoading: true,
        error: null
      };

    case 'SET_PRODUCT_NAMES':
      return {
        ...state,
        step: 4,
        productNames: action.payload.names,
        isLoading: false,
        error: null
      };

    case 'SELECT_PRODUCT_NAME':
      return {
        ...state,
        step: 5,
        selectedProductName: action.payload.name,
        isLoading: true,
        error: null
      };

    case 'SET_LEAN_CANVAS':
      return {
        ...state,
        step: 5,
        leanCanvas: action.payload.canvas,
        isLoading: false,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading
      };

    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };

    case 'GO_BACK':
      return {
        ...state,
        step: Math.max(0, state.step - 1),
        isLoading: false,
        error: null
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function useGenerator() {
  const [state, dispatch] = useReducer(generatorReducer, initialState);

  const callDifyAPI = useCallback(async <T>(request: DifyApiRequest): Promise<T> => {
    const response = await fetch('/api/dify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: DifyApiResponse<T> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data;
  }, []);

  const generatePersonas = useCallback(async (keyword: string) => {
    try {
      dispatch({ type: 'START_GENERATION', payload: { keyword } });
      
      console.log('🚀 Generating personas for keyword:', keyword);
      
      const personas = await callDifyAPI<Persona[]>({
        task: 'persona',
        inputs: { keyword }
      });

      console.log('✅ Personas generated:', personas.length);
      
      dispatch({ type: 'SET_PERSONAS', payload: { personas } });
    } catch (error) {
      console.error('❌ Failed to generate personas:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Failed to generate personas' }
      });
    }
  }, [callDifyAPI]);

  const selectPersona = useCallback(async (persona: Persona) => {
    try {
      dispatch({ type: 'SELECT_PERSONA', payload: { persona } });
      
      console.log('🎯 Selected persona:', persona.id);
      
      const ideas = await callDifyAPI<BusinessIdea[]>({
        task: 'businessidea',
        inputs: { 
          keyword: state.keyword,
          personaId: persona.id,
          personaDescription: persona.description 
        }
      });

      console.log('✅ Business ideas generated:', ideas.length);
      
      dispatch({ type: 'SET_BUSINESS_IDEAS', payload: { ideas } });
    } catch (error) {
      console.error('❌ Failed to generate business ideas:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Failed to generate business ideas' }
      });
    }
  }, [callDifyAPI, state.keyword]);

  const generateBusinessIdeas = useCallback(async (personaId: number) => {
    const persona = state.personas.find(p => p.id === personaId);
    if (persona) {
      await selectPersona(persona);
    }
  }, [selectPersona, state.personas]);

  const selectBusinessIdea = useCallback((idea: BusinessIdea) => {
    dispatch({ type: 'SELECT_BUSINESS_IDEA', payload: { idea } });
  }, []);

  const setProductDetails = useCallback(async (details: { category: string; features: string; brandImage: string }) => {
    try {
      dispatch({ type: 'SET_PRODUCT_DETAILS', payload: { details } });
      
      console.log('📝 Product details set:', details);
      
      const names = await callDifyAPI<ProductName[]>({
        task: 'productname',
        inputs: {
          keyword: state.keyword,
          personaDescription: state.selectedPersona?.description,
          businessIdea: state.selectedIdea?.idea_text,
          category: details.category,
          features: details.features,
          brandImage: details.brandImage
        }
      });

      console.log('✅ Product names generated:', names.length);
      
      dispatch({ type: 'SET_PRODUCT_NAMES', payload: { names } });
    } catch (error) {
      console.error('❌ Failed to generate product names:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Failed to generate product names' }
      });
    }
  }, [callDifyAPI, state.keyword, state.selectedPersona, state.selectedIdea]);

  const generateProductNames = useCallback(async () => {
    if (state.productDetails.category && state.productDetails.features && state.productDetails.brandImage) {
      await setProductDetails(state.productDetails);
    }
  }, [setProductDetails, state.productDetails]);

  const selectProductName = useCallback(async (name: ProductName) => {
    try {
      dispatch({ type: 'SELECT_PRODUCT_NAME', payload: { name } });
      
      console.log('🏷️ Selected product name:', name.name);
      
      const canvas = await callDifyAPI<LeanCanvasData>({
        task: 'canvas',
        inputs: {
          keyword: state.keyword,
          personaDescription: state.selectedPersona?.description,
          businessIdea: state.selectedIdea?.idea_text,
          productName: name.name,
          category: state.productDetails.category,
          features: state.productDetails.features,
          brandImage: state.productDetails.brandImage
        }
      });

      console.log('✅ Lean canvas generated');
      
      dispatch({ type: 'SET_LEAN_CANVAS', payload: { canvas } });
    } catch (error) {
      console.error('❌ Failed to generate lean canvas:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Failed to generate lean canvas' }
      });
    }
  }, [callDifyAPI, state.keyword, state.selectedPersona, state.selectedIdea, state.productDetails]);

  const generateLeanCanvas = useCallback(async () => {
    if (state.selectedProductName) {
      await selectProductName(state.selectedProductName);
    }
  }, [selectProductName, state.selectedProductName]);

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    dispatch,
    generatePersonas,
    selectPersona,
    generateBusinessIdeas,
    selectBusinessIdea,
    setProductDetails,
    generateProductNames,
    selectProductName,
    generateLeanCanvas,
    goBack,
    reset
  };
}