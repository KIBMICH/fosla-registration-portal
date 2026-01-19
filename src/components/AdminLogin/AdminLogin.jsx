import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_CREDENTIALS, VALIDATION_MESSAGES } from "../../constants/admin";
import { validateEmail, sanitizeInput } from "../../utils/validation";
import { setAuthToken } from "../../utils/auth";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
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

    // Simulate API call - in production, send to backend
    setTimeout(() => {
      if (
        sanitizedEmail === ADMIN_CREDENTIALS.email &&
        sanitizedPassword === ADMIN_CREDENTIALS.password
      ) {
        setAuthToken(sanitizedEmail);
        navigate("/admin/dashboard");
      } else {
        setError(VALIDATION_MESSAGES.INVALID_CREDENTIALS);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/Public/fosla-logo.png.jpg"
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
