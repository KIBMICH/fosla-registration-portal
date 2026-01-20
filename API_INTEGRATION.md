# API Integration Guide

## Overview
This frontend is fully integrated with the backend API using a clean service layer architecture.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_API_TIMEOUT=30000
```

For production deployment (Vercel), set these environment variables in your project settings.

## Service Architecture

### Core Services

1. **API Service** (`src/services/api.service.js`)
   - Base HTTP client
   - Authentication token management
   - Error handling
   - Request/response interceptors

2. **Event Service** (`src/services/event.service.js`)
   - Get event information
   - Register for events

3. **Payment Service** (`src/services/payment.service.js`)
   - Initialize Paystack payment
   - Get receipt by reference
   - Verify receipt

4. **Admin Service** (`src/services/admin.service.js`)
   - Admin authentication
   - Change password
   - Get registrations (with pagination)
   - Get payments
   - Export records as CSV

## API Endpoints Used

### Public Endpoints
- `GET /health` - Health check
- `GET /events` - Get current event info
- `POST /events/register` - Register for event
- `POST /payments/initialize` - Initialize payment
- `GET /receipts/:reference` - Get receipt
- `GET /receipts/verify/:reference` - Verify receipt

### Admin Endpoints (Requires Authentication)
- `POST /admin/login` - Admin login
- `POST /admin/register` - Admin registration
- `POST /admin/change-password` - Change password
- `POST /admin/events` - Create event
- `PUT /admin/events/amount` - Update event amount
- `GET /admin/registrations` - Get all registrations
- `GET /admin/registrations/:id` - Get registration by ID
- `GET /admin/payments` - Get all payments
- `GET /admin/export` - Export records as CSV

## Authentication Flow

1. Admin logs in via `/admin/login`
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is automatically included in subsequent requests
5. On logout, token is removed

## Payment Flow

1. User fills registration form
2. Frontend calls `/events/register`
3. Backend returns `registrationId` and `reference`
4. Frontend calls `/payments/initialize` with registration data
5. Backend returns Paystack `authorization_url`
6. User is redirected to Paystack
7. After payment, Paystack redirects back with `?reference=XXX&status=success`
8. Frontend verifies payment and shows receipt

## Error Handling

All services return a consistent response format:

```javascript
{
  success: boolean,
  data?: any,
  error?: string
}
```

Components handle errors gracefully with user-friendly messages.

## Testing Backend Connection

Use the health check utility:

```javascript
import { checkBackendHealth, logApiConfig } from './utils/healthCheck';

// Check if backend is reachable
const health = await checkBackendHealth();

// Log current API configuration
logApiConfig();
```

## Development vs Production

- **Development**: Uses `http://localhost:3000/api`
- **Production**: Uses environment variable `VITE_API_BASE_URL`

## Security Features

- JWT token authentication
- Input sanitization
- HTTPS in production
- Token stored in localStorage (consider httpOnly cookies for enhanced security)
- Request timeout protection
- CORS handling

## Troubleshooting

### Backend not reachable
1. Check `.env` file has correct URL
2. Verify backend is running
3. Check CORS settings on backend
4. Open browser console for detailed errors

### Authentication issues
1. Clear localStorage
2. Check token expiration on backend
3. Verify credentials

### Payment not completing
1. Check Paystack configuration on backend
2. Verify callback URL is set correctly
3. Check network tab for failed requests

## Next Steps

1. Update `.env` with your actual backend URL
2. Test all flows end-to-end
3. Configure Paystack callback URL in Paystack dashboard
4. Set up environment variables in Vercel
5. Test production deployment
