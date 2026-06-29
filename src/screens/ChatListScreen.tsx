import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Appbar, FAB, Text, Surface, IconButton, Searchbar, useTheme, Divider,
} from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { Chat } from '@/types';
import type { RootStackParamList } from '@/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ChatListScreen() {
  const theme = useTheme();
  const nav = useNavigation<Nav>();
  const { chats, removeChat, settings, loadChats } = useApp();
  const [query, setQuery] = useState('');

  useFocusEffect(useCallback(() => { loadChats(); }, [loadChats]));

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  );

  const handleNew = () => {
    if (settings.hapticFeedback) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nav.navigate('Chat', { newChat: true });
  };

  const handleOpen = (chat: Chat) => {
    if (settings.hapticFeedback) Haptics.selectionAsync();
    nav.navigate('Chat', { chatId: chat.id });
  };

  const handleDelete = async (id: string) => {
    if (settings.hapticFeedback) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await removeChat(id);
  };

  const renderItem = ({ item }: { item: Chat }) => {
    const lastMsg = item.messages[item.messages.length - 1];
    return (
      <Surface
        style={[styles.chatItem, { backgroundColor: theme.colors.surface }]}
        elevation={0}
        onTouchEnd={() => handleOpen(item)}
      >
        <View style={styles.chatContent}>
          <View style={[styles.chatAvatar, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}>
              {item.title.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text variant="titleSmall" numberOfLines={1} style={[styles.chatTitle, { color: theme.colors.onSurface }]}>
                {item.title}
              </Text>
              <Text style={[styles.chatTime, { color: theme.colors.onSurfaceVariant }]}>
                {formatTime(item.updatedAt)}
              </Text>
            </View>
            {lastMsg && (
              <Text numberOfLines={1} style={[styles.chatPreview, { color: theme.colors.onSurfaceVariant }]}>
                {lastMsg.role === 'user' ? 'You: ' : ''}{lastMsg.content}
              </Text>
            )}
          </View>
          <IconButton
            icon="delete-outline"
            size={20}
            iconColor={theme.colors.error}
            onPress={() => handleDelete(item.id)}
          />
        </View>
      </Surface>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="AIDEPOR" titleStyle={{ fontWeight: '700' }} />
      </Appbar.Header>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search chats..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchbar}
        />
      </View>
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>No chats yet</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Tap + to start a new conversation</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        color={theme.colors.onPrimaryContainer}
        onPress={handleNew}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  searchbar: { elevation: 0 },
  chatItem: { paddingVertical: 4 },
  chatContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  chatAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  chatInfo: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatTitle: { flex: 1, marginRight: 8 },
  chatTime: { fontSize: 12 },
  chatPreview: { fontSize: 13, marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', right: 20, bottom: 20 },
});
