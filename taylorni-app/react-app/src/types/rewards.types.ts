export interface LoyaltyPoints {
  total: number;
  available: number;
  pending: number;
  lifetime: number;
}

export interface LoyaltyTier {
  id: string;
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  minPoints: number;
  benefits: string[];
  multiplier: number;
  color: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freebie' | 'exclusive_access' | 'upgrade';
  value: string;
  expiresAt?: Date;
  imageUrl?: string;
}

export interface PointsTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired';
  points: number;
  description: string;
  relatedOrderId?: string;
  timestamp: Date;
}

export interface ReferralData {
  code: string;
  referrals: number;
  successfulReferrals: number;
  totalEarned: number;
  pendingRewards: number;
}
