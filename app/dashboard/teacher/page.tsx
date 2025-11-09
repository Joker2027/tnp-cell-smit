"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/store/auth-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Users, FileCheck, Award, LogOut } from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [teacherData, setTeacherData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [nocApplications, setNocApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const supabase = createClient();
    
    // Fetch teacher profile
    const { data: teacher } = await supabase
      .from('teachers')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (teacher) {
      setTeacherData(teacher);

      // Fetch students under this mentor
      const { data: studentList } = await supabase
        .from('students')
        .select(`
          *,
          profiles:user_id(email, full_name),
          internships(*),
          noc_applications(*)
        `)
        .eq('mentor_id', teacher.id);

      setStudents(studentList || []);

      // Fetch NOC applications for students under this mentor
      const { data: nocs } = await supabase
        .from('noc_applications')
        .select(`
          *,
          students!inner(
            *,
            profiles:user_id(email, full_name),
            internships(*)
          )
        `)
        .eq('students.mentor_id', teacher.id)
        .eq('status', 'pending');

      setNocApplications(nocs || []);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    router.push("/auth/login");
  };

  const handleNOCAction = async (nocId: string, action: 'approve' | 'reject', remarks: string) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('noc_applications')
        .update({
          status: action === 'approve' ? 'mentor_approved' : 'rejected',
          mentor_remarks: remarks,
          mentor_approved_at: action === 'approve' ? new Date().toISOString() : null,
        })
        .eq('id', nocId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `NOC ${action === 'approve' ? 'approved' : 'rejected'} successfully!`,
      });

      fetchData();
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

  const handleEvaluationSubmit = async (e: React.FormEvent<HTMLFormElement>, studentId: string, internshipId: string) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const formData = new FormData(e.currentTarget);

      const presentationMarks = parseFloat(formData.get('presentation_marks') as string);
      const reportMarks = parseFloat(formData.get('report_marks') as string);
      const vivaMarks = parseFloat(formData.get('viva_marks') as string);
      const totalMarks = presentationMarks + reportMarks + vivaMarks;

      let grade = 'F';
      if (totalMarks >= 90) grade = 'A+';
      else if (totalMarks >= 80) grade = 'A';
      else if (totalMarks >= 70) grade = 'B+';
      else if (totalMarks >= 60) grade = 'B';
      else if (totalMarks >= 50) grade = 'C';
      else if (totalMarks >= 40) grade = 'D';

      const { error } = await supabase
        .from('evaluations')
        .upsert({
          student_id: studentId,
          internship_id: internshipId,
          evaluator_id: teacherData.id,
          presentation_marks: presentationMarks,
          report_marks: reportMarks,
          viva_marks: vivaMarks,
          total_marks: totalMarks,
          grade: grade,
          feedback: formData.get('feedback'),
          evaluated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Evaluation submitted successfully!",
      });

      fetchData();
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">
              <Users className="mr-2 h-4 w-4" />
              My Students
            </TabsTrigger>
            <TabsTrigger value="noc">
              <FileCheck className="mr-2 h-4 w-4" />
              NOC Applications
            </TabsTrigger>
            <TabsTrigger value="evaluation">
              <Award className="mr-2 h-4 w-4" />
              Evaluations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Students Under My Mentorship</CardTitle>
                <CardDescription>View and manage your students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.length > 0 ? (
                    students.map((student) => (
                      <div key={student.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{student.profiles?.full_name || student.profiles?.email}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {student.enrollment_number} | {student.department} | Sem {student.semester}
                            </p>
                            {student.internships && (
                              <p className="text-sm mt-2">
                                <span className="font-medium">Internship:</span> {student.internships.company_name}
                                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs">
                                  {student.internships.internship_type?.replace('_', ' ')}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                      No students assigned yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="noc">
            <Card>
              <CardHeader>
                <CardTitle>Pending NOC Applications</CardTitle>
                <CardDescription>Review and approve NOC applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nocApplications.length > 0 ? (
                    nocApplications.map((noc) => (
                      <div key={noc.id} className="p-4 border rounded-lg space-y-4">
                        <div>
                          <h3 className="font-semibold">{noc.students?.profiles?.full_name || noc.students?.profiles?.email}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {noc.students?.enrollment_number} | {noc.students?.department}
                          </p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">Company:</span> {noc.students?.internships?.company_name}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Purpose:</span> {noc.purpose}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add remarks (optional)"
                            id={`remarks-${noc.id}`}
                          />
                          <Button
                            onClick={() => {
                              const input = document.getElementById(`remarks-${noc.id}`) as HTMLInputElement;
                              handleNOCAction(noc.id, 'approve', input?.value || '');
                            }}
                            disabled={loading}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              const input = document.getElementById(`remarks-${noc.id}`) as HTMLInputElement;
                              handleNOCAction(noc.id, 'reject', input?.value || 'Rejected by mentor');
                            }}
                            disabled={loading}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                      No pending NOC applications.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation">
            <Card>
              <CardHeader>
                <CardTitle>Student Evaluations</CardTitle>
                <CardDescription>Upload marks and feedback for internship presentations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {students.filter(s => s.internships).map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-4">
                        {student.profiles?.full_name || student.profiles?.email} - {student.internships?.company_name}
                      </h3>
                      <form onSubmit={(e) => handleEvaluationSubmit(e, student.id, student.internships.id)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`presentation-${student.id}`}>Presentation Marks (30)</Label>
                            <Input
                              id={`presentation-${student.id}`}
                              name="presentation_marks"
                              type="number"
                              max="30"
                              step="0.5"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`report-${student.id}`}>Report Marks (40)</Label>
                            <Input
                              id={`report-${student.id}`}
                              name="report_marks"
                              type="number"
                              max="40"
                              step="0.5"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`viva-${student.id}`}>Viva Marks (30)</Label>
                            <Input
                              id={`viva-${student.id}`}
                              name="viva_marks"
                              type="number"
                              max="30"
                              step="0.5"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`feedback-${student.id}`}>Feedback</Label>
                          <Textarea
                            id={`feedback-${student.id}`}
                            name="feedback"
                            rows={3}
                            placeholder="Provide feedback on the student's performance..."
                          />
                        </div>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Submitting..." : "Submit Evaluation"}
                        </Button>
                      </form>
                    </div>
                  ))}
                  {students.filter(s => s.internships).length === 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                      No students with internships to evaluate.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
