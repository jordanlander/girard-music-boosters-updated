import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

type Doc = {
  id: string;
  title: string;
  description: string | null;
  url: string;
};

export default function DocsSection() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await (supabase as any)
        .from("documents")
        .select("id,title,description,url")
        .eq("published", true)
        .order("order_index", { ascending: true });
      if (!error && data) setDocs(data as Doc[]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section className="container py-12">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold">Documents & Forms</h2>
        <p className="text-muted-foreground">Quick access to commonly requested documents.</p>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading documents…</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((d) => (
            <a key={d.id} href={d.url} aria-label={`Open ${d.title}`}>
              <Card className="p-4 hover:bg-accent transition-colors">
                <span className="font-medium">{d.title}</span>
                {d.description && (
                  <p className="text-xs text-muted-foreground mt-1">{d.description}</p>
                )}
              </Card>
            </a>
          ))}
          {docs.length === 0 && (
            <div className="text-sm text-muted-foreground">No documents available.</div>
          )}
        </div>
      )}
    </section>
  );
}
