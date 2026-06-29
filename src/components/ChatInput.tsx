import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, Keyboard } from 'react-native';
import { IconButton, useTheme, Surface } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  hapticEnabled?: boolean;
}

export default function ChatInput({ onSend, disabled, hapticEnabled = true }: Props) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(trimmed);
    setText('');
    Keyboard.dismiss();
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]} elevation={2}>
      <View style={[styles.inputRow, { backgroundColor: theme.colors.surfaceVariant, borderRadius: 28 }]}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: theme.colors.onSurface, fontSize: 15 }]}
          placeholder="Message..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={4000}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          editable={!disabled}
        />
        <IconButton
          icon={disabled ? 'stop-circle-outline' : 'send'}
          size={24}
          iconColor={text.trim() ? theme.colors.primary : theme.colors.onSurfaceVariant}
          onPress={handleSend}
          disabled={!text.trim() && !disabled}
          style={styles.sendBtn}
        />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 16,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sendBtn: {
    margin: 0,
  },
});
