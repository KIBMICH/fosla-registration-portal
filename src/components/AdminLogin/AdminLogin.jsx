import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VALIDATION_MESSAGES } from "../../constants/admin";
import { validateEmail, sanitizeInput } from "../../utils/validation";
import { adminService } from "../../services";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [wakingUp, setWakingUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    // Show "waking up" message after 3 seconds
    const wakingUpTimer = setTimeout(() => {
      setWakingUp(true);
    }, 3000);

    try {
      const result = await adminService.login({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      clearTimeout(wakingUpTimer);

      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(result.error || VALIDATION_MESSAGES.INVALID_CREDENTIALS);
      }
    } catch (err) {
      clearTimeout(wakingUpTimer);
      
      // Check if it's a timeout error
      if (err.message && (err.message.includes('timeout') || err.message.includes('Timeout'))) {
        setError("Connection timeout. The server may be starting up. Please try again in a moment.");
      } else if (err.status === 408) {
        setError("Request timed out. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      setWakingUp(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/fosla-logo.png.jpg"
            alt="FOSLA Academy Logo"
            className="login-logo"
          />
          <h1>FOSLA ACADEMY</h1>
          <h2>Admin Login</h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              aria-label="Admin email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              aria-label="Admin password"
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {wakingUp && !error && (
            <div className="info-message" role="status">
              Logging in... This may take a moment.
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="btn-spinner"></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
