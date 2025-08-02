// src/components/steps/ProductNameSelection.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { ProductName } from '@/types';
import { Loader2, Tag, CheckCircle, XCircle } from 'lucide-react';

export function ProductNameSelection() {
  const [selectedName, setSelectedName] = useState<ProductName | null>(null);
  const { state, selectProductName } = useWorkflow();
  const { productNames, isLoading, error } = state;

  const handleNameSelect = async (name: ProductName) => {
    if (isLoading) return;
    
    setSelectedName(name);
    
    try {
      await selectProductName(name);
    } catch (err) {
      console.error('Failed to select product name:', err);
    }
  };

  if (productNames.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
              <p className="text-muted-foreground mb-4">
                プロダクト名候補が見つかりません。前のステップに戻ってください。
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-4">プロダクト名を選択してください</h2>
        <p className="text-center text-muted-foreground">
          生成されたプロダクト名候補から、最も適したものを選んでください。
        </p>
      </div>

      {error && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="text-red-500 text-center">{error}</div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productNames.map((name, index) => (
          <motion.div
            key={name.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedName?.id === name.id ? 'ring-2 ring-primary' : ''
              } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => handleNameSelect(name)}
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">{name.name}</CardTitle>
                </div>
                <CardDescription>{name.reason}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">メリット</h4>
                    <p className="text-sm text-muted-foreground">{name.pros}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">注意点</h4>
                    <p className="text-sm text-muted-foreground">{name.cons}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>リーンキャンバスを生成中...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}