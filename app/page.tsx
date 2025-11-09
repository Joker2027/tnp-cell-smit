import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // Redirect based on user role
    const { data: profiles } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id);

    if (profiles && profiles.length > 0) {
      const role = profiles[0].role;
      redirect(`/dashboard/${role}`);
    }
  }

  redirect('/auth/login');
}
