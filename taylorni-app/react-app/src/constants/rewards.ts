import { LoyaltyTier } from '../types/rewards.types';

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    minPoints: 0,
    multiplier: 1,
    color: '#CD7F32',
    benefits: [
      'Earn 1 point per $1 spent',
      'Birthday bonus points',
      'Early sale access',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    minPoints: 500,
    multiplier: 1.25,
    color: '#C0C0C0',
    benefits: [
      'Earn 1.25 points per $1',
      'Free shipping on orders $50+',
      'Priority customer support',
      'Exclusive designer previews',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    minPoints: 1500,
    multiplier: 1.5,
    color: '#FFD700',
    benefits: [
      'Earn 1.5 points per $1',
      'Free shipping always',
      'VIP customer support',
      'Early access to new collections',
      '10% birthday discount',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minPoints: 5000,
    multiplier: 2,
    color: '#E5E4E2',
    benefits: [
      'Earn 2 points per $1',
      'Free express shipping',
      'Dedicated concierge',
      'Exclusive events & workshops',
      'Personal stylist consultation',
      'Special designer collaborations',
    ],
  },
];

export const POINTS_RULES = {
  PURCHASE: 1, // 1 point per $1
  REFERRAL: 500,
  REVIEW: 50,
  SOCIAL_SHARE: 25,
  PROFILE_COMPLETE: 100,
  FIRST_PURCHASE: 200,
  BIRTHDAY_BONUS: 300,
};

export const REDEMPTION_OPTIONS = [
  { points: 100, value: 5, type: 'discount' },
  { points: 250, value: 15, type: 'discount' },
  { points: 500, value: 30, type: 'discount' },
  { points: 1000, value: 75, type: 'discount' },
];
