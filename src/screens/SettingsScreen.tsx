import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Appbar, Text, Surface, Switch, Divider, Button, Slider, useTheme, List,
} from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { clearAllChats } from '@/services/storage';

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, updateSettings, loadChats } = useApp();

  const handleClearHistory = () => {
    Alert.alert(
      'Clear All Chats',
      'This will permanently delete all chat history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await clearAllChats();
            await loadChats();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Settings" titleStyle={{ fontWeight: '700' }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Appearance */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Appearance</Text>

          <List.Item
            title="Theme"
            description={settings.theme === 'system' ? 'Follow system' : settings.theme === 'dark' ? 'Dark' : 'Light'}
            left={(p) => <List.Icon {...p} icon="theme-light-dark" />}
            right={() => (
              <View style={styles.themeToggle}>
                {(['light', 'system', 'dark'] as const).map((t) => (
                  <Button
                    key={t}
                    compact
                    mode={settings.theme === t ? 'contained' : 'outlined'}
                    onPress={() => updateSettings({ theme: t })}
                    style={styles.themeBtn}
                    labelStyle={{ fontSize: 11 }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ))}
              </View>
            )}
          />

          <Divider />
          <List.Item
            title={`Font Size (${settings.fontSize}px)`}
            left={(p) => <List.Icon {...p} icon="format-size" />}
          />
          <View style={styles.sliderRow}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>12</Text>
            <Slider
              style={styles.slider}
              minimumValue={12}
              maximumValue={20}
              step={1}
              value={settings.fontSize}
              onValueChange={(v) => updateSettings({ fontSize: Math.round(v) })}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.outlineVariant}
              thumbTintColor={theme.colors.primary}
            />
            <Text style={{ color: theme.colors.onSurfaceVariant }}>20</Text>
          </View>
        </Surface>

        {/* AI */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>AI</Text>

          <List.Item
            title="Streaming Responses"
            description="Show AI response as it generates"
            left={(p) => <List.Icon {...p} icon="lightning-bolt" />}
            right={() => (
              <Switch
                value={settings.streamingEnabled}
                onValueChange={(v) => updateSettings({ streamingEnabled: v })}
              />
            )}
          />
        </Surface>

        {/* Feedback */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>Feedback</Text>

          <List.Item
            title="Haptic Feedback"
            description="Vibrate on actions"
            left={(p) => <List.Icon {...p} icon="vibrate" />}
            right={() => (
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(v) => updateSettings({ hapticFeedback: v })}
              />
            )}
          />
        </Surface>

        {/* Data */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.error }]}>Data</Text>

          <Button
            mode="outlined"
            icon="delete-sweep"
            textColor={theme.colors.error}
            style={[styles.dangerBtn, { borderColor: theme.colors.error }]}
            onPress={handleClearHistory}
          >
            Clear All Chat History
          </Button>
        </Surface>

        {/* About */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>About</Text>
          <List.Item title="AIDEPOR" description="Version 1.0.0" left={(p) => <List.Icon {...p} icon="information" />} />
          <List.Item title="AI Platform" description="Powered by OpenRouter · 200+ models" left={(p) => <List.Icon {...p} icon="brain" />} />
          <List.Item title="Design" description="Material Design 3" left={(p) => <List.Icon {...p} icon="palette" />} />
        </Surface>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  section: { borderRadius: 16, padding: 8 },
  sectionTitle: { fontWeight: '700', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  themeToggle: { flexDirection: 'row', gap: 4 },
  themeBtn: { minWidth: 0 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  slider: { flex: 1 },
  dangerBtn: { margin: 8 },
});
