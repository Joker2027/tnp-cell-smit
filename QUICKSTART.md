# T&P Cell Management System
# Deployment and Quick Start Guide

## 📋 Prerequisites Installed
✅ Node.js 18+
✅ npm or yarn
✅ Git

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
Open PowerShell in this directory and run:
```powershell
npm install
```

### Step 2: Set Up Supabase
1. Visit https://supabase.com and sign up
2. Create a new project (wait ~2 minutes for setup)
3. Go to SQL Editor
4. Copy everything from `supabase/schema.sql` and paste it
5. Click "Run" to create all tables

### Step 3: Get Your Credentials
1. In Supabase, go to Settings → API
2. Copy:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - Anon/Public Key (long string starting with eyJ...)

### Step 4: Create Environment File
1. Copy `.env.local.example` to `.env.local`
2. Open `.env.local` and paste your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=paste-your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Run the App
```powershell
npm run dev
```

🎉 Open http://localhost:3000 in your browser!

## 🧪 Testing the Application

### First Login
1. Go to http://localhost:3000
2. Select a role (Student/Teacher/HOD)
3. Enter your email
4. Check your email for the OTP code
5. Enter the code to login

### Important: Set Your Role
After first login, the role might not be set correctly. Fix it:
1. Go to your Supabase dashboard
2. Click "Table Editor" → "profiles"
3. Find your email
4. Click the row and edit the "role" field
5. Set it to: student, teacher, or hod
6. Save

### Create Sample Data (Optional)

**As a Teacher:**
1. Login with role "teacher"
2. Go to Supabase Table Editor → "teachers"
3. Click "+ Insert row"
4. Fill in:
   - user_id: (your user id from profiles table)
   - employee_id: EMP001
   - department: CSE
   - designation: Assistant Professor

**As a Student:**
1. Login with role "student"
2. Go to Supabase Table Editor → "students"
3. Click "+ Insert row"
4. Fill in:
   - user_id: (your user id)
   - enrollment_number: 190101001
   - semester: 6
   - section: A
   - department: CSE

## 🌐 Deploy to Production

### Option 1: Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/tnp-cell.git
git push -u origin main
```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
   - Click "Deploy"

3. **Update Supabase for Production:**
   - In Supabase, go to Settings → API → CORS
   - Add your Vercel URL (e.g., https://your-app.vercel.app)

### Option 2: Deploy Anywhere Else

Build the production version:
```powershell
npm run build
npm start
```

The app will run on http://localhost:3000

## 📧 Email Configuration

### Development (Local Testing)
- Supabase sends emails automatically
- Check your spam folder if you don't receive OTP
- For testing, you can use disposable email services

### Production (Real Emails)
1. Go to Supabase → Settings → Auth → SMTP Settings
2. Enable "Custom SMTP"
3. Configure with your email provider:

**Gmail Example:**
- Host: smtp.gmail.com
- Port: 587
- Username: your-email@gmail.com
- Password: [Create App Password in Google Account Settings]

## 🔍 Troubleshooting

### "Cannot connect to Supabase"
- Check if SUPABASE_URL and SUPABASE_ANON_KEY are correct in `.env.local`
- Restart the dev server: `Ctrl+C` then `npm run dev`

### "Email OTP not received"
- Check spam/junk folder
- Verify email settings in Supabase (Settings → Auth)
- For development, disable "Confirm Email" in Supabase Auth settings

### "Permission Denied" errors
- Ensure RLS policies are created (run `supabase/schema.sql`)
- Check if user role is set in `profiles` table
- Verify you're logged in

### Build errors
- Delete node_modules and reinstall:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

## 📊 Complete User Flow Test

### Student Flow:
1. ✅ Login as student
2. ✅ Fill profile (personal, education, parents info)
3. ✅ Add internship details
4. ✅ Submit NOC application
5. ✅ Wait for approvals
6. ✅ View grades after presentation

### Teacher Flow:
1. ✅ Login as teacher
2. ✅ View assigned students
3. ✅ Review NOC applications
4. ✅ Approve/Reject NOCs
5. ✅ Upload student marks
6. ✅ Provide feedback

### HOD Flow:
1. ✅ Login as HOD
2. ✅ View all students and teachers
3. ✅ Review mentor-approved NOCs
4. ✅ Give final approval
5. ✅ Monitor department statistics

## 🛠 Development Commands

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Run linter
npm run lint
```

## 📦 Project Structure

```
pbl/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   │   ├── student/      # Student dashboard
│   │   ├── teacher/      # Teacher dashboard
│   │   └── hod/          # HOD dashboard
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   └── theme-toggle.tsx  # Theme switcher
├── lib/                   # Utilities and config
│   ├── supabase/         # Supabase clients
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   └── utils.ts          # Helper functions
├── supabase/             # Database schema
│   └── schema.sql        # PostgreSQL schema
├── middleware.ts         # Route protection
└── package.json          # Dependencies

```

## 🎨 Customization

### Change Colors
Edit `app/globals.css` to change theme colors.

### Change Logo
Replace logo in `app/layout.tsx` and update metadata.

### Add Features
- File uploads: Enable Supabase Storage
- PDF generation: Install `@react-pdf/renderer`
- Email notifications: Create Supabase Edge Functions

## 📞 Support

**Issues?** Check:
1. README.md - Overview and features
2. SETUP.md - Detailed setup instructions
3. This file - Quick start guide

**Still stuck?** 
- Check Supabase docs: https://supabase.com/docs
- Check Next.js docs: https://nextjs.org/docs
- Open an issue on GitHub

---

**Built for SMIT T&P Cell** | Last Updated: 2025
