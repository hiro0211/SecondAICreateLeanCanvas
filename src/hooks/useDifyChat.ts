'use client';

import { useState } from 'react';
import { DifyMessage } from '@/types';

export const useDifyChat = () => {
  const [conversationId, setConversationId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string, currentConversationId?: string): Promise<DifyMessage> => {
    setLoading(true);
    setError(null);
    
    const useConversationId = currentConversationId || conversationId;
    
    try {
      console.log('🔄 Sending message:', {
        message: message.substring(0, 50) + '...',
        conversationId: useConversationId || 'EMPTY'
      });
      
      const response = await fetch('/api/dify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: message,
          conversationId: useConversationId,
          user: 'user-123'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 🔥 APIエラーレスポンスの処理
      if (data.error) {
        throw new Error(data.error);
      }
      
      // 🔥 空レスポンスの処理
      if (data.isEmpty || !data.answer || data.answer.trim() === '') {
        console.warn('⚠️ Empty response detected');
        throw new Error('Difyから空のレスポンスが返されました。ワークフローに問題がある可能性があります。');
      }
      
      // conversation_idの更新
      if (data.conversation_id && data.conversation_id !== conversationId) {
        console.log('🔄 Updating conversationId:', data.conversation_id);
        setConversationId(data.conversation_id);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '通信エラーが発生しました';
      console.error('❌ useDifyChat error:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => {
    setConversationId('');
    setError(null);
  };

  return { 
    sendMessage, 
    conversationId, 
    loading, 
    error, 
    resetConversation 
  };
};