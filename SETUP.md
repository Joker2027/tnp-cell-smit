# Setup and Deployment Guide

## Quick Start (Development)

### 1. Install Dependencies
```powershell
npm install
```

### 2. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy the entire contents of `supabase/schema.sql`
5. Paste and run it in the SQL Editor
6. Verify tables are created in **Table Editor**

### 3. Configure Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find your credentials in Supabase: **Settings → API**

### 4. Run Development Server
```powershell
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## First Login

### Create Test Users

Since this uses email OTP, you need to:

1. **Enable Email Auth in Supabase**
   - Go to **Authentication → Providers**
   - Enable Email provider
   - For development, enable "Confirm email" = OFF

2. **Test Login**
   - Go to login page
   - Select role (Student/Teacher/HOD)
   - Enter your email
   - Check email for OTP code
   - Enter OTP to login

3. **Update User Role** (if needed)
   - Go to Supabase **Authentication → Users**
   - Find your user
   - Go to **Table Editor → profiles**
   - Update the `role` field manually

### Create Sample Data

You can use the Supabase Table Editor to manually create:

**Teacher:**
```sql
INSERT INTO teachers (user_id, employee_id, department, designation)
VALUES ('your-user-id', 'EMP001', 'CSE', 'Assistant Professor');
```

**Student:**
```sql
INSERT INTO students (user_id, enrollment_number, semester, section, department)
VALUES ('your-user-id', '190101001', 6, 'A', 'CSE');
```

## Email Configuration (Production)

### Configure SMTP Settings

For production, set up custom SMTP in Supabase:

1. Go to **Settings → Auth → SMTP Settings**
2. Enable "Custom SMTP"
3. Configure with your email provider (Gmail, SendGrid, etc.)

### Example with Gmail:
- Host: smtp.gmail.com
- Port: 587
- Username: your-email@gmail.com
- Password: your-app-password

### Email Templates

Customize email templates in **Authentication → Email Templates**:

**OTP Template:**
```html
<h2>Your Login Code</h2>
<p>Use this code to login: <strong>{{ .Token }}</strong></p>
<p>This code expires in 60 minutes.</p>
```

**NOC Approval Email** (requires Edge Function):
```html
<h2>NOC Approved!</h2>
<p>Dear Student,</p>
<p>Your NOC for {{ .CompanyName }} has been approved.</p>
<p>Internship Duration: {{ .Duration }} weeks</p>
```

## Deployment to Vercel

### 1. Push to GitHub

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Add Environment Variables

In Vercel dashboard, add:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. Deploy

Click "Deploy" and wait for build to complete.

### 5. Update Supabase CORS

In Supabase, go to **Settings → API → CORS**:
- Add your Vercel URL: `https://your-app.vercel.app`

## Production Checklist

- [ ] Supabase project in production mode
- [ ] Email OTP configured (custom SMTP recommended)
- [ ] Environment variables set in Vercel
- [ ] CORS configured in Supabase
- [ ] RLS policies enabled on all tables
- [ ] Email templates customized
- [ ] Test all three roles (Student, Teacher, HOD)
- [ ] Test complete workflow:
  - [ ] Student profile creation
  - [ ] Internship submission
  - [ ] NOC application
  - [ ] Mentor approval
  - [ ] HOD approval
  - [ ] Evaluation upload
  - [ ] Grade viewing

## Database Backup

### Automated Backups

Supabase Pro plan includes:
- Daily automated backups
- Point-in-time recovery
- Up to 7 days retention

### Manual Backup

```powershell
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Backup database
supabase db dump -f backup.sql
```

## Troubleshooting

### "Cannot find module" errors
```powershell
rm -rf node_modules package-lock.json
npm install
```

### Email OTP not received
- Check spam folder
- Verify email provider settings in Supabase
- Check Supabase logs: **Logs → Auth Logs**

### RLS policy errors
- Ensure user role is set correctly in `profiles` table
- Check if user is authenticated
- Review RLS policies in `supabase/schema.sql`

### Build errors on Vercel
- Check Node.js version (18+)
- Verify environment variables
- Check build logs for specific errors

## Performance Optimization

### Enable Caching

Add to `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['supabase.co'],
  },
  experimental: {
    optimizeCss: true,
  },
  swcMinify: true,
};
```

### Database Indexes

Already included in schema:
- Student user_id, mentor_id
- Teacher user_id
- Internship student_id
- NOC status, student_id
- Evaluation student_id

### CDN Configuration

Vercel automatically provides:
- Global CDN
- Edge caching
- Automatic HTTPS

## Monitoring

### Supabase Dashboard

Monitor:
- **Database → Table Editor**: View all data
- **Authentication → Users**: User management
- **Logs → PostgreSQL**: Database queries
- **Logs → Auth**: Authentication events

### Vercel Analytics

Enable in Vercel:
- **Analytics**: Page views, performance
- **Speed Insights**: Core Web Vitals
- **Logs**: Runtime and build logs

## Support and Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **ShadCN/UI**: https://ui.shadcn.com

## Advanced Features (Optional)

### File Upload for Documents

1. Enable Storage in Supabase
2. Create bucket: `internship-documents`
3. Add file upload in internship form
4. Store URL in database

### Email Notifications

Create Supabase Edge Function:

```typescript
// supabase/functions/send-noc-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { email, companyName, duration } = await req.json();
  
  // Send email using Resend, SendGrid, etc.
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### PDF Generation for NOC

Install:
```powershell
npm install @react-pdf/renderer
```

Create NOC PDF component and download functionality.

---

**Need Help?** Open an issue on GitHub or contact the development team.
