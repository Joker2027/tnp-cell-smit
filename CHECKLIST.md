# T&P Cell Setup Checklist

Use this checklist to ensure everything is set up correctly.

## ✅ Initial Setup

### Development Environment
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended) installed
- [ ] Terminal/PowerShell access

### Project Setup
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created
- [ ] Environment variables configured

## ✅ Supabase Setup

### Project Creation
- [ ] Supabase account created
- [ ] New project created
- [ ] Project name: `tnp-cell-smit` (or your choice)
- [ ] Region selected (closest to your location)
- [ ] Database password saved securely

### Database Configuration
- [ ] SQL Editor accessed
- [ ] `supabase/schema.sql` copied and executed
- [ ] All tables created successfully:
  - [ ] profiles
  - [ ] students
  - [ ] teachers
  - [ ] internships
  - [ ] noc_applications
  - [ ] evaluations
- [ ] Indexes created
- [ ] RLS policies enabled

### Authentication Setup
- [ ] Email provider enabled (Auth → Providers)
- [ ] "Confirm Email" setting configured
- [ ] Email templates customized (optional)
- [ ] SMTP settings configured (for production)

### API Configuration
- [ ] Project URL copied to `.env.local`
- [ ] Anon key copied to `.env.local`
- [ ] CORS configured (for production deployment)

## ✅ Application Testing

### Basic Functionality
- [ ] Development server starts (`npm run dev`)
- [ ] Home page loads (http://localhost:3000)
- [ ] Login page accessible
- [ ] Theme toggle works

### Authentication Flow
- [ ] Can select role (Student/Teacher/HOD)
- [ ] Can enter email
- [ ] OTP email received
- [ ] Can verify OTP
- [ ] Successful login redirects to dashboard

### Student Dashboard
- [ ] Profile tab loads
- [ ] Can fill personal information
- [ ] Can save profile
- [ ] Internship tab accessible
- [ ] Can select internship type
- [ ] Can add company details
- [ ] Duration auto-calculates (16 weeks)
- [ ] NOC application form works
- [ ] Declaration checkbox functional
- [ ] Can submit NOC
- [ ] Evaluation tab shows placeholder

### Teacher Dashboard
- [ ] Students list visible
- [ ] NOC applications tab works
- [ ] Can view pending NOCs
- [ ] Can add remarks
- [ ] Can approve NOC
- [ ] Can reject NOC
- [ ] Evaluation form accessible
- [ ] Can enter marks (Presentation/Report/Viva)
- [ ] Grade auto-calculates
- [ ] Can submit evaluation

### HOD Dashboard
- [ ] Statistics cards show correct counts
- [ ] Teachers list displays
- [ ] Students list displays
- [ ] Pending NOCs visible
- [ ] Can add HOD remarks
- [ ] Can give final approval
- [ ] Can reject NOC

## ✅ Data Verification

### Database Tables
- [ ] Profiles table has user records
- [ ] Students table has student data
- [ ] Teachers table has teacher data
- [ ] Internships table has internship records
- [ ] NOC applications tracked correctly
- [ ] Evaluations stored properly

### Role Assignment
- [ ] Student role works correctly
- [ ] Teacher role works correctly
- [ ] HOD role works correctly
- [ ] Users can only access their role's features

## ✅ Production Deployment (Vercel)

### Pre-deployment
- [ ] Code pushed to GitHub
- [ ] Repository is public or Vercel has access
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Vercel Setup
- [ ] Project imported to Vercel
- [ ] Environment variables added:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] NEXT_PUBLIC_APP_URL
- [ ] Build settings correct (Next.js preset)
- [ ] Deployment successful

### Post-deployment
- [ ] Production URL works
- [ ] Login flow works in production
- [ ] Email OTP received in production
- [ ] All dashboards accessible
- [ ] CORS configured in Supabase for production URL

## ✅ Security & Performance

### Security
- [ ] RLS policies enabled on all tables
- [ ] Environment variables not committed to Git
- [ ] Supabase keys secure (anon key only in frontend)
- [ ] Server-side validation working
- [ ] Middleware protecting routes

### Performance
- [ ] Pages load quickly (< 3 seconds)
- [ ] Images optimized
- [ ] Database queries efficient
- [ ] No console errors in browser
- [ ] Mobile responsive design works

## ✅ User Experience

### UI/UX
- [ ] Light theme works
- [ ] Dark theme works
- [ ] Theme persists across pages
- [ ] Forms are user-friendly
- [ ] Error messages clear and helpful
- [ ] Success notifications appear
- [ ] Loading states shown during operations

### Accessibility
- [ ] Forms have proper labels
- [ ] Buttons have descriptive text
- [ ] Color contrast sufficient
- [ ] Keyboard navigation works

## ✅ Documentation

### Files Present
- [ ] README.md (overview)
- [ ] SETUP.md (detailed setup)
- [ ] QUICKSTART.md (quick start guide)
- [ ] This CHECKLIST.md
- [ ] Comments in code

### Information Complete
- [ ] Installation instructions clear
- [ ] Environment variables documented
- [ ] Database schema documented
- [ ] Deployment steps explained
- [ ] Troubleshooting tips provided

## ✅ Testing Scenarios

### Complete Student Journey
1. [ ] Student creates account
2. [ ] Student fills profile
3. [ ] Student adds internship
4. [ ] Student applies for NOC
5. [ ] Teacher reviews and approves
6. [ ] HOD gives final approval
7. [ ] Student receives confirmation
8. [ ] Teacher uploads marks
9. [ ] Student views grades

### Edge Cases
- [ ] Invalid email format rejected
- [ ] Empty form submissions prevented
- [ ] Date validations work
- [ ] Number field limits enforced
- [ ] Duplicate submissions prevented
- [ ] Logout works properly
- [ ] Session management correct

## ✅ Final Checks

### Before Go-Live
- [ ] All test data removed
- [ ] Production email configured
- [ ] Email templates professional
- [ ] Custom domain configured (optional)
- [ ] Analytics setup (optional)
- [ ] Backup strategy in place

### Training
- [ ] Admin trained on system
- [ ] Sample student account created for demo
- [ ] Sample teacher account created for demo
- [ ] Sample HOD account created for demo
- [ ] User manual created (optional)

### Support
- [ ] Support email configured
- [ ] Issue reporting system ready
- [ ] Monitoring dashboard accessed
- [ ] Backup admin accounts created

---

## 🎯 Priority Levels

**Must Have (Before Launch):**
- All "Initial Setup" items
- All "Supabase Setup" items
- All "Application Testing" items
- All "Security & Performance" items

**Should Have (Within First Week):**
- All "Production Deployment" items
- All "User Experience" items
- All "Testing Scenarios" items

**Nice to Have (When Time Permits):**
- Custom email templates
- PDF generation for NOC
- File upload functionality
- Advanced analytics

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd")

**Status:** [ ] Setup Complete | [ ] In Progress | [ ] Not Started

**Notes:**
_Add any additional notes or custom requirements here_
