export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openrouter' | 'openai' | 'anthropic' | 'google';
  contextLength?: number;
  description?: string;
  free?: boolean;
}

export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  openrouter?: string;
}

export interface AppSettings {
  defaultModel: string;
  theme: 'light' | 'dark' | 'system';
  streamingEnabled: boolean;
  fontSize: number;
  hapticFeedback: boolean;
}
