import axios from 'axios';
import { Message, AIIntent, ChatSession } from '../../types/ai.types';

class ChatbotService {
  private apiUrl = process.env.EXPO_PUBLIC_AI_API_URL || 'https://api.yourplatform.com/ai';
  private sessions: Map<string, ChatSession> = new Map();

  /**
   * Send message to AI chatbot
   */
  async sendMessage(
    sessionId: string,
    message: string,
    userId: string
  ): Promise<Message> {
    try {
      // First, detect intent locally for instant feedback
      const intent = await this.detectIntent(message);

      // Get or create session
      let session = this.sessions.get(sessionId);
      if (!session) {
        session = this.createSession(sessionId, userId);
      }

      // Add user message
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        type: 'user',
        content: message,
        timestamp: new Date(),
      };

      session.messages.push(userMessage);

      // Get bot response
      const response = await axios.post(`${this.apiUrl}/chat`, {
        sessionId,
        message,
        intent,
        context: this.getContext(session),
      });

      const botMessage: Message = {
        id: response.data.messageId,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date(),
        metadata: {
          intent: response.data.intent,
          confidence: response.data.confidence,
          suggestions: response.data.suggestions,
        },
      };

      session.messages.push(botMessage);
      session.updatedAt = new Date();

      return botMessage;
    } catch (error) {
      console.error('Chatbot error:', error);
      return this.getFallbackResponse();
    }
  }

  /**
   * Detect user intent from message
   */
  private async detectIntent(message: string): Promise<AIIntent> {
    const lowerMessage = message.toLowerCase();

    // Pattern matching for common intents
    const intentPatterns = {
      order_status: /track|order|delivery|shipping|where.*is/,
      designer_search: /find.*designer|looking for|recommend.*designer/,
      style_advice: /style|outfit|wear|match|look/,
      payment: /payment|pay|card|money|wallet/,
      complaint: /problem|issue|complaint|not working|broken/,
      greeting: /hi|hello|hey|good morning|good evening/,
    };

    for (const [intent, pattern] of Object.entries(intentPatterns)) {
      if (pattern.test(lowerMessage)) {
        return {
          name: intent,
          confidence: 0.85,
        };
      }
    }

    return {
      name: 'general_inquiry',
      confidence: 0.5,
    };
  }

  /**
   * Create new chat session
   */
  private createSession(sessionId: string, userId: string): ChatSession {
    const session: ChatSession = {
      id: sessionId,
      userId,
      messages: [],
      status: 'active',
      startedAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get conversation context
   */
  private getContext(session: ChatSession): any {
    return {
      messageCount: session.messages.length,
      recentTopics: this.extractTopics(session.messages.slice(-5)),
      duration: Date.now() - session.startedAt.getTime(),
    };
  }

  /**
   * Extract topics from recent messages
   */
  private extractTopics(messages: Message[]): string[] {
    const topics: string[] = [];
    messages.forEach((msg) => {
      if (msg.metadata?.intent) {
        topics.push(msg.metadata.intent);
      }
    });
    return [...new Set(topics)];
  }

  /**
   * Get fallback response when AI fails
   */
  private getFallbackResponse(): Message {
    return {
      id: `fallback_${Date.now()}`,
      type: 'bot',
      content: "I'm having trouble understanding. Let me connect you with a human agent who can help better.",
      timestamp: new Date(),
      metadata: {
        intent: 'fallback',
        confidence: 1.0,
        suggestions: ['Talk to agent', 'Try again', 'Browse FAQ'],
      },
    };
  }

  /**
   * Get quick action suggestions based on context
   */
  async getQuickActions(userId: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/quick-actions`, {
        params: { userId },
      });
      return response.data.actions;
    } catch (error) {
      return [
        'Track my order',
        'Find a designer',
        'Get style advice',
        'Contact support',
      ];
    }
  }

  /**
   * End chat session
   */
  async endSession(sessionId: string, rating?: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'resolved';
      await axios.post(`${this.apiUrl}/sessions/${sessionId}/end`, {
        rating,
        duration: Date.now() - session.startedAt.getTime(),
        messageCount: session.messages.length,
      });
      this.sessions.delete(sessionId);
    }
  }
}

export default new ChatbotService();
