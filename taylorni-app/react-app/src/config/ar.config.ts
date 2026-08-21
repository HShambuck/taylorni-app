export const AR_CONFIG = {
  // Banuba Face AR SDK (for accessories, makeup)
  BANUBA: {
    TOKEN: process.env.EXPO_PUBLIC_BANUBA_TOKEN || 'your_banuba_token',
    API_URL: 'https://api.banuba.com/v1',
  },
  
  // Vue.ai Virtual Try-On (for clothing)
  VUE_AI: {
    API_KEY: process.env.EXPO_PUBLIC_VUE_AI_KEY || 'your_vue_ai_key',
    API_URL: 'https://api.vue.ai/v1/virtual-tryon',
  },
  
  // Tryolabs Virtual Try-On (alternative)
  TRYOLABS: {
    API_KEY: process.env.EXPO_PUBLIC_TRYOLABS_KEY || 'your_tryolabs_key',
    API_URL: 'https://api.tryolabs.com/v1',
  },

  // Settings
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 2048,
  TIMEOUT: 30000,
};

export const GARMENT_CATEGORIES = {
  UPPER_BODY: ['shirt', 'blouse', 'jacket', 'coat', 'dress'],
  LOWER_BODY: ['pants', 'skirt', 'shorts'],
  FULL_BODY: ['dress', 'jumpsuit', 'overall'],
  ACCESSORIES: ['hat', 'glasses', 'jewelry', 'scarf'],
};
