import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Appbar, Text, Surface, TextInput, Button, Divider, useTheme, Switch, Chip,
} from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { ApiKeys } from '@/types';
import { POPULAR_MODELS, PROVIDER_LABELS } from '@/constants/models';

const PROVIDER_FIELDS: Array<{ key: keyof ApiKeys; label: string; placeholder: string }> = [
  { key: 'openrouter', label: 'OpenRouter API Key', placeholder: 'sk-or-...' },
  { key: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...' },
  { key: 'anthropic', label: 'Anthropic API Key', placeholder: 'sk-ant-...' },
  { key: 'google', label: 'Google AI API Key', placeholder: 'AIza...' },
];

export default function ModelsScreen() {
  const theme = useTheme();
  const { apiKeys, updateApiKeys, settings, updateSettings } = useApp();
  const [draft, setDraft] = useState<ApiKeys>(apiKeys);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateApiKeys(draft);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleShow = (key: string) => setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const freeModels = POPULAR_MODELS.filter((m) => m.free);
  const paidModels = POPULAR_MODELS.filter((m) => !m.free);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Models & API Keys" titleStyle={{ fontWeight: '700' }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* API Keys */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            API Keys (BYOK)
          </Text>
          <Text style={[styles.sectionDesc, { color: theme.colors.onSurfaceVariant }]}>
            Keys are stored locally on your device. OpenRouter is recommended — it gives access to 200+ models.
          </Text>
          {PROVIDER_FIELDS.map((field) => (
            <View key={field.key} style={styles.keyField}>
              <TextInput
                label={field.label}
                value={draft[field.key] ?? ''}
                onChangeText={(v) => setDraft((prev) => ({ ...prev, [field.key]: v }))}
                placeholder={field.placeholder}
                secureTextEntry={!showKeys[field.key]}
                right={
                  <TextInput.Icon
                    icon={showKeys[field.key] ? 'eye-off' : 'eye'}
                    onPress={() => toggleShow(field.key)}
                  />
                }
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          ))}
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            style={styles.saveBtn}
            icon={saved ? 'check' : 'content-save'}
          >
            {saved ? 'Saved!' : 'Save Keys'}
          </Button>
        </Surface>

        {/* Default Model */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Default Model
          </Text>
          <Text style={[styles.sectionDesc, { color: theme.colors.onSurfaceVariant }]}>
            Currently: <Text style={{ fontWeight: '700' }}>{settings.defaultModel.split('/').pop()}</Text>
          </Text>
        </Surface>

        {/* Free Models */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.tertiary }]}>
            Free Models
          </Text>
          <View style={styles.chipRow}>
            {freeModels.map((m) => (
              <Chip
                key={m.id}
                selected={settings.defaultModel === m.id}
                onPress={() => updateSettings({ defaultModel: m.id })}
                style={styles.chip}
                compact
              >
                {m.name}
              </Chip>
            ))}
          </View>
        </Surface>

        {/* Premium Models */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
            Premium Models
          </Text>
          <View style={styles.chipRow}>
            {paidModels.map((m) => (
              <Chip
                key={m.id}
                selected={settings.defaultModel === m.id}
                onPress={() => updateSettings({ defaultModel: m.id })}
                style={styles.chip}
                compact
              >
                {m.name}
              </Chip>
            ))}
          </View>
        </Surface>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  section: { borderRadius: 16, padding: 16 },
  sectionTitle: { fontWeight: '700', marginBottom: 4 },
  sectionDesc: { fontSize: 13, marginBottom: 12, lineHeight: 18 },
  keyField: { marginBottom: 12 },
  input: { backgroundColor: 'transparent' },
  saveBtn: { marginTop: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {},
});
