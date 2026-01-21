// Admin configuration and constants
// NOTE: Admin credentials are NEVER stored in frontend code
// All authentication is handled securely by the backend API

export const ADMIN_TABS = {
  RECORDS: "records",
  VALIDATE: "validate",
  PASSWORD: "password",
};

export const PASSWORD_MIN_LENGTH = 6;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: "All fields are required",
  PASSWORD_TOO_SHORT: `New password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_MISMATCH: "Passwords do not match",
  SAME_PASSWORD: "New password must be different from current password",
  INVALID_CREDENTIALS: "Invalid email or password",
  INCORRECT_PASSWORD: "Current password is incorrect",
  PASSWORD_CHANGED: "Password changed successfully",
  RECEIPT_NOT_FOUND: "Receipt not found",
};
