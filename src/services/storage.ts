import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat, AppSettings, ApiKeys } from '@/types';

const KEYS = {
  CHATS: 'aidepor_chats',
  SETTINGS: 'aidepor_settings',
  API_KEYS: 'aidepor_api_keys',
};

// ─── Chats ───────────────────────────────────────────────────────────────────

export async function getAllChats(): Promise<Chat[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.CHATS);
    if (!raw) return [];
    const chats: Chat[] = JSON.parse(raw);
    return chats.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export async function getChatById(id: string): Promise<Chat | null> {
  const chats = await getAllChats();
  return chats.find((c) => c.id === id) ?? null;
}

export async function saveChat(chat: Chat): Promise<void> {
  const chats = await getAllChats();
  const idx = chats.findIndex((c) => c.id === chat.id);
  if (idx >= 0) {
    chats[idx] = chat;
  } else {
    chats.push(chat);
  }
  await AsyncStorage.setItem(KEYS.CHATS, JSON.stringify(chats));
}

export async function deleteChat(id: string): Promise<void> {
  const chats = await getAllChats();
  const filtered = chats.filter((c) => c.id !== id);
  await AsyncStorage.setItem(KEYS.CHATS, JSON.stringify(filtered));
}

export async function clearAllChats(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.CHATS);
}

// ─── Settings ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  defaultModel: 'openai/gpt-4o-mini',
  theme: 'system',
  streamingEnabled: true,
  fontSize: 15,
  hapticFeedback: true,
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

export async function getApiKeys(): Promise<ApiKeys> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.API_KEYS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function saveApiKeys(keys: ApiKeys): Promise<void> {
  await AsyncStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
}

export async function clearApiKeys(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.API_KEYS);
}
