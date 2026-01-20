# Local Development Setup

## CORS Issue Fix

You're seeing a network error because your backend CORS is configured for `http://localhost:3001`, but Vite runs on a different port (5173, 5174, or 5175).

## Quick Fix (Recommended)

I've updated `vite.config.js` to run on port 3001 to match your backend CORS.

### Steps:

1. **Stop your current dev server** (Ctrl+C in terminal)

2. **Restart the dev server:**
   ```bash
   npm run dev
   ```

3. **Open your browser at:**
   ```
   http://localhost:3001
   ```

Your app should now work without CORS errors!

## Alternative: Update Backend CORS

If you prefer to keep Vite on its default port, update your backend CORS:

```javascript
// In your backend (server.js or app.js)
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:5173',  // Vite default
  'http://localhost:5174',
  'http://localhost:5175',
  'https://your-vercel-app.vercel.app'  // Production
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

## Testing the Connection

### 1. Check Backend Health
```bash
curl https://flosla-payment-api.onrender.com/health
```

Should return: `{"status":"ok"}`

### 2. Test in Browser Console
Open browser console (F12) and run:
```javascript
fetch('https://flosla-payment-api.onrender.com/api/events')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

If you see CORS error, backend needs updating.

## Common Issues

### Issue: "Network Error" when submitting form
**Cause**: CORS blocking the request
**Fix**: Use port 3001 or update backend CORS

### Issue: "Failed to fetch"
**Cause**: Backend might be sleeping (Render free tier)
**Fix**: Wait 30 seconds for backend to wake up, then retry

### Issue: Port 3001 already in use
**Cause**: Another app is using port 3001
**Fix**: 
```bash
# Windows - Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change port in vite.config.js to 3002
```

## Environment Files

- `.env` - Production backend URL
- `.env.local` - Local development (same as .env for now)
- `.env.example` - Template for team

## Development Workflow

1. Start dev server: `npm run dev`
2. Open: `http://localhost:3001`
3. Test registration flow
4. Check browser console for errors
5. Check Network tab for API calls

## Production vs Development

| Environment | URL | Port | CORS |
|-------------|-----|------|------|
| Development | http://localhost:3001 | 3001 | Must be in backend CORS |
| Production | https://your-app.vercel.app | N/A | Must be in backend CORS |

## Next Steps

1. ✅ Restart dev server on port 3001
2. ✅ Test registration form
3. ✅ Verify payment flow works
4. ✅ Test admin login
5. 🚀 Deploy to Vercel when ready

## Need Help?

- Backend not responding? Check: https://flosla-payment-api.onrender.com/health
- CORS errors? Update backend CORS configuration
- Port conflicts? Change port in vite.config.js
