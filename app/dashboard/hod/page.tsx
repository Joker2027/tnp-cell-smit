"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/store/auth-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Users, GraduationCap, FileCheck, LogOut } from "lucide-react";

export default function HODDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
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
    
    // Fetch all teachers
    const { data: teacherList } = await supabase
      .from('teachers')
      .select(`
        *,
        profiles:user_id(email, full_name)
      `);

    setTeachers(teacherList || []);

    // Fetch all students
    const { data: studentList } = await supabase
      .from('students')
      .select(`
        *,
        profiles:user_id(email, full_name),
        internships(*),
        noc_applications(*),
        evaluations(*)
      `);

    setStudents(studentList || []);

    // Fetch NOC applications pending HOD approval
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
      .eq('status', 'mentor_approved');

    setNocApplications(nocs || []);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    router.push("/auth/login");
  };

  const handleFinalNOCApproval = async (nocId: string, action: 'approve' | 'reject', remarks: string) => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      // Get NOC details to send email
      const { data: nocData } = await supabase
        .from('noc_applications')
        .select(`
          *,
          students!inner(
            profiles:user_id(email)
          )
        `)
        .eq('id', nocId)
        .single();

      const { error } = await supabase
        .from('noc_applications')
        .update({
          status: action === 'approve' ? 'hod_approved' : 'rejected',
          hod_remarks: remarks,
          hod_approved_at: action === 'approve' ? new Date().toISOString() : null,
        })
        .eq('id', nocId);

      if (error) throw error;

      // In a real application, you would send an email here
      // For now, we'll just show a toast notification
      toast({
        title: "Success",
        description: `NOC ${action === 'approve' ? 'approved' : 'rejected'} successfully! ${action === 'approve' ? 'Confirmation email sent to student.' : ''}`,
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HOD Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teachers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending NOCs</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nocApplications.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="noc" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="noc">
              <FileCheck className="mr-2 h-4 w-4" />
              NOC Approvals
            </TabsTrigger>
            <TabsTrigger value="teachers">
              <Users className="mr-2 h-4 w-4" />
              Teachers
            </TabsTrigger>
            <TabsTrigger value="students">
              <GraduationCap className="mr-2 h-4 w-4" />
              Students
            </TabsTrigger>
          </TabsList>

          <TabsContent value="noc">
            <Card>
              <CardHeader>
                <CardTitle>NOC Applications - Final Approval</CardTitle>
                <CardDescription>Review and approve NOC applications approved by mentors</CardDescription>
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
                            <span className="font-medium">Internship Type:</span>{' '}
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs">
                              {noc.students?.internships?.internship_type?.replace('_', ' ')}
                            </span>
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Purpose:</span> {noc.purpose}
                          </p>
                          {noc.mentor_remarks && (
                            <p className="text-sm mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <span className="font-medium">Mentor Remarks:</span> {noc.mentor_remarks}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add HOD remarks (optional)"
                            id={`hod-remarks-${noc.id}`}
                          />
                          <Button
                            onClick={() => {
                              const input = document.getElementById(`hod-remarks-${noc.id}`) as HTMLInputElement;
                              handleFinalNOCApproval(noc.id, 'approve', input?.value || 'Approved by HOD');
                            }}
                            disabled={loading}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              const input = document.getElementById(`hod-remarks-${noc.id}`) as HTMLInputElement;
                              handleFinalNOCApproval(noc.id, 'reject', input?.value || 'Rejected by HOD');
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
                      No pending NOC applications for final approval.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle>All Teachers</CardTitle>
                <CardDescription>View all teachers in the department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teachers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Employee ID</th>
                            <th className="text-left p-2">Department</th>
                            <th className="text-left p-2">Designation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.map((teacher) => (
                            <tr key={teacher.id} className="border-b">
                              <td className="p-2">{teacher.profiles?.full_name || '-'}</td>
                              <td className="p-2">{teacher.profiles?.email}</td>
                              <td className="p-2">{teacher.employee_id}</td>
                              <td className="p-2">{teacher.department}</td>
                              <td className="p-2">{teacher.designation || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                      No teachers found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>All Students</CardTitle>
                <CardDescription>View all students and their internship status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.length > 0 ? (
                    students.map((student) => (
                      <div key={student.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{student.profiles?.full_name || student.profiles?.email}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {student.enrollment_number} | {student.department} | Sem {student.semester} | CGPA: {student.cgpa}
                            </p>
                            {student.internships && (
                              <div className="mt-2 text-sm">
                                <p>
                                  <span className="font-medium">Company:</span> {student.internships.company_name}
                                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs">
                                    {student.internships.internship_type?.replace('_', ' ')}
                                  </span>
                                </p>
                                {student.noc_applications && (
                                  <p className="mt-1">
                                    <span className="font-medium">NOC Status:</span>{' '}
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      student.noc_applications.status === 'hod_approved'
                                        ? 'bg-green-100 dark:bg-green-900'
                                        : student.noc_applications.status === 'rejected'
                                        ? 'bg-red-100 dark:bg-red-900'
                                        : 'bg-yellow-100 dark:bg-yellow-900'
                                    }`}>
                                      {student.noc_applications.status?.replace('_', ' ')}
                                    </span>
                                  </p>
                                )}
                                {student.evaluations && (
                                  <p className="mt-1">
                                    <span className="font-medium">Grade:</span>{' '}
                                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded text-xs font-bold">
                                      {student.evaluations.grade}
                                    </span>
                                    <span className="ml-2">({student.evaluations.total_marks}/100)</span>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                      No students found.
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
