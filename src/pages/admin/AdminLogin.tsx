import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/admin/dashboard", { replace: true });
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard", { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}admin` },
    });
    setLoading(false);
    if (error) {
      toast.error("Sign-in failed", { description: error.message });
    } else {
      toast.success("Check your inbox", { description: "We sent you a login link." });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-center">Admin Login</h1>
        <p className="text-muted-foreground text-sm mt-1 text-center">Enter your email to receive a magic link.</p>
        <form onSubmit={sendMagicLink} className="mt-6 space-y-3">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send magic link"}
          </Button>
        </form>
        <Button variant="outline" className="w-full mt-3" type="button" onClick={() => navigate("/")}>
          Back to site
        </Button>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Tip: Enable Email OTP in Supabase Auth settings if emails aren’t arriving.
        </p>
      </section>
    </main>
  );
}
