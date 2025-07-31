import { DifyMessage } from '@/types';

export class DifyClient {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = process.env.DIFY_API_KEY!;
    this.baseUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';
  }

  async sendChatMessage(
    query: string,
    conversationId?: string,
    user: string = 'default-user'
  ): Promise<DifyMessage> {
    console.log('Sending request to Dify API:', {
      url: `${this.baseUrl}/chat-messages`,
      query: query.substring(0, 100) + '...',
      conversationId,
      user
    });

    const requestBody = {
      inputs: {},
      query,
      response_mode: 'blocking',
      user,
      ...(conversationId && { conversation_id: conversationId })
    };

    const response = await fetch(`${this.baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Dify API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API error response:', errorText);
      throw new Error(`Dify API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('Dify API response:', data);
    return data;
  }
}

export const difyClient = new DifyClient();