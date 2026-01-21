# Security Notice

## Authentication

This application uses JWT-based authentication for admin access. All authentication is handled securely by the backend API.

## Security Features

- ✅ No credentials stored in frontend code
- ✅ JWT token-based authentication
- ✅ Token expiry tracking (24 hours)
- ✅ Automatic logout on token expiration
- ✅ Periodic authentication validation
- ✅ Secure token storage

## For Developers

### Authentication Flow
1. Admin logs in with credentials (validated by backend)
2. Backend returns JWT token
3. Token stored securely in localStorage
4. Token included in all admin API requests
5. Token validated on every request
6. Auto-logout when token expires

### Environment Variables
Required frontend environment variables:
```bash
VITE_API_BASE_URL=your-api-url
VITE_API_TIMEOUT=30000
VITE_ADMIN_TIMEOUT=60000
```

### Backend Requirements
The backend API must:
- Implement secure password hashing (bcrypt/argon2)
- Generate valid JWT tokens on login
- Verify JWT tokens on all admin endpoints
- Return proper token format in login response
- Implement rate limiting on authentication endpoints

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

**Email:** security@fosla.com (replace with your actual security contact)

**Do not** create public GitHub issues for security vulnerabilities.

## Security Best Practices

- Never commit `.env` files
- Use strong passwords (12+ characters)
- Enable HTTPS in production
- Implement rate limiting
- Monitor authentication logs
- Rotate JWT secrets regularly

---

**Last Updated:** January 2026
