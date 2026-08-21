export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'wallet' | 'bank';
  name: string;
  details: string;
  isDefault: boolean;
  provider?: string; // MTN, Airtel, Vodafone, etc.
  lastFour?: string;
  expiryDate?: string;
  logo?: string;
}

export interface WalletBalance {
  available: number;
  pending: number;
  currency: string;
}

export interface Transaction {
  id: string;
  type: 'debit' | 'credit' | 'refund' | 'escrow';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  orderId?: string;
  paymentMethod: PaymentMethod;
  timestamp: Date;
  reference: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  orderId: string;
  clientSecret?: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
}

export interface EscrowPayment {
  id: string;
  orderId: string;
  amount: number;
  status: 'held' | 'released' | 'refunded';
  releaseConditions: string[];
  heldUntil: Date;
}
