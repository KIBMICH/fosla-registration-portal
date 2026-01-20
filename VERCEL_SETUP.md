# Vercel Deployment Setup

## Quick Deploy

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select "Fosla-Registration-Portal"

2. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `VITE_API_BASE_URL` | `https://flosla-payment-api.onrender.com/api` |
   | `VITE_API_TIMEOUT` | `30000` |

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

## Post-Deployment Steps

### 1. Update Backend CORS

Your backend needs to allow your Vercel domain. Update your backend CORS configuration:

```javascript
// In your backend (e.g., server.js or app.js)
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3001',
  'https://your-project.vercel.app',  // Add your Vercel URL
  'https://fosla-registration-portal.vercel.app'  // Or custom domain
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 2. Configure Paystack Callback

In your Paystack Dashboard:
1. Go to Settings → API Keys & Webhooks
2. Set Callback URL to: `https://your-project.vercel.app/await-payment`

### 3. Test Your Deployment

Visit your Vercel URL and test:
- [ ] Homepage loads
- [ ] Registration form works
- [ ] Payment initialization works
- [ ] Admin login works
- [ ] All images display correctly

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node version compatibility
- Check build logs in Vercel dashboard

### API Not Working
- Verify environment variables are set correctly
- Check backend CORS allows your Vercel domain
- Test backend health: `https://flosla-payment-api.onrender.com/health`

### Images Not Loading
- Ensure images are in `public` folder (lowercase)
- Check image paths start with `/` (e.g., `/fosla-logo.png.jpg`)

### Environment Variables Not Applied
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)
- Verify variables are set for "Production" environment

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update backend CORS to include custom domain

## Automatic Deployments

Vercel automatically deploys when you push to `main` branch:
- Push to GitHub → Vercel builds → Live in ~2 minutes

## Monitoring

- View deployment logs in Vercel dashboard
- Check Analytics for traffic
- Monitor Function logs for errors

## Support

- Vercel Docs: https://vercel.com/docs
- Backend API: https://flosla-payment-api.onrender.com/api
- GitHub Repo: https://github.com/KIBMICH/fosla-registration-portal
