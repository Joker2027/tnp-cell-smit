# T&P Cell Management System - SMIT

A comprehensive Training & Placement Cell Management System for Sikkim Manipal Institute of Technology, built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### Authentication
- **Email & Password Authentication** with Sign Up and Login
- **Role-based Access Control** (Student, Teacher/Mentor, HOD)
- Secure session management

### Student Dashboard
- **Complete Profile Management**
  - Personal information (semester, section, department, address)
  - Educational background (10th, 12th, CGPA)
  - Parent information
  
- **Internship Management**
  - Select internship type (Self Arranged, TNP Arranged, SMIT In-house)
  - Upload organization details (company name, address, guide information)
  - Automatic 16-week duration calculation from joining date
  - View internship completion timeline
  
- **NOC Application**
  - Apply for No Objection Certificate
  - Track application status (Pending → Mentor Approved → HOD Approved)
  - View mentor and HOD remarks
  - Email confirmation on approval
  
- **Evaluation Viewing**
  - View marks (Presentation, Report, Viva)
  - See total marks and grade
  - Read teacher feedback

### Teacher Dashboard
- **Student Management**
  - View all mentees
  - Filter students by internship type
  - Track student internship status
  
- **NOC Approval**
  - Review pending NOC applications
  - Approve/Reject with remarks
  - View student and internship details
  
- **Evaluation System**
  - Upload marks for presentations (30 marks)
  - Upload marks for reports (40 marks)
  - Upload marks for viva (30 marks)
  - Automatic grade calculation (A+, A, B+, B, C, D, F)
  - Provide detailed feedback

### HOD Dashboard
- **Final NOC Approval**
  - Review mentor-approved NOCs
  - Final approval/rejection authority
  - Add HOD-level remarks
  - Trigger email notifications to students
  
- **Complete Overview**
  - View all teachers in department
  - View all students and their status
  - Track internship types distribution
  - Monitor NOC application pipeline
  - View evaluation statistics

### UI/UX Features
- **Light/Dark Theme Toggle** using next-themes
- Responsive design for all screen sizes
- Modern UI with ShadCN/UI components
- Smooth animations and transitions
- Accessible form controls

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ShadCN/UI** for component library
- **Zustand** for state management
- **Lucide React** for icons
- **React Hook Form** for form handling
- **Zod** for validation

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Auth** (Email OTP)
- **Row Level Security** (RLS) for data protection
- **Supabase Edge Functions** (optional)

### Deployment
- **Vercel** (Frontend hosting)
- **Supabase Cloud** (Backend & Database)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd pbl
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Go to **Authentication → Providers** and enable Email provider
4. Configure email templates for OTP in **Authentication → Email Templates**

### Step 4: Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get your Supabase URL and Anon Key from **Settings → API** in your Supabase dashboard.

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄 Database Schema

### Tables
1. **profiles** - User authentication and role information
2. **students** - Student personal and academic details
3. **teachers** - Teacher/mentor information
4. **internships** - Internship details for students
5. **noc_applications** - NOC application workflow
6. **evaluations** - Student evaluation marks and grades

### Relationships
- Students → Teachers (mentor relationship)
- Students → Internships (one-to-one)
- Students → NOC Applications (via internships)
- Students → Evaluations (via internships)

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
npm run build
```

### Supabase Configuration

Ensure your Supabase project is in production mode and has:
- Email templates configured
- RLS policies enabled
- CORS configured for your domain

## 📱 User Roles & Permissions

### Student
- ✅ Create and update profile
- ✅ Submit internship details
- ✅ Apply for NOC
- ✅ View evaluation results
- ❌ Cannot approve NOCs
- ❌ Cannot upload marks

### Teacher/Mentor
- ✅ View assigned students
- ✅ Approve/Reject student NOCs
- ✅ Upload evaluation marks
- ✅ Provide feedback
- ❌ Cannot give final NOC approval

### HOD
- ✅ View all teachers and students
- ✅ Final NOC approval authority
- ✅ Complete system oversight
- ✅ Access to all data (read-only for most)

## 🔐 Security Features

- Row Level Security (RLS) on all tables
- Server-side session validation
- Protected API routes
- Role-based access control
- Secure email OTP authentication

## 📧 Email Notifications

When a NOC is approved by HOD, an email is sent to the student containing:
- Approval confirmation
- NOC reference number
- Company details
- Internship duration

## 🎨 Theme Customization

The application supports light and dark modes. Customize colors in:
- `app/globals.css` - CSS variables
- `tailwind.config.ts` - Tailwind theme

## 🧪 Testing

### Test User Accounts

After setting up, create test accounts with different roles:

1. **Student**: student@smit.smu.edu.in
2. **Teacher**: teacher@smit.smu.edu.in
3. **HOD**: hod@smit.smu.edu.in

Use Supabase Dashboard to manually set roles in the `profiles` table.

## 📝 Usage Workflow

### For Students
1. Login with email OTP
2. Complete profile information
3. Add internship details
4. Submit NOC application
5. Wait for mentor approval
6. Wait for HOD approval
7. View evaluation after presentation

### For Teachers
1. Login with email OTP
2. View assigned students
3. Review NOC applications
4. Approve/Reject with remarks
5. Upload marks after presentations
6. Provide feedback

### For HOD
1. Login with email OTP
2. Review mentor-approved NOCs
3. Give final approval
4. Monitor all student activities
5. View department-wide statistics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Shlok** - Initial work

## 🙏 Acknowledgments

- Sikkim Manipal Institute of Technology
- Training & Placement Cell
- Next.js Team
- Supabase Team
- ShadCN/UI Team

## 📞 Support

For support, email support@smit.smu.edu.in or create an issue in the repository.

---

**Built with ❤️ for SMIT T&P Cell**
