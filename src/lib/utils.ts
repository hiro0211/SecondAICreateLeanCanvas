import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Persona, BusinessIdea, LeanCanvas, ProductName } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parsePersonasResponse = (text: string): Persona[] => {
  if (!text || text.trim() === '') {
    console.warn('Empty text provided to parsePersonasResponse');
    return [];
  }

  try {
    console.log('🔄 Parsing personas from:', text.substring(0, 100) + '...');
    
    const parsed = JSON.parse(text);
    
    if (parsed.personas && Array.isArray(parsed.personas)) {
      console.log('✅ Successfully parsed', parsed.personas.length, 'personas');
      return parsed.personas.map((p: any) => ({
        id: p.id,
        description: p.description,
        needs: {
          explicit: p.needs?.explicit || '',
          implicit: p.needs?.implicit || ''
        }
      }));
    }
    
    console.warn('⚠️ Invalid JSON structure for personas');
    return [];
  } catch (error) {
    console.error('❌ JSON parsing failed:', error);
    // フォールバック処理は削除（混乱を避けるため）
    return [];
  }
};

export const parseBusinessIdeasResponse = (text: string): BusinessIdea[] => {
  try {
    const json = JSON.parse(text);
    if (json.businessIdeas && Array.isArray(json.businessIdeas)) {
      return json.businessIdeas;
    }
    if (Array.isArray(json)) {
      return json;
    }
    // If JSON parsed but not an array or doesn't have businessIdeas array, fall back to text parsing
    throw new Error("Invalid JSON structure");
  } catch {
    const ideas: BusinessIdea[] = [];
    const lines = text.split("\n");
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
            persona: "",
            osborneMethod: "",
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
    const lines = text.split("\n");
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
            reason: "",
            pros: "",
            cons: "",
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
      revenueStreams: [],
    };
  }
};
