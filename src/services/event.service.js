/**
 * Event Service
 * Handles event-related API calls
 */

import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class EventService {
  /**
   * Get current event information
   */
  async getEventInfo() {
    try {
      const response = await apiService.get(API_ENDPOINTS.EVENTS);
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
   * Register for event
   */
  async registerForEvent(registrationData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.REGISTER, registrationData);
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

export default new EventService();
