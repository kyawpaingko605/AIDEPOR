import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, Text, useTheme, ActivityIndicator, Chip } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '@/context/AppContext';
import { Message, Chat } from '@/types';
import { sendMessage, generateChatTitle } from '@/services/ai';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import ModelSelector from '@/components/ModelSelector';
import type { RootStackParamList } from '@/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
  const theme = useTheme();
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { chats, updateChat, settings } = useApp();

  const [chat, setChat] = useState<Chat | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [modelSelectorVisible, setModelSelectorVisible] = useState(false);
  const listRef = useRef<FlatList>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load or create chat
  useEffect(() => {
    if (route.params?.chatId) {
      const found = chats.find((c) => c.id === route.params.chatId);
      if (found) setChat(found);
    } else if (route.params?.newChat) {
      setChat({
        id: uuidv4(),
        title: 'New Chat',
        messages: [],
        model: settings.defaultModel,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }, [route.params, settings.defaultModel]);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, []);

  const handleSend = useCallback(async (text: string) => {
    if (!chat || streaming) return;
    if (settings.hapticFeedback) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...chat.messages, userMsg];
    const newTitle = chat.messages.length === 0 ? generateChatTitle(text) : chat.title;
    const updatedChat: Chat = { ...chat, messages: updatedMessages, title: newTitle, updatedAt: Date.now() };
    setChat(updatedChat);
    await updateChat(updatedChat);

    setStreaming(true);
    setStreamingContent('');
    setTimeout(scrollToBottom, 100);

    const controller = new AbortController();
    abortRef.current = controller;

    let accumulated = '';
    try {
      await sendMessage(
        updatedMessages,
        chat.model,
        ({ content, done }) => {
          if (done) return;
          accumulated += content;
          setStreamingContent(accumulated);
          scrollToBottom();
        },
        controller.signal,
      );

      const assistantMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: accumulated || '(No response)',
        timestamp: Date.now(),
        model: chat.model,
      };
      const finalChat: Chat = {
        ...updatedChat,
        messages: [...updatedMessages, assistantMsg],
        updatedAt: Date.now(),
      };
      setChat(finalChat);
      await updateChat(finalChat);
      if (settings.hapticFeedback) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const errorMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `❌ Error: ${err.message}`,
        timestamp: Date.now(),
      };
      const errorChat: Chat = { ...updatedChat, messages: [...updatedMessages, errorMsg], updatedAt: Date.now() };
      setChat(errorChat);
      await updateChat(errorChat);
      if (settings.hapticFeedback) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setStreaming(false);
      setStreamingContent('');
      abortRef.current = null;
      scrollToBottom();
    }
  }, [chat, streaming, settings, updateChat, scrollToBottom]);

  const handleModelChange = useCallback(async (modelId: string) => {
    if (!chat) return;
    const updated: Chat = { ...chat, model: modelId, updatedAt: Date.now() };
    setChat(updated);
    await updateChat(updated);
  }, [chat, updateChat]);

  const messages = chat?.messages ?? [];
  const allMessages: Message[] = streaming && streamingContent
    ? [...messages, { id: 'streaming', role: 'assistant', content: streamingContent, timestamp: Date.now(), model: chat?.model }]
    : messages;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => nav.goBack()} />
        <Appbar.Content title={chat?.title ?? 'Chat'} titleStyle={styles.headerTitle} />
        <Chip
          icon="brain"
          compact
          onPress={() => setModelSelectorVisible(true)}
          style={{ backgroundColor: theme.colors.secondaryContainer }}
        >
          <Text style={{ fontSize: 11, color: theme.colors.onSecondaryContainer }}>
            {(chat?.model ?? '').split('/').pop()}
          </Text>
        </Chip>
      </Appbar.Header>

      <FlatList
        ref={listRef}
        data={allMessages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <ChatMessage message={item} fontSize={settings.fontSize} />}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={scrollToBottom}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: '700', marginBottom: 8 }}>AIDEPOR</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Start a conversation with AI</Text>
          </View>
        }
        ListFooterComponent={
          streaming && !streamingContent ? (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : null
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <ChatInput onSend={handleSend} disabled={streaming} hapticEnabled={settings.hapticFeedback} />
      </KeyboardAvoidingView>

      <ModelSelector
        visible={modelSelectorVisible}
        selectedModel={chat?.model ?? ''}
        onSelect={handleModelChange}
        onDismiss={() => setModelSelectorVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 16 },
  messageList: { paddingVertical: 16, paddingBottom: 8 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 120 },
  loadingIndicator: { paddingVertical: 12, alignItems: 'flex-start', paddingHorizontal: 24 },
});
