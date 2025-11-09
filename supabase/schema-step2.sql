-- ============================================
-- STEP 2: Enable RLS and Create Policies (Run This Second)
-- ============================================

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
