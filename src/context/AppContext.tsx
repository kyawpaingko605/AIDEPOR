import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { Chat, AppSettings, ApiKeys } from '@/types';
import { getAllChats, saveChat, deleteChat, getSettings, saveSettings, getApiKeys, saveApiKeys } from '@/services/storage';
import { DEFAULT_MODEL_ID } from '@/constants/models';

interface AppContextValue {
  chats: Chat[];
  settings: AppSettings;
  apiKeys: ApiKeys;
  colorScheme: 'light' | 'dark';
  loadChats: () => Promise<void>;
  updateChat: (chat: Chat) => Promise<void>;
  removeChat: (id: string) => Promise<void>;
  updateSettings: (s: Partial<AppSettings>) => Promise<void>;
  updateApiKeys: (keys: ApiKeys) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    defaultModel: DEFAULT_MODEL_ID,
    theme: 'system',
    streamingEnabled: true,
    fontSize: 15,
    hapticFeedback: true,
  });
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});

  const colorScheme: 'light' | 'dark' =
    settings.theme === 'system'
      ? systemScheme === 'dark' ? 'dark' : 'light'
      : settings.theme;

  useEffect(() => {
    (async () => {
      const [loadedChats, loadedSettings, loadedKeys] = await Promise.all([
        getAllChats(),
        getSettings(),
        getApiKeys(),
      ]);
      setChats(loadedChats);
      setSettings(loadedSettings);
      setApiKeys(loadedKeys);
    })();
  }, []);

  const loadChats = useCallback(async () => {
    const loaded = await getAllChats();
    setChats(loaded);
  }, []);

  const updateChat = useCallback(async (chat: Chat) => {
    await saveChat(chat);
    setChats((prev) => {
      const idx = prev.findIndex((c) => c.id === chat.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = chat;
        return next.sort((a, b) => b.updatedAt - a.updatedAt);
      }
      return [chat, ...prev];
    });
  }, []);

  const removeChat = useCallback(async (id: string) => {
    await deleteChat(id);
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateSettings = useCallback(async (s: Partial<AppSettings>) => {
    await saveSettings(s);
    setSettings((prev) => ({ ...prev, ...s }));
  }, []);

  const updateApiKeys = useCallback(async (keys: ApiKeys) => {
    await saveApiKeys(keys);
    setApiKeys(keys);
  }, []);

  return (
    <AppContext.Provider value={{ chats, settings, apiKeys, colorScheme, loadChats, updateChat, removeChat, updateSettings, updateApiKeys }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
