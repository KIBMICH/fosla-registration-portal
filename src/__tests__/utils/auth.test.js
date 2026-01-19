import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  setAuthToken,
  getAuthToken,
  getAuthEmail,
  clearAuth,
  isAuthenticated,
} from "../../utils/auth";

describe("Auth Utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("setAuthToken", () => {
    it("should set auth token and email in localStorage", () => {
      setAuthToken("admin@fosla.com");

      expect(getAuthToken()).toBe("true");
      expect(getAuthEmail()).toBe("admin@fosla.com");
    });
  });

  describe("getAuthToken", () => {
    it("should return token if set", () => {
      localStorage.setItem("adminToken", "true");
      expect(getAuthToken()).toBe("true");
    });

    it("should return null if not set", () => {
      expect(getAuthToken()).toBeNull();
    });
  });

  describe("getAuthEmail", () => {
    it("should return email if set", () => {
      localStorage.setItem("adminEmail", "admin@fosla.com");
      expect(getAuthEmail()).toBe("admin@fosla.com");
    });

    it("should return empty string if not set", () => {
      expect(getAuthEmail()).toBe("");
    });
  });

  describe("clearAuth", () => {
    it("should remove auth token and email", () => {
      setAuthToken("admin@fosla.com");
      clearAuth();

      expect(getAuthToken()).toBeNull();
      expect(getAuthEmail()).toBe("");
    });
  });

  describe("isAuthenticated", () => {
    it("should return true if authenticated", () => {
      setAuthToken("admin@fosla.com");
      expect(isAuthenticated()).toBe(true);
    });

    it("should return false if not authenticated", () => {
      expect(isAuthenticated()).toBe(false);
    });
  });
});
