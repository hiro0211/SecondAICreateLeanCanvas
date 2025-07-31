import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Persona, BusinessIdea, LeanCanvas, ProductName } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parsePersonasResponse = (text: string): Persona[] => {
  try {
    const json = JSON.parse(text);
    if (json.personas) {
      return json.personas;
    }
    return json;
  } catch {
    const personas: Persona[] = [];
    const lines = text.split('\n');
    let currentPersona: Partial<Persona> | null = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.match(/^\d+\./)) {
        if (currentPersona && currentPersona.id && currentPersona.description) {
          personas.push(currentPersona as Persona);
        }
        
        const match = trimmedLine.match(/^(\d+)\.\s*(.+)/);
        if (match) {
          currentPersona = {
            id: parseInt(match[1]),
            description: match[2],
            needs: { explicit: '', implicit: '' }
          };
        }
      } else if (trimmedLine.includes('明示的ニーズ:') || trimmedLine.includes('Explicit needs:')) {
        if (currentPersona) {
          currentPersona.needs = { ...currentPersona.needs, explicit: trimmedLine.split(':')[1]?.trim() || '' };
        }
      } else if (trimmedLine.includes('潜在的ニーズ:') || trimmedLine.includes('Implicit needs:')) {
        if (currentPersona) {
          currentPersona.needs = { ...currentPersona.needs, implicit: trimmedLine.split(':')[1]?.trim() || '' };
        }
      }
    }
    
    if (currentPersona && currentPersona.id && currentPersona.description) {
      personas.push(currentPersona as Persona);
    }
    
    return personas;
  }
};

export const parseBusinessIdeasResponse = (text: string): BusinessIdea[] => {
  try {
    const json = JSON.parse(text);
    if (json.businessIdeas) {
      return json.businessIdeas;
    }
    return json;
  } catch {
    const ideas: BusinessIdea[] = [];
    const lines = text.split('\n');
    let currentIdea: Partial<BusinessIdea> | null = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.match(/^\d+\./)) {
        if (currentIdea && currentIdea.id && currentIdea.idea) {
          ideas.push(currentIdea as BusinessIdea);
        }
        
        const match = trimmedLine.match(/^(\d+)\.\s*(.+)/);
        if (match) {
          currentIdea = {
            id: parseInt(match[1]),
            idea: match[2],
            persona: '',
            osborneMethod: ''
          };
        }
      }
    }
    
    if (currentIdea && currentIdea.id && currentIdea.idea) {
      ideas.push(currentIdea as BusinessIdea);
    }
    
    return ideas;
  }
};

export const parseProductNamesResponse = (text: string): ProductName[] => {
  try {
    const json = JSON.parse(text);
    if (json.productNames) {
      return json.productNames;
    }
    return json;
  } catch {
    const names: ProductName[] = [];
    const lines = text.split('\n');
    let currentName: Partial<ProductName> | null = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.match(/^\d+\./)) {
        if (currentName && currentName.id && currentName.name) {
          names.push(currentName as ProductName);
        }
        
        const match = trimmedLine.match(/^(\d+)\.\s*(.+)/);
        if (match) {
          currentName = {
            id: parseInt(match[1]),
            name: match[2],
            reason: '',
            pros: '',
            cons: ''
          };
        }
      }
    }
    
    if (currentName && currentName.id && currentName.name) {
      names.push(currentName as ProductName);
    }
    
    return names;
  }
};

export const parseLeanCanvasResponse = (text: string): LeanCanvas => {
  try {
    return JSON.parse(text);
  } catch {
    return {
      problem: [],
      solution: [],
      keyMetrics: [],
      uniqueValueProposition: [],
      unfairAdvantage: [],
      channels: [],
      customerSegments: [],
      costStructure: [],
      revenueStreams: []
    };
  }
};