import { useState } from "react";
import { VALIDATION_MESSAGES } from "../../constants/admin";
import { adminService } from "../../services";
import "./ChangePassword.css";
import { validatePassword, validatePasswordMatch, validatePasswordDifference } from "../../utils/validation";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: VALIDATION_MESSAGES.REQUIRED_FIELDS });
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage({ type: "error", text: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT });
      return;
    }

    if (!validatePasswordMatch(newPassword, confirmPassword)) {
      setMessage({ type: "error", text: VALIDATION_MESSAGES.PASSWORDS_MISMATCH });
      return;
    }

    if (!validatePasswordDifference(currentPassword, newPassword)) {
      setMessage({ type: "error", text: VALIDATION_MESSAGES.SAME_PASSWORD });
      return;
    }

    setLoading(true);

    try {
      const result = await adminService.changePassword({
        currentPassword,
        newPassword,
      });

      if (result.success) {
        setMessage({ type: "success", text: VALIDATION_MESSAGES.PASSWORD_CHANGED });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Check if it's a timeout error
        if (result.error && (result.error.includes('timeout') || result.error.includes('Timeout'))) {
          setMessage({ 
            type: "warning", 
            text: "Request timed out, but password may have been changed. Please try logging in with your new password." 
          });
        } else {
          setMessage({ type: "error", text: result.error || VALIDATION_MESSAGES.INCORRECT_PASSWORD });
        }
      }
    } catch (err) {
      // Check if it's a timeout error
      if (err.message && (err.message.includes('timeout') || err.message.includes('Timeout'))) {
        setMessage({ 
          type: "warning", 
          text: "Request timed out, but password may have been changed. Please try logging in with your new password." 
        });
      } else {
        setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-container">
      <div className="password-card">
        <h2>Change Password</h2>
        <p>Update your admin account password</p>

        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              required
              aria-label="Current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
              aria-label="New password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
              aria-label="Confirm new password"
            />
          </div>

          {message && (
            <div className={`message ${message.type}`} role="alert">
              {message.type === "success" ? "✓" : message.type === "warning" ? "⚠" : "✗"} {message.text}
            </div>
          )}

          <button type="submit" className="change-btn" disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>

        <div className="password-info">
          <h4>Password Requirements:</h4>
          <ul>
            <li>Minimum 6 characters</li>
            <li>Must be different from current password</li>
            <li>Passwords must match</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
