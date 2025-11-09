"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/store/auth-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { Mail, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "hod">("student");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user's role from profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role) {
          router.push(`/dashboard/${profile.role}`);
        }
      }
    };

    checkUser();

    // Listen for auth state changes (when user clicks magic link)
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Get stored role or default
        const storedRole = localStorage.getItem('pendingRole') as "student" | "teacher" | "hod" || "student";
        
        // Get or create profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        const userRole = profile?.role || storedRole;

        // Create profile if doesn't exist
        if (!profile) {
          await supabase.from("profiles").upsert({
            id: session.user.id,
            email: session.user.email,
            role: userRole,
            updated_at: new Date().toISOString(),
          });
        }

        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: userRole,
        });
        
        // Clear stored role
        localStorage.removeItem('pendingRole');

        toast({
          title: "Success",
          description: "Logged in successfully!",
        });

        router.push(`/dashboard/${userRole}`);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setUser, toast]);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      
      // Get the current URL for redirect
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/login`
        : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/auth/login';

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      // Store role temporarily for when user returns
      localStorage.setItem('pendingRole', role);

      setEmailSent(true);
      
      toast({
        title: "Magic link sent!",
        description: "Check your email and click the link to login.",
      });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">T&P Cell - SMIT</CardTitle>
          <CardDescription className="text-center">
            Training & Placement Cell Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher/Mentor</SelectItem>
                    <SelectItem value="hod">HOD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@smit.smu.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Mail className="mr-2 h-4 w-4" />
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>

              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                We'll send you a login link to your email
              </p>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Check your email!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We've sent a magic link to:
                </p>
                <p className="text-sm font-medium">{email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the link in the email to login instantly.
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                >
                  Use different email
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
