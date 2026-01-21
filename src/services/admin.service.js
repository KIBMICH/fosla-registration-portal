/**
 * Admin Service
 * Handles admin-related API calls
 */

import apiService from './api.service';
import { API_ENDPOINTS, API_CONFIG } from '../config/api.config';

class AdminService {
  /**
   * Admin login
   */
  async login(credentials) {
    try {
      // Validate credentials before sending
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email and password are required',
        };
      }

      // Use longer timeout for admin login (server may need to wake up)
      const response = await apiService.request(API_ENDPOINTS.ADMIN.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
        timeout: API_CONFIG.ADMIN_TIMEOUT,
      });
      
      // Validate response contains proper JWT token
      const token = response.data?.token || response.token;
      
      if (!token || typeof token !== 'string' || token === 'true') {
        return {
          success: false,
          error: 'Invalid authentication response from server',
        };
      }
      
      // Extract token expiry if provided (default 24 hours)
      const expiresIn = response.data?.expiresIn || response.expiresIn || 86400;
      
      // Store token securely
      apiService.setAuthToken(token);
      
      // Store admin email for display (using auth utility for consistency)
      const { setAuthToken } = await import('../utils/auth');
      setAuthToken(token, credentials.email, expiresIn);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed',
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
      // Use extra long timeout for password change (bcrypt hashing is slow)
      const response = await apiService.request(
        API_ENDPOINTS.ADMIN.CHANGE_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify(passwordData),
          timeout: API_CONFIG.LONG_TIMEOUT, // 120 seconds
        }
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
