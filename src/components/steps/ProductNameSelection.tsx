'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { useDifyChat } from '@/hooks/useDifyChat';
import { parseProductNamesResponse } from '@/lib/utils';
import { ProductName } from '@/types';
import { Loader2, Tag, CheckCircle, XCircle } from 'lucide-react';

export function ProductNameSelection() {
  const [selectedName, setSelectedName] = useState<ProductName | null>(null);
  const { state, updateState, nextStep } = useWorkflow();
  const { sendMessage, loading, error } = useDifyChat();

  useEffect(() => {
    const fetchProductNames = async () => {
      if (state.productNames.length === 0 && state.productDetails.category) {
        try {
          const response = await sendMessage('プロダクト名を提案してください');
          const names = parseProductNamesResponse(response.answer);
          updateState({ productNames: names });
        } catch (err) {
          console.error('Failed to fetch product names:', err);
        }
      }
    };

    fetchProductNames();
  }, [state.productDetails, state.productNames.length, sendMessage, updateState]);

  const handleNameSelect = async (name: ProductName) => {
    setSelectedName(name);
    try {
      await sendMessage(name.id.toString());
      updateState({ selectedProductName: name });
      nextStep();
    } catch (err) {
      console.error('Failed to select product name:', err);
    }
  };

  if (loading && state.productNames.length === 0) {
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
              <p>プロダクト名を生成中...</p>
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
          「{state.productDetails.category}」について提案されたプロダクト名から選んでください。
        </p>
      </div>

      {error && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="text-red-500 text-center">{error}</div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.productNames.map((name, index) => (
          <motion.div
            key={name.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedName?.id === name.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleNameSelect(name)}
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-xl">{name.name}</CardTitle>
                </div>
                {name.reason && (
                  <CardDescription>{name.reason}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {name.pros && (
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-green-700">メリット</h4>
                        <p className="text-sm text-muted-foreground">{name.pros}</p>
                      </div>
                    </div>
                  )}
                  {name.cons && (
                    <div className="flex items-start space-x-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-red-700">デメリット</h4>
                        <p className="text-sm text-muted-foreground">{name.cons}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>選択を処理中...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}