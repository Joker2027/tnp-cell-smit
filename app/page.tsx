import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // Redirect based on user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role === 'student') {
      redirect('/dashboard/student');
    } else if (profile?.role === 'teacher') {
      redirect('/dashboard/teacher');
    } else if (profile?.role === 'hod') {
      redirect('/dashboard/hod');
    }
  }

  redirect('/auth/login');
}
