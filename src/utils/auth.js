// Authentication utilities
const AUTH_TOKEN_KEY = "adminToken";
const AUTH_EMAIL_KEY = "adminEmail";

export const setAuthToken = (email) => {
  localStorage.setItem(AUTH_TOKEN_KEY, "true");
  localStorage.setItem(AUTH_EMAIL_KEY, email);
};

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getAuthEmail = () => {
  return localStorage.getItem(AUTH_EMAIL_KEY) || "";
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
