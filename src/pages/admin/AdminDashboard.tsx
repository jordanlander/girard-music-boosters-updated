import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DocumentsManager from "./DocumentsManager";
import EventsManager from "./EventsManager";
import PhotosManager from "./PhotosManager";
const STATIC_WHITELIST = new Set([
  "girardmusicboosters@gmail.com",
  "jordanlander@gmail.com",
]);

type AdminEmail = { email: string };

export default function AdminDashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean>(false);
  const [dbWhitelist, setDbWhitelist] = useState<string[] | null>(null);
  const [missingTable, setMissingTable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const email = sessionData.session?.user.email ?? null;
      setUserEmail(email);
      if (!email) {
        navigate("/admin", { replace: true });
        return;
      }

      const { data, error } = await (supabase as any)
        .from("admin_emails")
        .select("email");

      if (error) {
        // If table doesn't exist yet, fall back to static list
        if ((error as any).code === "42P01" || /relation .* does not exist/i.test(error.message)) {
          setMissingTable(true);
          setAllowed(STATIC_WHITELIST.has(email));
          return;
        }
        toast.error("Failed to check admin access", { description: error.message });
        return;
      }

      const list = (data as AdminEmail[]).map((r) => r.email.toLowerCase());
      setDbWhitelist(list);
      setAllowed(list.includes(email.toLowerCase()) || STATIC_WHITELIST.has(email));
    };

    load();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/admin", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="container max-w-5xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">{userEmail}</div>
        </header>

        {!allowed ? (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg">Access pending</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Your account isn’t whitelisted yet. Ask an existing admin to add your email.
              </p>
              {missingTable && (
                <div className="mt-4">
                  <h3 className="font-medium">Setup required</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create the <code>admin_emails</code> table in Supabase using this SQL, then add emails:
                  </p>
                  <pre className="mt-3 p-3 rounded-md bg-muted text-xs overflow-auto">
{`-- Admin whitelist
create table if not exists public.admin_emails (
  email text primary key,
  created_at timestamptz default now()
);

alter table public.admin_emails enable row level security;

-- Allow anyone to read whitelist size (not strictly necessary)
create policy "Read admin_emails" on public.admin_emails
  for select to anon using (true);

-- Only admins (by email) can modify; adjust with your org domains if needed
create policy "Manage admin_emails" on public.admin_emails
  for all to authenticated using (
    auth.email() in (select email from public.admin_emails)
  );`}
                  </pre>
                </div>
              )}
              <div className="mt-4">
                <Button onClick={signOut} variant="outline">Sign out</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                <h2 className="font-semibold">Events</h2>
                <div className="mt-3">
                  <EventsManager />
                </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold">Photos</h2>
                  <div className="mt-3">
                    <PhotosManager />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardContent className="p-6">
                <DocumentsManager />
              </CardContent>
            </Card>


            {dbWhitelist && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-medium">Current Admins</h3>
                  <ul className="list-disc pl-5 mt-2 text-sm">
                    {dbWhitelist.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="mt-6">
              <Button onClick={signOut} variant="outline">Sign out</Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
