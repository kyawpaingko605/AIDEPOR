import { Message } from '@/types';
import { getApiKeys } from './storage';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

export interface StreamChunk {
  content: string;
  done: boolean;
}

function getProviderFromModelId(modelId: string): 'openrouter' | 'openai' | 'anthropic' | 'google' {
  if (modelId.startsWith('openai/') || modelId.startsWith('gpt-')) return 'openrouter';
  if (modelId.startsWith('anthropic/') || modelId.startsWith('claude-')) return 'openrouter';
  if (modelId.startsWith('google/') || modelId.startsWith('gemini-')) return 'openrouter';
  return 'openrouter';
}

export async function sendMessage(
  messages: Message[],
  modelId: string,
  onChunk: (chunk: StreamChunk) => void,
  signal?: AbortSignal,
): Promise<void> {
  const apiKeys = await getApiKeys();

  const apiKey = apiKeys.openrouter;
  if (!apiKey) {
    throw new Error('OpenRouter API key is required. Please add it in the Models tab.');
  }

  const formattedMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aidepor.app',
      'X-Title': 'AIDEPOR',
    },
    body: JSON.stringify({
      model: modelId,
      messages: formattedMessages,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `API Error ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMsg = errorJson?.error?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Streaming not supported');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') {
        if (trimmed === 'data: [DONE]') {
          onChunk({ content: '', done: true });
        }
        continue;
      }
      if (trimmed.startsWith('data: ')) {
        try {
          const json = JSON.parse(trimmed.slice(6));
          const content = json.choices?.[0]?.delta?.content ?? '';
          if (content) {
            onChunk({ content, done: false });
          }
        } catch {}
      }
    }
  }

  onChunk({ content: '', done: true });
}

export async function fetchAvailableModels(apiKey: string): Promise<Array<{ id: string; name: string }>> {
  const response = await fetch(`${OPENROUTER_BASE}/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch models');
  const data = await response.json();
  return (data.data ?? []).map((m: any) => ({ id: m.id, name: m.name }));
}

export function generateChatTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim().slice(0, 60);
  return cleaned.length < firstMessage.trim().length ? `${cleaned}…` : cleaned;
}
