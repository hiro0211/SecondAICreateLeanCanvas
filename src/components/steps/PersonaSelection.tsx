// src/components/steps/PersonaSelection.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Persona } from '@/types';
import { Loader2, User } from 'lucide-react';

export function PersonaSelection() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const { state, selectPersona } = useWorkflow();
  const { personas, isLoading, error } = state;

  const handlePersonaSelect = async (persona: Persona) => {
    if (isLoading) return;
    
    setSelectedPersona(persona);
    
    try {
      await selectPersona(persona);
    } catch (err) {
      console.error('Failed to select persona:', err);
    }
  };

  // ペルソナデータがない場合の表示
  if (personas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                ペルソナデータが見つかりません。最初からやり直してください。
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
        <h2 className="text-3xl font-bold text-center mb-4">ペルソナを選択してください</h2>
        <p className="text-center text-muted-foreground">
          「{state.keyword}」に関連するペルソナから、最も適したものを選んでください。
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
        {personas.map((persona, index) => (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPersona?.id === persona.id ? 'ring-2 ring-primary' : ''
              } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => handlePersonaSelect(persona)}
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <CardTitle className="text-lg">ペルソナ {persona.id}</CardTitle>
                </div>
                <CardDescription>{persona.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">明示的ニーズ</h4>
                    <p className="text-sm text-muted-foreground">{persona.needs.explicit}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">潜在的ニーズ</h4>
                    <p className="text-sm text-muted-foreground">{persona.needs.implicit}</p>
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
            <span>選択を処理中...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}