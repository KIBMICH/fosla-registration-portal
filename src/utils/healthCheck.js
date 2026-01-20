/**
 * Health Check Utility
 * Verify backend connection
 */

import { API_CONFIG } from '../config/api.config';

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is healthy:', data);
      return { success: true, data };
    } else {
      console.error('❌ Backend health check failed:', response.status);
      return { success: false, error: 'Backend is not responding' };
    }
  } catch (error) {
    console.error('❌ Backend connection error:', error);
    return { success: false, error: error.message };
  }
};

export const logApiConfig = () => {
  console.log('🔧 API Configuration:');
  console.log('  Base URL:', API_CONFIG.BASE_URL);
  console.log('  Timeout:', API_CONFIG.TIMEOUT, 'ms');
  console.log('  Environment:', import.meta.env.MODE);
};
