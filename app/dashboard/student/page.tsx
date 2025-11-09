"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/store/auth-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { GraduationCap, FileText, Award, LogOut, User } from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [internshipData, setInternshipData] = useState<any>(null);
  const [nocData, setNocData] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    const supabase = createClient();
    
    // Fetch student profile
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (student) {
      setStudentData(student);

      // Fetch internship data
      const { data: internship } = await supabase
        .from('internships')
        .select('*')
        .eq('student_id', student.id)
        .single();

      setInternshipData(internship);

      // Fetch NOC data
      if (internship) {
        const { data: noc } = await supabase
          .from('noc_applications')
          .select('*')
          .eq('student_id', student.id)
          .single();

        setNocData(noc);

        // Fetch evaluation data
        const { data: evalData } = await supabase
          .from('evaluations')
          .select('*')
          .eq('student_id', student.id)
          .single();

        setEvaluation(evalData);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clear local state
      logout();
      
      // Force redirect to login
      window.location.href = '/auth/login';
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const formData = new FormData(e.currentTarget);

      const profileData = {
        user_id: user?.id,
        enrollment_number: formData.get('enrollment_number'),
        semester: parseInt(formData.get('semester') as string),
        section: formData.get('section'),
        department: formData.get('department'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        fathers_name: formData.get('fathers_name'),
        fathers_contact: formData.get('fathers_contact'),
        fathers_occupation: formData.get('fathers_occupation'),
        mothers_name: formData.get('mothers_name'),
        mothers_contact: formData.get('mothers_contact'),
        mothers_occupation: formData.get('mothers_occupation'),
        tenth_percentage: parseFloat(formData.get('tenth_percentage') as string),
        tenth_board: formData.get('tenth_board'),
        tenth_year: parseInt(formData.get('tenth_year') as string),
        twelfth_percentage: parseFloat(formData.get('twelfth_percentage') as string),
        twelfth_board: formData.get('twelfth_board'),
        twelfth_year: parseInt(formData.get('twelfth_year') as string),
        cgpa: parseFloat(formData.get('cgpa') as string),
      };

      const { error } = await supabase
        .from('students')
        .upsert(profileData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      fetchStudentData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInternshipSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const formData = new FormData(e.currentTarget);

      const joiningDate = new Date(formData.get('joining_date') as string);
      const completionDate = new Date(joiningDate);
      completionDate.setDate(completionDate.getDate() + (16 * 7)); // 16 weeks

      const internshipData = {
        student_id: studentData?.id,
        internship_type: formData.get('internship_type'),
        company_name: formData.get('company_name'),
        company_address: formData.get('company_address'),
        company_website: formData.get('company_website'),
        guide_name: formData.get('guide_name'),
        guide_email: formData.get('guide_email'),
        guide_contact: formData.get('guide_contact'),
        joining_date: formData.get('joining_date'),
        completion_date: completionDate.toISOString().split('T')[0],
        duration_weeks: 16,
        stipend: parseFloat(formData.get('stipend') as string) || 0,
      };

      const { data, error } = await supabase
        .from('internships')
        .upsert(internshipData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Internship details saved successfully!",
      });

      fetchStudentData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNOCSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const formData = new FormData(e.currentTarget);

      const nocData = {
        student_id: studentData?.id,
        internship_id: internshipData?.id,
        purpose: formData.get('purpose'),
        declaration_accepted: formData.get('declaration') === 'on',
        status: 'pending',
      };

      const { error } = await supabase
        .from('noc_applications')
        .insert(nocData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "NOC application submitted successfully!",
      });

      fetchStudentData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  {studentData?.enrollment_number || 'Student'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <GraduationCap className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="internship">
              <FileText className="mr-2 h-4 w-4" />
              Internship
            </TabsTrigger>
            <TabsTrigger value="noc">
              <FileText className="mr-2 h-4 w-4" />
              NOC Application
            </TabsTrigger>
            <TabsTrigger value="evaluation">
              <Award className="mr-2 h-4 w-4" />
              Evaluation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>Update your personal and academic information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="enrollment_number">Enrollment Number</Label>
                      <Input
                        id="enrollment_number"
                        name="enrollment_number"
                        defaultValue={studentData?.enrollment_number}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select name="department" defaultValue={studentData?.department}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                          <SelectItem value="ECE">Electronics & Communication</SelectItem>
                          <SelectItem value="ME">Mechanical Engineering</SelectItem>
                          <SelectItem value="EE">Electrical Engineering</SelectItem>
                          <SelectItem value="CE">Civil Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select name="semester" defaultValue={studentData?.semester?.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Input
                        id="section"
                        name="section"
                        defaultValue={studentData?.section}
                        placeholder="A/B/C"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={studentData?.phone}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input
                        id="cgpa"
                        name="cgpa"
                        type="number"
                        step="0.01"
                        defaultValue={studentData?.cgpa}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      defaultValue={studentData?.address}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fathers_name">Father's Name *</Label>
                      <Input
                        id="fathers_name"
                        name="fathers_name"
                        defaultValue={studentData?.fathers_name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fathers_contact">Father's Contact *</Label>
                      <Input
                        id="fathers_contact"
                        name="fathers_contact"
                        defaultValue={studentData?.fathers_contact}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fathers_occupation">Father's Occupation *</Label>
                      <Input
                        id="fathers_occupation"
                        name="fathers_occupation"
                        defaultValue={studentData?.fathers_occupation}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mothers_name">Mother's Name *</Label>
                      <Input
                        id="mothers_name"
                        name="mothers_name"
                        defaultValue={studentData?.mothers_name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mothers_contact">Mother's Contact *</Label>
                      <Input
                        id="mothers_contact"
                        name="mothers_contact"
                        defaultValue={studentData?.mothers_contact}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mothers_occupation">Mother's Occupation *</Label>
                      <Input
                        id="mothers_occupation"
                        name="mothers_occupation"
                        defaultValue={studentData?.mothers_occupation}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenth_percentage">10th Percentage *</Label>
                      <Input
                        id="tenth_percentage"
                        name="tenth_percentage"
                        type="number"
                        step="0.01"
                        defaultValue={studentData?.tenth_percentage}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenth_board">10th Board *</Label>
                      <Input
                        id="tenth_board"
                        name="tenth_board"
                        defaultValue={studentData?.tenth_board}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenth_year">10th Year *</Label>
                      <Input
                        id="tenth_year"
                        name="tenth_year"
                        type="number"
                        defaultValue={studentData?.tenth_year}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twelfth_percentage">12th Percentage *</Label>
                      <Input
                        id="twelfth_percentage"
                        name="twelfth_percentage"
                        type="number"
                        step="0.01"
                        defaultValue={studentData?.twelfth_percentage}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twelfth_board">12th Board *</Label>
                      <Input
                        id="twelfth_board"
                        name="twelfth_board"
                        defaultValue={studentData?.twelfth_board}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twelfth_year">12th Year</Label>
                      <Input
                        id="twelfth_year"
                        name="twelfth_year"
                        type="number"
                        defaultValue={studentData?.twelfth_year}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internship">
            <Card>
              <CardHeader>
                <CardTitle>Internship Details</CardTitle>
                <CardDescription>Provide your internship information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInternshipSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="internship_type">Internship Type</Label>
                    <Select name="internship_type" defaultValue={internshipData?.internship_type} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Internship Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self_arranged">Self Arranged</SelectItem>
                        <SelectItem value="tnp_arranged">TNP Arranged</SelectItem>
                        <SelectItem value="smit_inhouse">SMIT In-house</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        defaultValue={internshipData?.company_name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_website">Company Website</Label>
                      <Input
                        id="company_website"
                        name="company_website"
                        type="url"
                        defaultValue={internshipData?.company_website}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_address">Company Address</Label>
                    <Textarea
                      id="company_address"
                      name="company_address"
                      defaultValue={internshipData?.company_address}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guide_name">Guide Name</Label>
                      <Input
                        id="guide_name"
                        name="guide_name"
                        defaultValue={internshipData?.guide_name}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guide_email">Guide Email</Label>
                      <Input
                        id="guide_email"
                        name="guide_email"
                        type="email"
                        defaultValue={internshipData?.guide_email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guide_contact">Guide Contact</Label>
                      <Input
                        id="guide_contact"
                        name="guide_contact"
                        type="tel"
                        defaultValue={internshipData?.guide_contact}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="joining_date">Joining Date</Label>
                      <Input
                        id="joining_date"
                        name="joining_date"
                        type="date"
                        defaultValue={internshipData?.joining_date}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stipend">Stipend (₹)</Label>
                      <Input
                        id="stipend"
                        name="stipend"
                        type="number"
                        defaultValue={internshipData?.stipend}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  {internshipData?.joining_date && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium">Duration: 16 weeks</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Expected completion: {internshipData?.completion_date}
                      </p>
                    </div>
                  )}

                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Internship Details"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="noc">
            <Card>
              <CardHeader>
                <CardTitle>NOC Application</CardTitle>
                <CardDescription>Apply for No Objection Certificate</CardDescription>
              </CardHeader>
              <CardContent>
                {nocData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Application Status</h3>
                      <p className="text-sm">
                        Status: <span className="font-medium capitalize">{nocData.status?.replace('_', ' ')}</span>
                      </p>
                      {nocData.mentor_remarks && (
                        <p className="text-sm mt-2">
                          Mentor Remarks: {nocData.mentor_remarks}
                        </p>
                      )}
                      {nocData.hod_remarks && (
                        <p className="text-sm mt-2">
                          HOD Remarks: {nocData.hod_remarks}
                        </p>
                      )}
                    </div>
                  </div>
                ) : internshipData ? (
                  <form onSubmit={handleNOCSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose of NOC</Label>
                      <Textarea
                        id="purpose"
                        name="purpose"
                        rows={4}
                        placeholder="State the purpose of your NOC application..."
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="declaration"
                          name="declaration"
                          className="mt-1"
                          required
                        />
                        <Label htmlFor="declaration" className="text-sm leading-relaxed">
                          I hereby declare that all the information provided is true and correct to the best
                          of my knowledge. I understand that any false information may lead to the cancellation
                          of my internship and appropriate disciplinary action.
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit NOC Application"}
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please complete your internship details before applying for NOC.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation">
            <Card>
              <CardHeader>
                <CardTitle>Internship Evaluation</CardTitle>
                <CardDescription>View your marks and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                {evaluation ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Presentation Marks</p>
                        <p className="text-2xl font-bold">{evaluation.presentation_marks}/30</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Report Marks</p>
                        <p className="text-2xl font-bold">{evaluation.report_marks}/40</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Viva Marks</p>
                        <p className="text-2xl font-bold">{evaluation.viva_marks}/30</p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Marks</p>
                        <p className="text-2xl font-bold">{evaluation.total_marks}/100</p>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Grade</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">{evaluation.grade}</p>
                    </div>

                    {evaluation.feedback && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 className="font-semibold mb-2">Feedback</h3>
                        <p className="text-sm">{evaluation.feedback}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No evaluation available yet. Your marks will appear here after the presentation.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
