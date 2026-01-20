/**
 * Admin Service
 * Handles admin-related API calls
 */

import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class AdminService {
  /**
   * Admin login
   */
  async login(credentials) {
    try {
      const response = await apiService.post(API_ENDPOINTS.ADMIN.LOGIN, credentials);
      
      if (response.data?.token) {
        apiService.setAuthToken(response.data.token);
        // Store admin email for display
        localStorage.setItem('adminEmail', credentials.email);
      }
      
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
   * Admin register
   */
  async register(credentials) {
    try {
      const response = await apiService.post(API_ENDPOINTS.ADMIN.REGISTER, credentials);
      
      if (response.data?.token) {
        apiService.setAuthToken(response.data.token);
      }
      
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
   * Change password
   */
  async changePassword(passwordData) {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.ADMIN.CHANGE_PASSWORD,
        passwordData
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

  /**
   * Create event
   */
  async createEvent(eventData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.ADMIN.EVENTS, eventData);
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
   * Update event amount
   */
  async updateEventAmount(amountData) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.ADMIN.UPDATE_AMOUNT,
        amountData
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

  /**
   * Get all registrations with pagination
   */
  async getRegistrations(params = {}) {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADMIN.REGISTRATIONS, params);
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
   * Get registration by ID
   */
  async getRegistrationById(registrationId) {
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.ADMIN.REGISTRATIONS}/${registrationId}`
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

  /**
   * Get all payments with pagination
   */
  async getPayments(params = {}) {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADMIN.PAYMENTS, params);
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
   * Export records as CSV
   */
  async exportRecords(params = {}) {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADMIN.EXPORT, params);
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
   * Logout admin
   */
  logout() {
    apiService.setAuthToken(null);
    localStorage.removeItem('adminEmail');
  }

  /**
   * Check if admin is authenticated
   */
  isAuthenticated() {
    return !!apiService.getAuthToken();
  }
}

export default new AdminService();
