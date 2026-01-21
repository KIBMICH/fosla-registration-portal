/**
 * API Service
 * Core HTTP client with interceptors and error handling
 */

import { API_CONFIG } from '../config/api.config';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Get auth token from localStorage
   * @returns {string|null} Valid token or null
   */
  getAuthToken() {
    const token = localStorage.getItem('authToken');
    
    // Reject old-style "true" tokens
    if (token === 'true' || !token) {
      return null;
    }
    
    return token;
  }

  /**
   * Set auth token in localStorage
   * @param {string|null} token - JWT token or null to remove
   */
  setAuthToken(token) {
    if (token && typeof token === 'string' && token !== 'true') {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Build headers with auth token if available
   */
  buildHeaders(customHeaders = {}) {
    const headers = { ...API_CONFIG.HEADERS, ...customHeaders };
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText || 'An error occurred',
      }));
      
      throw {
        status: response.status,
        message: error.message || error.error || error.msg || 'Request failed',
        data: error,
      };
    }
    
    return response.json();
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.buildHeaders(options.headers),
    };

    // Use custom timeout if provided, otherwise use default
    const timeout = options.timeout || this.timeout;
    
    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw {
          status: 408,
          message: 'Request timeout',
        };
      }
      
      if (error.status) {
        throw error;
      }
      
      throw {
        status: 0,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
