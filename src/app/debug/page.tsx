'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
  const [testMessage, setTestMessage] = useState('テスト');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/dify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: testMessage,
          user: 'debug-user'
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${data.error || data.details || 'Unknown error'}`);
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dify API デバッグ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">テストメッセージ</label>
            <Input
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="テストメッセージを入力"
            />
          </div>
          
          <Button onClick={testAPI} disabled={loading}>
            {loading ? 'テスト中...' : 'API テスト実行'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-600">レスポンス</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>環境変数チェック</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>DIFY_API_KEY: {process.env.NEXT_PUBLIC_DIFY_API_KEY ? '設定済み' : '未設定'}</div>
            <div>DIFY_API_URL: {process.env.NEXT_PUBLIC_DIFY_API_URL || 'デフォルト値使用'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}