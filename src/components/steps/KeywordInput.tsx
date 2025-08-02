'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { useDifyChat } from '@/hooks/useDifyChat';
import { parsePersonasResponse } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function KeywordInput() {
  const [keyword, setKeyword] = useState('');
  const { updateState, nextStep } = useWorkflow();
  const { sendMessage, loading, error } = useDifyChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    try {
      console.log('🚀 Sending keyword:', keyword);
      const response = await sendMessage(keyword);
      
      console.log('✅ Keyword response received:', {
        conversation_id: response.conversation_id,
        answer_length: response.answer?.length || 0
      });
      
      // 🔥 重要: レスポンスからペルソナデータを即座に解析・保存
      let personas = [];
      if (response.answer) {
        try {
          personas = parsePersonasResponse(response.answer);
          console.log('✅ Parsed personas:', personas.length);
        } catch (parseError) {
          console.error('❌ Failed to parse personas:', parseError);
        }
      }
      
      // conversationIdとペルソナデータを同時に保存
      updateState({ 
        keyword,
        conversationId: response.conversation_id,
        personas: personas // 🔥 ここでペルソナデータを保存
      });
      
      nextStep();
    } catch (err) {
      console.error('❌ Failed to send keyword:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>リーンキャンバス作成を開始しましょう</CardTitle>
          <CardDescription>
            ビジネスアイデアの核となるキーワードを入力してください。例：「AI教育」「健康管理」「リモートワーク」
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="キーワードを入力してください"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={loading}
                className="text-lg"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button 
              type="submit" 
              disabled={loading || !keyword.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  処理中...
                </>
              ) : (
                'ペルソナ分析を開始'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}