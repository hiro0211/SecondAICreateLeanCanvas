// src/components/steps/ProductDetailsInput.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Loader2, Package } from 'lucide-react';

export function ProductDetailsInput() {
  const { state, setProductDetails } = useWorkflow();
  const { selectedIdea, isLoading, error } = state;
  
  const [details, setDetails] = useState({
    category: '',
    features: '',
    brandImage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.category.trim() || !details.features.trim() || !details.brandImage.trim()) return;

    try {
      await setProductDetails(details);
    } catch (err) {
      console.error('Failed to set product details:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <CardTitle>プロダクト詳細の入力</CardTitle>
          </div>
          <CardDescription>
            選択されたビジネスアイデア「{selectedIdea?.idea_text}」に基づいて、プロダクトの詳細を入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">プロダクトカテゴリー</Label>
              <Input
                id="category"
                type="text"
                placeholder="例：AI教育プラットフォーム"
                value={details.category}
                onChange={(e) => setDetails(prev => ({ ...prev, category: e.target.value }))}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">主要機能・特徴</Label>
              <Textarea
                id="features"
                placeholder="例：個別最適化学習、リアルタイムフィードバック、進捗追跡"
                value={details.features}
                onChange={(e) => setDetails(prev => ({ ...prev, features: e.target.value }))}
                disabled={isLoading}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandImage">ブランドイメージ</Label>
              <Input
                id="brandImage"
                type="text"
                placeholder="例：革新的、信頼性、親しみやすい"
                value={details.brandImage}
                onChange={(e) => setDetails(prev => ({ ...prev, brandImage: e.target.value }))}
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !details.category.trim() || !details.features.trim() || !details.brandImage.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  プロダクト名を生成中...
                </>
              ) : (
                'プロダクト名候補を生成'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}