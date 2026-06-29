import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Surface, Chip, Searchbar, useTheme, Divider } from 'react-native-paper';
import { POPULAR_MODELS } from '@/constants/models';
import { AIModel } from '@/types';

interface Props {
  visible: boolean;
  selectedModel: string;
  onSelect: (modelId: string) => void;
  onDismiss: () => void;
}

export default function ModelSelector({ visible, selectedModel, onSelect, onDismiss }: Props) {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const filtered = POPULAR_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.id.toLowerCase().includes(query.toLowerCase()),
  );

  const freeModels = filtered.filter((m) => m.free);
  const paidModels = filtered.filter((m) => !m.free);

  const renderModel = (m: AIModel) => (
    <Surface
      key={m.id}
      style={[
        styles.modelCard,
        {
          backgroundColor:
            m.id === selectedModel ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
        },
      ]}
      elevation={0}
      onTouchEnd={() => { onSelect(m.id); onDismiss(); }}
    >
      <View style={styles.modelRow}>
        <Text
          style={[
            styles.modelName,
            { color: m.id === selectedModel ? theme.colors.onPrimaryContainer : theme.colors.onSurface },
          ]}
        >
          {m.name}
        </Text>
        {m.free && (
          <Chip compact style={[styles.freeChip, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Text style={{ color: theme.colors.onTertiaryContainer, fontSize: 10 }}>FREE</Text>
          </Chip>
        )}
      </View>
      <Text style={[styles.modelId, { color: theme.colors.onSurfaceVariant }]}>{m.id}</Text>
      {m.description && (
        <Text style={[styles.modelDesc, { color: theme.colors.onSurfaceVariant }]}>{m.description}</Text>
      )}
    </Surface>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
      >
        <Text variant="titleLarge" style={styles.title}>Select Model</Text>
        <Searchbar
          placeholder="Search models..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchbar}
        />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {freeModels.length > 0 && (
            <>
              <Text variant="labelMedium" style={[styles.sectionLabel, { color: theme.colors.primary }]}>FREE MODELS</Text>
              {freeModels.map(renderModel)}
              <Divider style={styles.divider} />
            </>
          )}
          {paidModels.length > 0 && (
            <>
              <Text variant="labelMedium" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>PREMIUM MODELS</Text>
              {paidModels.map(renderModel)}
            </>
          )}
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: { margin: 16, borderRadius: 28, padding: 20, maxHeight: '80%' },
  title: { marginBottom: 12 },
  searchbar: { marginBottom: 12 },
  list: { maxHeight: 500 },
  sectionLabel: { marginBottom: 8, marginTop: 4, fontWeight: '600' },
  modelCard: { borderRadius: 12, padding: 12, marginBottom: 8 },
  modelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  modelName: { fontWeight: '600', fontSize: 14, flex: 1 },
  modelId: { fontSize: 11, marginBottom: 2 },
  modelDesc: { fontSize: 12 },
  freeChip: { height: 20, marginLeft: 8 },
  divider: { marginVertical: 12 },
});
