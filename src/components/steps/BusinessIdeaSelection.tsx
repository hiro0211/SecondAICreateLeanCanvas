// src/components/steps/BusinessIdeaSelection.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { BusinessIdea } from '@/types';
import { Loader2, Lightbulb } from 'lucide-react';

export function BusinessIdeaSelection() {
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const { state, selectBusinessIdea } = useWorkflow();
  const { businessIdeas, selectedPersona, isLoading, error } = state;

  const handleIdeaSelect = async (idea: BusinessIdea) => {
    if (isLoading) return;
    
    setSelectedIdea(idea);
    
    try {
      await selectBusinessIdea(idea);
    } catch (err) {
      console.error('Failed to select business idea:', err);
    }
  };

  if (isLoading && businessIdeas.length === 0) {
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
              <p>ビジネスアイデアを生成中...</p>
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
        <h2 className="text-3xl font-bold text-center mb-4">
          ビジネスアイデアを選択してください
        </h2>
        <p className="text-center text-muted-foreground">
          選択したペルソナ「{selectedPersona?.description}」に基づいて生成されたビジネスアイデアから選んでください。
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
        {businessIdeas.map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedIdea?.id === idea.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleIdeaSelect(idea)}
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-lg">
                    アイデア {idea.id}
                  </CardTitle>
                </div>
                <CardDescription>{idea.idea_text}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {idea.osborn_hint && (
                    <div>
                      <h4 className="font-semibold text-sm">
                        オズボーン手法
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {idea.osborn_hint}
                      </p>
                    </div>
                  )}
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
            <span>選択を処理中...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}