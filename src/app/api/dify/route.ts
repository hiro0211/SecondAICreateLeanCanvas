// src/app/api/dify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DifyTaskType, DifyApiRequest, DifyApiResponse, Persona, BusinessIdea, ProductName, LeanCanvasData } from '@/types';

const DIFY_API_URL = process.env.DIFY_API_URL!;
const DIFY_API_KEY = process.env.DIFY_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body: DifyApiRequest = await request.json();
    const { task, inputs } = body;

    console.log('🚀 BFF Request:', { task, inputs });

    if (!task || !inputs) {
      return NextResponse.json({
        success: false,
        error: 'Task and inputs are required'
      }, { status: 400 });
    }

    // タスクベースルーティング
    const difyResponse = await callDifyWorkflow(task, inputs);
    
    console.log('✅ Dify Response received for task:', task);
    
    return NextResponse.json(difyResponse);
  } catch (error) {
    console.error('❌ BFF Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      task: 'unknown'
    }, { status: 500 });
  }
}

async function callDifyWorkflow<T>(task: DifyTaskType, inputs: Record<string, any>): Promise<DifyApiResponse<T>> {
  try {
    const requestBody = {
      inputs: {
        task,
        ...inputs
      },
      response_mode: 'blocking',
      user: 'user-001'
    };

    console.log('🔄 Calling Dify with:', requestBody);

    const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Difyからのレスポンスを安全にパース
    const parsedData = parseTaskResponse(task, data.data?.outputs?.result || data.data?.outputs);
    
    return {
      data: parsedData,
      task,
      success: true
    };
  } catch (error) {
    console.error(`❌ Dify workflow error for task ${task}:`, error);
    throw error;
  }
}

function parseTaskResponse(task: DifyTaskType, rawData: any): any {
  try {
    console.log(`🔄 Parsing response for task: ${task}`);
    
    switch (task) {
      case 'persona':
        return parsePersonasResponse(rawData);
      case 'businessidea':
        return parseBusinessIdeasResponse(rawData);
      case 'productname':
        return parseProductNamesResponse(rawData);
      case 'canvas':
        return parseLeanCanvasResponse(rawData);
      default:
        throw new Error(`Unknown task type: ${task}`);
    }
  } catch (error) {
    console.error(`❌ Parse error for task ${task}:`, error);
    throw new Error(`Failed to parse response for task: ${task}`);
  }
}

function parsePersonasResponse(data: any): Persona[] {
  if (Array.isArray(data)) return data;
  if (data.personas && Array.isArray(data.personas)) return data.personas;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : parsed.personas || [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseBusinessIdeasResponse(data: any): BusinessIdea[] {
  if (Array.isArray(data)) return data;
  if (data.ideas && Array.isArray(data.ideas)) return data.ideas;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : parsed.ideas || [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseProductNamesResponse(data: any): ProductName[] {
  if (Array.isArray(data)) return data;
  if (data.names && Array.isArray(data.names)) return data.names;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : parsed.names || [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseLeanCanvasResponse(data: any): LeanCanvasData {
  if (typeof data === 'object' && data !== null) return data;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return createEmptyCanvas();
    }
  }
  return createEmptyCanvas();
}

function createEmptyCanvas(): LeanCanvasData {
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