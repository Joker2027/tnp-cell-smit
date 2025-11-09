-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'hod');
CREATE TYPE internship_type AS ENUM ('self_arranged', 'tnp_arranged', 'smit_inhouse');
CREATE TYPE noc_status AS ENUM ('pending', 'mentor_approved', 'hod_approved', 'rejected');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  enrollment_number TEXT NOT NULL UNIQUE,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
  section TEXT NOT NULL,
  department TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  fathers_name TEXT,
  fathers_contact TEXT,
  fathers_occupation TEXT,
  mothers_name TEXT,
  mothers_contact TEXT,
  mothers_occupation TEXT,
  tenth_percentage DECIMAL(5,2) CHECK (tenth_percentage >= 0 AND tenth_percentage <= 100),
  tenth_board TEXT,
  tenth_year INTEGER,
  twelfth_percentage DECIMAL(5,2) CHECK (twelfth_percentage >= 0 AND twelfth_percentage <= 100),
  twelfth_board TEXT,
  twelfth_year INTEGER,
  cgpa DECIMAL(3,2) CHECK (cgpa >= 0 AND cgpa <= 10),
  mentor_id UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  employee_id TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  designation TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internships table
CREATE TABLE IF NOT EXISTS internships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  internship_type internship_type NOT NULL,
  company_name TEXT NOT NULL,
  company_address TEXT,
  company_website TEXT,
  guide_name TEXT,
  guide_email TEXT,
  guide_contact TEXT,
  joining_date DATE,
  completion_date DATE,
  duration_weeks INTEGER DEFAULT 16,
  stipend DECIMAL(10,2) DEFAULT 0,
  offer_letter_url TEXT,
  completion_certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOC Applications table
CREATE TABLE IF NOT EXISTS noc_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE NOT NULL,
  purpose TEXT,
  declaration_accepted BOOLEAN DEFAULT FALSE,
  status noc_status DEFAULT 'pending',
  mentor_remarks TEXT,
  hod_remarks TEXT,
  mentor_approved_at TIMESTAMPTZ,
  hod_approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, internship_id)
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE NOT NULL,
  evaluator_id UUID REFERENCES teachers(id) NOT NULL,
  presentation_marks DECIMAL(5,2) CHECK (presentation_marks >= 0 AND presentation_marks <= 30),
  report_marks DECIMAL(5,2) CHECK (report_marks >= 0 AND report_marks <= 40),
  viva_marks DECIMAL(5,2) CHECK (viva_marks >= 0 AND viva_marks <= 30),
  total_marks DECIMAL(5,2) CHECK (total_marks >= 0 AND total_marks <= 100),
  grade TEXT,
  feedback TEXT,
  evaluated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, internship_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_mentor_id ON students(mentor_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_internships_student_id ON internships(student_id);
CREATE INDEX idx_noc_student_id ON noc_applications(student_id);
CREATE INDEX idx_noc_status ON noc_applications(status);
CREATE INDEX idx_evaluations_student_id ON evaluations(student_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE noc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for students
CREATE POLICY "Students can view their own data" ON students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own data" ON students
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view their mentees" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teachers 
      WHERE teachers.user_id = auth.uid() 
      AND teachers.id = students.mentor_id
    )
  );

CREATE POLICY "HODs can view all students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'hod'
    )
  );

-- RLS Policies for teachers
CREATE POLICY "Teachers can view their own data" ON teachers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can update their own data" ON teachers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "HODs can view all teachers" ON teachers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'hod'
    )
  );

-- RLS Policies for internships
CREATE POLICY "Students can manage their internships" ON internships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = internships.student_id 
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view mentee internships" ON internships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students 
      JOIN teachers ON students.mentor_id = teachers.id
      WHERE students.id = internships.student_id 
      AND teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "HODs can view all internships" ON internships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'hod'
    )
  );

-- RLS Policies for NOC applications
CREATE POLICY "Students can manage their NOC applications" ON noc_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = noc_applications.student_id 
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view and approve mentee NOCs" ON noc_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM students 
      JOIN teachers ON students.mentor_id = teachers.id
      WHERE students.id = noc_applications.student_id 
      AND teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "HODs can view and approve all NOCs" ON noc_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'hod'
    )
  );

-- RLS Policies for evaluations
CREATE POLICY "Students can view their evaluations" ON evaluations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = evaluations.student_id 
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage evaluations" ON evaluations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM teachers 
      WHERE teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "HODs can view all evaluations" ON evaluations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'hod'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON internships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_noc_applications_updated_at BEFORE UPDATE ON noc_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
