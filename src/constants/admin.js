// Admin configuration and constants
export const ADMIN_CREDENTIALS = {
  email: "admin@fosla.com",
  password: "admin123", // Mock - should be backend-validated in production
};

export const ADMIN_TABS = {
  RECORDS: "records",
  VALIDATE: "validate",
  PASSWORD: "password",
};

export const MOCK_RECORDS = [
  {
    id: 1,
    firstName: "Aminu",
    surname: "Musa",
    sex: "Male",
    dob: "05/15/2010",
    age: 14,
    stateOfResidence: "Plateau",
    stateOfOrigin: "Plateau",
    position: "Midfielder",
    guardianName: "Fatima Bello",
    guardianPhone: "+234 801 234 5678",
    registeredDate: "2024-07-25",
    status: "Paid",
  },
  {
    id: 2,
    firstName: "Chioma",
    surname: "Okafor",
    sex: "Female",
    dob: "03/20/2011",
    age: 13,
    stateOfResidence: "Lagos",
    stateOfOrigin: "Enugu",
    position: "Forward",
    guardianName: "Mrs. Okafor",
    guardianPhone: "+234 802 345 6789",
    registeredDate: "2024-07-26",
    status: "Paid",
  },
  {
    id: 3,
    firstName: "Tunde",
    surname: "Adeyemi",
    sex: "Male",
    dob: "08/10/2010",
    age: 13,
    stateOfResidence: "Oyo",
    stateOfOrigin: "Oyo",
    position: "Goal-keeper",
    guardianName: "Mr. Adeyemi",
    guardianPhone: "+234 803 456 7890",
    registeredDate: "2024-07-27",
    status: "Pending",
  },
];

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
