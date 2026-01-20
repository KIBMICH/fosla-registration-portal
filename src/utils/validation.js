// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

export const validatePasswordMatch = (password1, password2) => {
  return password1 === password2;
};

export const validatePasswordDifference = (currentPassword, newPassword) => {
  return currentPassword !== newPassword;
};

export const sanitizeInput = (input) => {
  return input.trim();
};
