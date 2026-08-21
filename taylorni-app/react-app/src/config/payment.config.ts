export const PAYMENT_CONFIG = {
  // Stripe
  STRIPE: {
    PUBLIC_KEY: process.env.EXPO_PUBLIC_STRIPE_KEY || 'pk_test_...',
    API_VERSION: '2023-10-16',
  },

  // Paystack (Popular in Africa)
  PAYSTACK: {
    PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_KEY || 'pk_test_...',
    API_URL: 'https://api.paystack.co',
  },

  // Flutterwave (Multi-country support)
  FLUTTERWAVE: {
    PUBLIC_KEY: process.env.EXPO_PUBLIC_FLUTTERWAVE_KEY || 'FLWPUBK_TEST-...',
    API_URL: 'https://api.flutterwave.com/v3',
  },

  // Mobile Money Providers
  MOBILE_MONEY: {
    MTN: {
      enabled: true,
      minAmount: 1,
      maxAmount: 5000,
    },
    AIRTEL: {
      enabled: true,
      minAmount: 1,
      maxAmount: 5000,
    },
    VODAFONE: {
      enabled: true,
      minAmount: 1,
      maxAmount: 5000,
    },
  },

  // Escrow Settings
  ESCROW: {
    HOLD_PERIOD_DAYS: 7,
    AUTO_RELEASE_AFTER_DELIVERY: true,
    DISPUTE_WINDOW_DAYS: 14,
  },

  // Currency
  DEFAULT_CURRENCY: 'USD',
  SUPPORTED_CURRENCIES: ['USD', 'GHS', 'NGN', 'KES', 'ZAR'],

  // Fees
  PLATFORM_FEE_PERCENTAGE: 2.5,
  TRANSACTION_FEE: 0.5,
};
