# Deploy Configuration for Vercel

## Environment Variables
Configure these in your Vercel dashboard:

### Required Variables
- `DATABASE_URL`: Your database connection string
- `SESSION_SECRET`: A secure random string for session encryption
- `NODE_ENV`: Set to "production"

### Optional Variables
- `PORT`: Will be set automatically by Vercel

## Build Settings
- Build Command: `npm run build`
- Output Directory: `dist/public`
- Install Command: `npm install`
- Development Command: `npm run dev`

## Domain Configuration
After deployment, you can:
1. Configure custom domain in Vercel dashboard
2. Set up SSL certificates (automatically handled by Vercel)
3. Configure environment-specific variables

## Database Setup
1. Use a serverless-compatible database (Neon, PlanetScale, Supabase)
2. Configure connection pooling for better performance
3. Run `npm run db:push` locally to create tables

## Performance Tips
- Static assets are automatically optimized by Vercel
- API routes are deployed as serverless functions
- Consider implementing caching for frequently accessed data

## Monitoring
- Check Vercel Analytics for performance metrics
- Monitor function execution times
- Set up error tracking if needed
