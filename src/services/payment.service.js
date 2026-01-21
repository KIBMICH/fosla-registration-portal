/**
 * Payment Service
 * Handles payment-related API calls
 */

import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class PaymentService {
  /**
   * Initialize payment with Paystack
   */
  async initializePayment(paymentData) {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.INITIALIZE_PAYMENT,
        paymentData
      );
      
      // Handle different response structures
      const responseData = response.data || response;
      
      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get receipt by reference
   */
  async getReceipt(reference) {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.RECEIPTS}/${reference}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verify payment status by reference
   */
  async verifyPayment(reference) {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.VERIFY_PAYMENT}?reference=${reference}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verify receipt by reference
   */
  async verifyReceipt(reference) {
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.VERIFY_RECEIPT}/${reference}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new PaymentService();
