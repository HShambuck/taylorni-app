import axios from 'axios';
import {
  LoyaltyPoints,
  LoyaltyTier,
  Reward,
  PointsTransaction,
  ReferralData,
} from '../../types/rewards.types';
import { LOYALTY_TIERS, POINTS_RULES } from '../../constants/rewards';

class RewardsService {
  private apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.yourplatform.com';

  /**
   * Get user's loyalty points
   */
  async getLoyaltyPoints(userId: string): Promise<LoyaltyPoints> {
    try {
      const response = await axios.get(`${this.apiUrl}/rewards/points/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get loyalty points error:', error);
      throw error;
    }
  }

  /**
   * Get user's current tier
   */
  getCurrentTier(totalPoints: number): LoyaltyTier {
    return (
      [...LOYALTY_TIERS].reverse().find((tier) => totalPoints >= tier.minPoints) ||
      LOYALTY_TIERS[0]
    );
  }

  /**
   * Get next tier and progress
   */
  getNextTierProgress(totalPoints: number): {
    currentTier: LoyaltyTier;
    nextTier: LoyaltyTier | null;
    progress: number;
    pointsNeeded: number;
  } {
    const currentTier = this.getCurrentTier(totalPoints);
    const currentIndex = LOYALTY_TIERS.findIndex((t) => t.id === currentTier.id);
    const nextTier = LOYALTY_TIERS[currentIndex + 1] || null;

    if (!nextTier) {
      return {
        currentTier,
        nextTier: null,
        progress: 100,
        pointsNeeded: 0,
      };
    }

    const pointsNeeded = nextTier.minPoints - totalPoints;
    const tierRange = nextTier.minPoints - currentTier.minPoints;
    const progress = ((totalPoints - currentTier.minPoints) / tierRange) * 100;

    return {
      currentTier,
      nextTier,
      progress: Math.min(progress, 100),
      pointsNeeded: Math.max(pointsNeeded, 0),
    };
  }

  /**
   * Get available rewards
   */
  async getAvailableRewards(userId: string): Promise<Reward[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/rewards/available/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get rewards error:', error);
      return this.getMockRewards();
    }
  }

  /**
   * Redeem reward
   */
  async redeemReward(userId: string, rewardId: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/rewards/redeem`, {
        userId,
        rewardId,
      });
    } catch (error) {
      console.error('Redeem reward error:', error);
      throw error;
    }
  }

  /**
   * Get points transaction history
   */
  async getPointsHistory(userId: string): Promise<PointsTransaction[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/rewards/transactions/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Get points history error:', error);
      return [];
    }
  }

  /**
   * Award points for action
   */
  async awardPoints(
    userId: string,
    action: keyof typeof POINTS_RULES,
    metadata?: any
  ): Promise<number> {
    try {
      const points = POINTS_RULES[action];
      const response = await axios.post(`${this.apiUrl}/rewards/award`, {
        userId,
        action,
        points,
        metadata,
      });
      return response.data.pointsAwarded;
    } catch (error) {
      console.error('Award points error:', error);
      return 0;
    }
  }

  /**
   * Get referral data
   */
  async getReferralData(userId: string): Promise<ReferralData> {
    try {
      const response = await axios.get(`${this.apiUrl}/rewards/referrals/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get referral data error:', error);
      throw error;
    }
  }

  /**
   * Generate referral code
   */
  async generateReferralCode(userId: string): Promise<string> {
    try {
      const response = await axios.post(`${this.apiUrl}/rewards/referrals/generate`, {
        userId,
      });
      return response.data.code;
    } catch (error) {
      console.error('Generate referral code error:', error);
      throw error;
    }
  }

  /**
   * Apply referral code
   */
  async applyReferralCode(userId: string, code: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/rewards/referrals/apply`, {
        userId,
        code,
      });
    } catch (error) {
      console.error('Apply referral code error:', error);
      throw error;
    }
  }

  /**
   * Mock rewards for fallback
   */
  private getMockRewards(): Reward[] {
    return [
      {
        id: '1',
        title: '$5 Off Next Order',
        description: 'Get $5 off your next purchase',
        pointsCost: 100,
        type: 'discount',
        value: '$5',
      },
      {
        id: '2',
        title: '$15 Off',
        description: 'Save $15 on orders over $50',
        pointsCost: 250,
        type: 'discount',
        value: '$15',
      },
      {
        id: '3',
        title: 'Free Shipping',
        description: 'Free shipping on your next order',
        pointsCost: 150,
        type: 'freebie',
        value: 'Free Shipping',
      },
      {
        id: '4',
        title: 'VIP Early Access',
        description: 'Get 48h early access to new collections',
        pointsCost: 500,
        type: 'exclusive_access',
        value: 'Early Access',
      },
    ];
  }
}

export default new RewardsService();
