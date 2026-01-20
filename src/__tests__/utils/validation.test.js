import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePasswordDifference,
  sanitizeInput,
} from "../../utils/validation";

describe("Validation Utils", () => {
  describe("validateEmail", () => {
    it("should validate correct email", () => {
      expect(validateEmail("admin@fosla.com")).toBe(true);
    });

    it("should reject invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("@fosla.com")).toBe(false);
      expect(validateEmail("admin@")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should validate password with minimum length", () => {
      expect(validatePassword("admin123", 6)).toBe(true);
    });

    it("should reject password below minimum length", () => {
      expect(validatePassword("admin", 6)).toBe(false);
    });

    it("should reject empty password", () => {
      expect(validatePassword("", 6)).toBe(false);
    });
  });

  describe("validatePasswordMatch", () => {
    it("should return true for matching passwords", () => {
      expect(validatePasswordMatch("password123", "password123")).toBe(true);
    });

    it("should return false for non-matching passwords", () => {
      expect(validatePasswordMatch("password123", "password456")).toBe(false);
    });
  });

  describe("validatePasswordDifference", () => {
    it("should return true for different passwords", () => {
      expect(validatePasswordDifference("oldpass", "newpass")).toBe(true);
    });

    it("should return false for same passwords", () => {
      expect(validatePasswordDifference("samepass", "samepass")).toBe(false);
    });
  });

  describe("sanitizeInput", () => {
    it("should trim whitespace", () => {
      expect(sanitizeInput("  admin@fosla.com  ")).toBe("admin@fosla.com");
    });

    it("should handle empty strings", () => {
      expect(sanitizeInput("   ")).toBe("");
    });
  });
});
