import axios from 'axios';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  PaymentMethod,
  PaymentIntent,
  WalletBalance,
  Transaction,
  EscrowPayment,
} from '../../types/payment.types';
import { PAYMENT_CONFIG } from '../../config/payment.config';

class PaymentService {
  private apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.yourplatform.com';

  /**
   * Initialize payment intent
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    orderId: string,
    metadata?: any
  ): Promise<PaymentIntent> {
    try {
      const response = await axios.post(`${this.apiUrl}/payments/intents`, {
        amount,
        currency,
        orderId,
        metadata,
      });

      return response.data;
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw error;
    }
  }

  /**
   * Process card payment via Stripe
   */
  async processCardPayment(
    intentId: string,
    cardDetails: any,
    billingDetails: any
  ): Promise<boolean> {
    try {
      // Verify biometric authentication
      await this.verifyBiometric();

      const response = await axios.post(`${this.apiUrl}/payments/card/process`, {
        intentId,
        cardDetails,
        billingDetails,
      });

      return response.data.success;
    } catch (error) {
      console.error('Card payment error:', error);
      throw error;
    }
  }

  /**
   * Process mobile money payment (Paystack/Flutterwave)
   */
  async processMobileMoneyPayment(
    intentId: string,
    phoneNumber: string,
    provider: 'MTN' | 'AIRTEL' | 'VODAFONE',
    network: string
  ): Promise<{ reference: string; authUrl?: string }> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/payments/mobile-money/process`,
        {
          intentId,
          phoneNumber,
          provider,
          network,
        }
      );

      return {
        reference: response.data.reference,
        authUrl: response.data.authorization_url,
      };
    } catch (error) {
      console.error('Mobile money payment error:', error);
      throw error;
    }
  }

  /**
   * Verify mobile money payment status
   */
  async verifyMobileMoneyPayment(reference: string): Promise<Transaction> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/payments/mobile-money/verify/${reference}`
      );

      return response.data;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(userId: string): Promise<WalletBalance> {
    try {
      const response = await axios.get(`${this.apiUrl}/wallet/${userId}/balance`);
      return response.data;
    } catch (error) {
      console.error('Get wallet balance error:', error);
      throw error;
    }
  }

  /**
   * Process wallet payment
   */
  async processWalletPayment(
    userId: string,
    intentId: string,
    pin: string
  ): Promise<boolean> {
    try {
      // Verify biometric
      await this.verifyBiometric();

      const response = await axios.post(`${this.apiUrl}/payments/wallet/process`, {
        userId,
        intentId,
        pin: await this.hashPin(pin),
      });

      return response.data.success;
    } catch (error) {
      console.error('Wallet payment error:', error);
      throw error;
    }
  }

  /**
   * Add funds to wallet
   */
  async addFundsToWallet(
    userId: string,
    amount: number,
    paymentMethodId: string
  ): Promise<Transaction> {
    try {
      const response = await axios.post(`${this.apiUrl}/wallet/${userId}/add-funds`, {
        amount,
        paymentMethodId,
      });

      return response.data;
    } catch (error) {
      console.error('Add funds error:', error);
      throw error;
    }
  }

  /**
   * Withdraw from wallet
   */
  async withdrawFromWallet(
    userId: string,
    amount: number,
    destinationId: string
  ): Promise<Transaction> {
    try {
      await this.verifyBiometric();

      const response = await axios.post(`${this.apiUrl}/wallet/${userId}/withdraw`, {
        amount,
        destinationId,
      });

      return response.data;
    } catch (error) {
      console.error('Withdraw error:', error);
      throw error;
    }
  }

  /**
   * Create escrow payment
   */
  async createEscrow(
    orderId: string,
    amount: number,
    releaseConditions: string[]
  ): Promise<EscrowPayment> {
    try {
      const response = await axios.post(`${this.apiUrl}/payments/escrow/create`, {
        orderId,
        amount,
        releaseConditions,
      });

      return response.data;
    } catch (error) {
      console.error('Create escrow error:', error);
      throw error;
    }
  }

  /**
   * Release escrow payment
   */
  async releaseEscrow(escrowId: string, releasedBy: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/payments/escrow/${escrowId}/release`, {
        releasedBy,
      });
    } catch (error) {
      console.error('Release escrow error:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(
    userId: string,
    limit: number = 50
  ): Promise<Transaction[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/payments/transactions/${userId}?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Get transaction history error:', error);
      return [];
    }
  }

  /**
   * Get saved payment methods
   */
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/payments/methods/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get payment methods error:', error);
      return [];
    }
  }

  /**
   * Add payment method
   */
  async addPaymentMethod(
    userId: string,
    methodData: Partial<PaymentMethod>
  ): Promise<PaymentMethod> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/payments/methods/${userId}`,
        methodData
      );
      return response.data;
    } catch (error) {
      console.error('Add payment method error:', error);
      throw error;
    }
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(userId: string, methodId: string): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/payments/methods/${userId}/${methodId}`);
    } catch (error) {
      console.error('Delete payment method error:', error);
      throw error;
    }
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(
    userId: string,
    methodId: string
  ): Promise<void> {
    try {
      await axios.put(`${this.apiUrl}/payments/methods/${userId}/${methodId}/default`);
    } catch (error) {
      console.error('Set default payment method error:', error);
      throw error;
    }
  }

  /**
   * Verify biometric authentication
   */
  private async verifyBiometric(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return true; // Skip if not available
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to confirm payment',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric verification error:', error);
      return false;
    }
  }

  /**
   * Hash PIN for security
   */
  private async hashPin(pin: string): Promise<string> {
    // In production, use proper crypto hashing
    return Buffer.from(pin).toString('base64');
  }

  /**
   * Calculate platform fee
   */
  calculatePlatformFee(amount: number): number {
    const percentageFee = amount * (PAYMENT_CONFIG.PLATFORM_FEE_PERCENTAGE / 100);
    return percentageFee + PAYMENT_CONFIG.TRANSACTION_FEE;
  }

  /**
   * Calculate total with fee
   */
  calculateTotalWithFee(amount: number): number {
    return amount + this.calculatePlatformFee(amount);
  }
}

export default new PaymentService();
