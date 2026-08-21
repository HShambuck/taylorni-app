import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../../types/ai.types';
import styles from './styles';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.type === 'bot';

  return (
    <View
      style={[
        styles.bubbleContainer,
        isBot ? styles.botBubbleContainer : styles.userBubbleContainer,
      ]}
    >
      {isBot && (
        <View style={styles.botAvatarSmall}>
          <Ionicons name="sparkles" size={14} color="#fff" />
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <Text style={[styles.messageText, isBot && styles.botMessageText]}>
          {message.content}
        </Text>

        {/* Suggestions */}
        {message.metadata?.suggestions && (
          <View style={styles.suggestionsContainer}>
            {message.metadata.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

export default ChatBubble;
