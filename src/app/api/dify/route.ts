import { NextRequest, NextResponse } from 'next/server';
import { DifyClient } from '@/lib/dify';

const difyClient = new DifyClient();

export async function POST(request: NextRequest) {
  try {
    console.log('=== API Route Debug ===');
    
    const { query, conversationId, user } = await request.json();
    
    console.log('Request:', {
      query: query?.substring(0, 50) + '...',
      conversationId: conversationId || 'EMPTY',
      user
    });

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const response = await difyClient.sendChatMessage(query, conversationId, user || 'default-user');
    
    console.log('Dify Response:', {
      conversation_id: response.conversation_id,
      answer_length: response.answer?.length || 0,
      isEmpty: !response.answer || response.answer.trim() === ''
    });

    // 🔥 空レスポンスの処理
    if (!response.answer || response.answer.trim() === '') {
      console.warn('⚠️ Empty response from Dify');
      return NextResponse.json({
        ...response,
        answer: '', // 明示的に空文字
        isEmpty: true // フラグを追加
      });
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ API route error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}