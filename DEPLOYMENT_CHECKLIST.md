# Deployment Checklist

## Backend Configuration (IMPORTANT!)

Your backend is currently configured with CORS for `http://localhost:3001`. You need to update the backend CORS settings to allow your Vercel domain.

### Update Backend CORS

Add your Vercel domain to the allowed origins:
```javascript
// In your backend CORS configuration
const allowedOrigins = [
  'http://localhost:3001',
  'https://your-vercel-app.vercel.app',  // Add this
  'https://fosla-registration-portal.vercel.app'  // Or your custom domain
];
```

## Vercel Environment Variables

Set these in your Vercel project settings:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `VITE_API_BASE_URL` = `https://flosla-payment-api.onrender.com/api`
   - `VITE_API_TIMEOUT` = `30000`

## Paystack Configuration

### Backend Paystack Settings
Ensure your backend has:
- Paystack Secret Key
- Paystack Public Key
- Callback URL set to: `https://your-vercel-app.vercel.app/await-payment`

### Paystack Dashboard
1. Go to Paystack Dashboard → Settings → API Keys & Webhooks
2. Set Callback URL to your Vercel domain
3. Set Webhook URL (if using webhooks)

## Testing Checklist

- [ ] Backend health check works
- [ ] CORS allows your Vercel domain
- [ ] Registration form submits successfully
- [ ] Payment initialization works
- [ ] Paystack redirect works
- [ ] Payment callback returns to your app
- [ ] Receipt displays correctly
- [ ] Admin login works
- [ ] Admin can view registrations
- [ ] Admin can validate receipts
- [ ] Admin can change password
- [ ] CSV export works

## Common Issues

### 1. CORS Error
**Problem**: "Access to fetch has been blocked by CORS policy"
**Solution**: Update backend CORS to include your Vercel domain

### 2. Payment Not Completing
**Problem**: Payment succeeds but doesn't redirect back
**Solution**: Check Paystack callback URL matches your Vercel domain

### 3. API Timeout
**Problem**: Requests taking too long
**Solution**: Render.com free tier may sleep. First request wakes it up (takes ~30s)

### 4. Environment Variables Not Working
**Problem**: Still using localhost
**Solution**: Redeploy after setting environment variables in Vercel

## Post-Deployment

1. Test full registration flow
2. Test admin login with real credentials
3. Verify payment with small test amount
4. Check receipt generation
5. Test on mobile devices
6. Monitor error logs in Vercel

## Support

- Backend API: https://flosla-payment-api.onrender.com/api
- Health Check: https://flosla-payment-api.onrender.com/health
- Frontend: [Your Vercel URL]
