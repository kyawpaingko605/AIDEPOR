import { AIModel } from '@/types';

export const POPULAR_MODELS: AIModel[] = [
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'openrouter',
    contextLength: 128000,
    description: 'OpenAI\'s most capable multimodal model',
    free: false,
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openrouter',
    contextLength: 128000,
    description: 'Fast and affordable GPT-4 variant',
    free: false,
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'openrouter',
    contextLength: 200000,
    description: 'Anthropic\'s most intelligent model',
    free: false,
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'openrouter',
    contextLength: 200000,
    description: 'Fast and compact Claude model',
    free: false,
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    provider: 'openrouter',
    contextLength: 1000000,
    description: 'Google\'s long-context model',
    free: false,
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'openrouter',
    contextLength: 131072,
    description: 'Meta\'s powerful open-source model',
    free: false,
  },
  {
    id: 'mistralai/mistral-7b-instruct',
    name: 'Mistral 7B',
    provider: 'openrouter',
    contextLength: 32768,
    description: 'Efficient Mistral model',
    free: true,
  },
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi-3 Mini (Free)',
    provider: 'openrouter',
    contextLength: 128000,
    description: 'Microsoft\'s compact free model',
    free: true,
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B (Free)',
    provider: 'openrouter',
    contextLength: 8192,
    description: 'Google Gemma free tier',
    free: true,
  },
];

export const DEFAULT_MODEL_ID = 'openai/gpt-4o-mini';

export const PROVIDER_LABELS: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  openrouter: 'OpenRouter',
};
