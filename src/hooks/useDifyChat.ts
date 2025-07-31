'use client';

import { useState } from 'react';
import { DifyMessage } from '@/types';

export const useDifyChat = () => {
  const [conversationId, setConversationId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string): Promise<DifyMessage> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: message,
          conversationId,
          user: 'user-123'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!conversationId && data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '通信エラーが発生しました';
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