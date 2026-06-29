import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import { Message } from '@/types';

interface Props {
  message: Message;
  fontSize: number;
}

export default function ChatMessage({ message, fontSize }: Props) {
  const theme = useTheme();
  const isUser = message.role === 'user';

  const markdownStyles = {
    body: {
      color: isUser ? '#FFFFFF' : theme.colors.onSurface,
      fontSize,
      lineHeight: fontSize * 1.5,
    },
    code_inline: {
      backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceVariant,
      color: isUser ? '#FFFFFF' : theme.colors.onSurface,
      borderRadius: 4,
      paddingHorizontal: 4,
      fontFamily: 'monospace',
      fontSize: fontSize - 1,
    },
    fence: {
      backgroundColor: isUser ? 'rgba(0,0,0,0.2)' : theme.colors.surfaceVariant,
      borderRadius: 8,
      padding: 12,
      marginVertical: 4,
    },
    code_block: {
      color: isUser ? '#FFFFFF' : theme.colors.onSurface,
      fontFamily: 'monospace',
      fontSize: fontSize - 1,
    },
  };

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.assistantWrapper]}>
      {!isUser && (
        <Surface style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
          <Text style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700', fontSize: 12 }}>AI</Text>
        </Surface>
      )}
      <Surface
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: theme.colors.primary }]
            : [styles.assistantBubble, { backgroundColor: theme.colors.surfaceVariant }],
        ]}
        elevation={0}
      >
        <Markdown style={markdownStyles as any}>{message.content}</Markdown>
        {message.model && !isUser && (
          <Text style={[styles.modelTag, { color: theme.colors.onSurfaceVariant }]}>
            {message.model.split('/').pop()}
          </Text>
        )}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  assistantWrapper: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  modelTag: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.6,
  },
});
