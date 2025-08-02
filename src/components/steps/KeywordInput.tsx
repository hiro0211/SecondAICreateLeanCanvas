// src/components/steps/KeywordInput.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Loader2 } from 'lucide-react';

export function KeywordInput() {
  const [keyword, setKeyword] = useState('');
  const { state, generatePersonas } = useWorkflow();
  const { isLoading, error } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    try {
      await generatePersonas(keyword);
    } catch (err) {
      console.error('❌ Failed to generate personas:', err);
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
                disabled={isLoading}
                className="text-lg"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button 
              type="submit" 
              disabled={isLoading || !keyword.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ペルソナを生成中...
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