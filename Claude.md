markdown# リーンキャンバス作成アプリケーションの開発

Next.js (App Router) を使用して、Dify APIと連携するリーンキャンバス作成アプリケーションを開発してください。

## 重要な前提条件
- Dify側のワークフローは既に完成しており、conversation_idを使用してステートフルな会話を継続します
- 各ステップでユーザーが選択する番号（1-10）やテキストを送信し、Difyが次の情報を返します
- 最終的にJSON形式のリーンキャンバスデータが返されます

## 技術スタック
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion (アニメーション用)
- Lucide React (アイコン)

## プロジェクト構造
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── dify/
│           └── route.ts
├── components/
│   ├── steps/
│   │   ├── KeywordInput.tsx
│   │   ├── PersonaSelection.tsx
│   │   ├── BusinessIdeaSelection.tsx
│   │   ├── ProductDetailsInput.tsx
│   │   ├── ProductNameSelection.tsx
│   │   └── LeanCanvasDisplay.tsx
│   ├── ui/
│   └── layout/
│       ├── StepIndicator.tsx
│       └── NavigationButtons.tsx
├── contexts/
│   └── WorkflowContext.tsx
├── types/
│   └── index.ts
├── lib/
│   ├── dify.ts
│   └── utils.ts
└── hooks/
└── useDifyChat.ts

## 実装詳細

### 1. 型定義 (`types/index.ts`)
```typescript
export interface Persona {
  id: number;
  description: string;
  needs: {
    explicit: string;
    implicit: string;
  };
}

export interface BusinessIdea {
  id: number;
  persona: string;
  idea: string;
  osborneMethod: string;
}

export interface ProductName {
  id: number;
  name: string;
  reason: string;
  pros: string;
  cons: string;
}

export interface LeanCanvas {
  problem: string[];
  solution: string[];
  keyMetrics: string[];
  uniqueValueProposition: string[];
  unfairAdvantage: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface DifyMessage {
  answer: string;
  conversation_id: string;
  message_id: string;
}
2. Dify API クライアント (lib/dify.ts)
typescriptclass DifyClient {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = process.env.DIFY_API_KEY!;
    this.baseUrl = process.env.DIFY_API_URL!;
  }

  async sendChatMessage(
    query: string,
    conversationId?: string,
    user: string = 'default-user'
  ): Promise<DifyMessage> {
    const response = await fetch(`${this.baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {},
        query,
        response_mode: 'blocking',
        conversation_id: conversationId || '',
        user
      })
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.statusText}`);
    }

    return response.json();
  }
}
3. API Routeハンドラー (app/api/dify/route.ts)
typescriptimport { NextRequest, NextResponse } from 'next/server';
import { DifyClient } from '@/lib/dify';

const difyClient = new DifyClient();

export async function POST(request: NextRequest) {
  try {
    const { query, conversationId, user } = await request.json();
    
    const response = await difyClient.sendChatMessage(
      query,
      conversationId,
      user
    );
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Dify API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
4. カスタムフック (hooks/useDifyChat.ts)
typescriptexport const useDifyChat = () => {
  const [conversationId, setConversationId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: message,
          conversationId,
          user: 'user-123'
        })
      });

      const data = await response.json();
      
      if (!conversationId) {
        setConversationId(data.conversation_id);
      }
      
      return data;
    } catch (err) {
      setError('通信エラーが発生しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, conversationId, loading, error };
};
5. 状態管理 (contexts/WorkflowContext.tsx)
typescriptinterface WorkflowState {
  currentStep: number;
  conversationId: string;
  keyword: string;
  personas: Persona[];
  selectedPersona: Persona | null;
  businessIdeas: BusinessIdea[];
  selectedBusinessIdea: BusinessIdea | null;
  productDetails: {
    category: string;
    features: string;
    brandImage: string;
  };
  productNames: ProductName[];
  selectedProductName: ProductName | null;
  leanCanvas: LeanCanvas | null;
}

// Context実装（標準的なReact Context実装）
6. レスポンス解析関数
typescript// Difyからの返答を解析する関数群
export const parsePersonasResponse = (text: string): Persona[] => {
  // JSON形式で返される場合
  try {
    const json = JSON.parse(text);
    return json.personas;
  } catch {
    // テーブル形式で返される場合のパース処理
    // 正規表現を使用して表から情報を抽出
  }
};

export const parseBusinessIdeasResponse = (text: string): BusinessIdea[] => {
  // 同様の解析処理
};

export const parseLeanCanvasResponse = (text: string): LeanCanvas => {
  // JSON形式の解析
  return JSON.parse(text);
};
7. 各ステップコンポーネントの実装ポイント
KeywordInput.tsx

初回メッセージとしてキーワードを送信
conversation_idを取得して保存

PersonaSelection.tsx

parsePersonasResponseで解析したデータを表示
カード選択時に番号（1-10）を送信

BusinessIdeaSelection.tsx

選択されたペルソナ番号を送信後の返答を解析
カード選択UIで表示

ProductDetailsInput.tsx

3つの入力フィールドの値を結合して送信
例: "カテゴリー: AI教育, 特徴: 個別最適化, ブランドイメージ: 革新的"

ProductNameSelection.tsx

提案された10個から選択
番号（1-10）を送信

LeanCanvasDisplay.tsx

最終的なJSON形式のレスポンスを視覚的に表示
9つのブロックをグリッドレイアウトで配置

8. UI/UXデザイン要件（詳細）

ステップインジケーター: 現在のステップを視覚的に表示
戻るボタン: ブラウザの履歴ではなく、アプリ内でのステップ管理
ローディング状態: スケルトンローダーまたはスピナー
エラー処理: トーストまたはアラートで表示
レスポンシブ: モバイルでは縦並び、デスクトップではグリッド

9. 環境変数
DIFY_API_KEY=your_api_key_here
DIFY_API_URL=https://api.dify.ai
10. エラーハンドリング

API通信エラー
パースエラー（Difyからの返答形式が想定外の場合）
タイムアウト処理
リトライ機能

11. 重要な実装上の注意点

Difyはconversation_idで会話を管理するため、このIDを失わないよう注意
各ステップでの送信内容は厳密に仕様通りにする（番号のみ、テキストのみなど）
レスポンスの形式（JSON、テーブル、テキスト）に応じた柔軟なパース処理
ユーザーが途中でリロードしても続きから再開できるよう、localStorageまたはsessionStorageでの状態保持を検討

このアプリケーションを開発し、ユーザーが直感的にリーンキャンバスを作成できるようにしてください。

この改善版では以下の点を強化しました：

1. **Dify API仕様への準拠**: 実際のAPIエンドポイントとパラメータを正確に記載
2. **conversation_idの管理**: ステートフルな会話を維持するための重要な要素として明記
3. **レスポンス解析**: Difyからの様々な形式の返答を処理する方法を追加
4. **エラーハンドリング**: より具体的なエラー処理方法を記載
5. **実装の詳細度**: 各コンポーネントでの具体的な処理内容を明確化

この指示文により、Claude Codeは正確にDify APIと連携するアプリケーションを開発できるはずです。