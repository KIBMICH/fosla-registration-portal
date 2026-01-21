// Authentication utilities
const AUTH_TOKEN_KEY = "adminToken";
const AUTH_EMAIL_KEY = "adminEmail";
const TOKEN_EXPIRY_KEY = "tokenExpiry";

/**
 * Set authentication token with expiry
 * @param {string} token - JWT token from backend
 * @param {string} email - Admin email
 * @param {number} expiresIn - Token expiry in seconds (default 24 hours)
 */
export const setAuthToken = (token, email, expiresIn = 86400) => {
  if (!token || typeof token !== 'string' || token === 'true') {
    console.error('Invalid token provided');
    return;
  }
  
  const expiryTime = Date.now() + (expiresIn * 1000);
  
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_EMAIL_KEY, email);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Get authentication token if valid and not expired
 * @returns {string|null} Valid token or null
 */
export const getAuthToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  // Check if token exists and is not the old "true" value
  if (!token || token === 'true') {
    clearAuth();
    return null;
  }
  
  // Check if token is expired
  if (expiry && Date.now() > parseInt(expiry)) {
    clearAuth();
    return null;
  }
  
  return token;
};

export const getAuthEmail = () => {
  return localStorage.getItem(AUTH_EMAIL_KEY) || "";
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Check if user is authenticated with valid token
 * @returns {boolean} True if authenticated with valid token
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return token !== null && token !== 'true';
};

/**
 * Get remaining token validity time in seconds
 * @returns {number} Seconds until token expires, or 0 if expired/invalid
 */
export const getTokenTimeRemaining = () => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return 0;
  
  const remaining = Math.max(0, parseInt(expiry) - Date.now());
  return Math.floor(remaining / 1000);
};
