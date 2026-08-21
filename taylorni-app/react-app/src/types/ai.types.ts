export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    suggestions?: string[];
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  status: 'active' | 'resolved' | 'escalated';
  startedAt: Date;
  updatedAt: Date;
}

export interface AIIntent {
  name: string;
  confidence: number;
  parameters?: Record<string, any>;
}

export interface StyleRecommendation {
  id: string;
  type: 'outfit' | 'designer' | 'fabric';
  items: any[];
  reason: string;
  confidence: number;
  matchScore: number;
}
