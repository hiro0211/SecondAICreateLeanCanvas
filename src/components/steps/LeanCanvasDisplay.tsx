// src/components/steps/LeanCanvasDisplay.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Loader2, Download, RefreshCw } from 'lucide-react';

const canvasItems = [
  { key: 'problem', title: '課題', color: 'bg-red-50 border-red-200' },
  { key: 'solution', title: 'ソリューション', color: 'bg-blue-50 border-blue-200' },
  { key: 'uniqueValueProposition', title: '独自の価値提案', color: 'bg-purple-50 border-purple-200' },
  { key: 'unfairAdvantage', title: '圧倒的な優位性', color: 'bg-green-50 border-green-200' },
  { key: 'customerSegments', title: '顧客セグメント', color: 'bg-yellow-50 border-yellow-200' },
  { key: 'keyMetrics', title: '主要指標', color: 'bg-indigo-50 border-indigo-200' },
  { key: 'channels', title: 'チャネル', color: 'bg-pink-50 border-pink-200' },
  { key: 'costStructure', title: 'コスト構造', color: 'bg-orange-50 border-orange-200' },
  { key: 'revenueStreams', title: '収益の流れ', color: 'bg-teal-50 border-teal-200' }
];

export function LeanCanvasDisplay() {
  const { state, reset } = useWorkflow();
  const { leanCanvas, selectedProductName, keyword, selectedPersona, selectedIdea, productDetails, isLoading, error } = state;

  const handleDownload = () => {
    if (!leanCanvas || !selectedProductName) return;

    const data = {
      productName: selectedProductName.name,
      keyword,
      persona: selectedPersona,
      businessIdea: selectedIdea,
      productDetails,
      leanCanvas
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedProductName.name}_lean_canvas.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestart = () => {
    reset();
  };

  if (isLoading && !leanCanvas) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
              <p>リーンキャンバスを生成中...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!leanCanvas) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">リーンキャンバスの生成に失敗しました。</p>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <Button onClick={handleRestart}>
                <RefreshCw className="mr-2 h-4 w-4" />
                最初からやり直す
              </Button>
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
      className="max-w-7xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold mb-4">
          {selectedProductName?.name} のリーンキャンバス
        </h2>
        <p className="text-muted-foreground mb-6">
          完成したリーンキャンバスです。各ブロックをクリックして詳細を確認できます。
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            JSONでダウンロード
          </Button>
          <Button variant="outline" onClick={handleRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            新しいキャンバスを作成
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {canvasItems.map((item, index) => {
          const content = leanCanvas![item.key as keyof typeof leanCanvas] as string[];
          
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={index === 2 ? 'md:col-span-1 md:row-span-2' : ''}
            >
              <Card className={`h-full ${item.color}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {content && content.length > 0 ? (
                    <ul className="space-y-2">
                      {content.map((point, idx) => (
                        <li key={idx} className="text-sm">
                          • {point}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      データが取得できませんでした
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}