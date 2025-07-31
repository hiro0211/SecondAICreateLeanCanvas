'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { useDifyChat } from '@/hooks/useDifyChat';
import { Loader2 } from 'lucide-react';

export function ProductDetailsInput() {
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [brandImage, setBrandImage] = useState('');
  const { state, updateState, nextStep } = useWorkflow();
  const { sendMessage, loading, error } = useDifyChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !features.trim() || !brandImage.trim()) return;

    const productDetails = { category, features, brandImage };
    const message = `カテゴリー: ${category}, 特徴: ${features}, ブランドイメージ: ${brandImage}`;

    try {
      await sendMessage(message);
      updateState({ productDetails });
      nextStep();
    } catch (err) {
      console.error('Failed to send product details:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-4">プロダクト詳細を入力してください</h2>
        <p className="text-center text-muted-foreground">
          選択したビジネスアイデア「{state.selectedBusinessIdea?.idea}」について、より詳細な情報を入力してください。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>プロダクト情報</CardTitle>
          <CardDescription>
            プロダクトのカテゴリー、主な特徴、ブランドイメージを入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                カテゴリー *
              </label>
              <Input
                id="category"
                type="text"
                placeholder="例：AI教育プラットフォーム、健康管理アプリ"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium mb-2">
                主な特徴・機能 *
              </label>
              <Textarea
                id="features"
                placeholder="例：個別最適化された学習プラン、リアルタイム進捗追跡、AIによる質問回答"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>

            <div>
              <label htmlFor="brandImage" className="block text-sm font-medium mb-2">
                ブランドイメージ *
              </label>
              <Textarea
                id="brandImage"
                placeholder="例：革新的でアクセシブル、信頼できる教育パートナー"
                value={brandImage}
                onChange={(e) => setBrandImage(e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button 
              type="submit" 
              disabled={loading || !category.trim() || !features.trim() || !brandImage.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  処理中...
                </>
              ) : (
                'プロダクト名の提案を取得'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}