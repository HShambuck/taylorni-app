import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import chatbotService from '../../../services/ai/chatbotService';
import { Message } from '../../../types/ai.types';
import ChatBubble from './ChatBubble';
import QuickActions from './QuickActions';
import styles from './styles';

interface AIChatbotProps {
  userId: string;
  onClose: () => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ userId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState<string[]>([]);
  const sessionId = useRef(`session_${Date.now()}_${userId}`).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: "Hi! I'm your AI fashion assistant. How can I help you today? 👋",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Load quick actions
    const actions = await chatbotService.getQuickActions(userId);
    setQuickActions(actions);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatbotService.sendMessage(
        sessionId,
        userMessage,
        userId
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `user_${Date.now()}`,
          type: 'user',
          content: userMessage,
          timestamp: new Date(),
        },
        response,
      ]);

      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setInput(action);
    await handleSend();
  };

  const handleEndChat = async () => {
    await chatbotService.endSession(sessionId);
    onClose();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online 24/7</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleEndChat} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingIndicator}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      )}

      {/* Quick Actions */}
      {messages.length === 1 && quickActions.length > 0 && (
        <QuickActions actions={quickActions} onPress={handleQuickAction} />
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            !input.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!input.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={input.trim() ? '#fff' : '#ccc'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AIChatbot;
