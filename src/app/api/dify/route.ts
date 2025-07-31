import { NextRequest, NextResponse } from 'next/server';
import { DifyClient } from '@/lib/dify';

const difyClient = new DifyClient();

export async function POST(request: NextRequest) {
  try {
    console.log('API route called');
    
    const { query, conversationId, user } = await request.json();
    console.log('Request body:', { query: query?.substring(0, 100), conversationId, user });
    
    if (!query) {
      console.error('Query is missing');
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!process.env.DIFY_API_KEY) {
      console.error('DIFY_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    const response = await difyClient.sendChatMessage(
      query,
      conversationId,
      user || 'default-user'
    );
    
    console.log('API route successful response');
    return NextResponse.json(response);
  } catch (error) {
    console.error('API route error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('401') ? 401 : 
                      errorMessage.includes('403') ? 403 :
                      errorMessage.includes('404') ? 404 : 500;
    
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}