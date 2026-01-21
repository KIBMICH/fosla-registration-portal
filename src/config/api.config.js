/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://flosla-payment-api.onrender.com/api',
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
  ADMIN_TIMEOUT: import.meta.env.VITE_ADMIN_TIMEOUT || 60000, // 60 seconds for admin (server wake-up time)
  LONG_TIMEOUT: import.meta.env.VITE_LONG_TIMEOUT || 120000, // 120 seconds for slow operations
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Public endpoints
  HEALTH: '/health',
  EVENTS: '/events',
  REGISTER: '/events/register',
  INITIALIZE_PAYMENT: '/payments/initialize',
  VERIFY_PAYMENT: '/payments/verify',
  RECEIPTS: '/receipts',
  VERIFY_RECEIPT: '/receipts/verify',

  // Admin endpoints
  ADMIN: {
    REGISTER: '/admin/register',
    LOGIN: '/admin/login',
    CHANGE_PASSWORD: '/admin/change-password',
    EVENTS: '/admin/events',
    UPDATE_AMOUNT: '/admin/events/amount',
    REGISTRATIONS: '/admin/registrations',
    PAYMENTS: '/admin/payments',
    EXPORT: '/admin/export',
  },
};
