import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export type DocumentRow = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  order_index: number;
  published: boolean;
};

export default function DocumentsManager() {
  const [items, setItems] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<DocumentRow, "id">>({
    title: "",
    description: "",
    url: "",
    order_index: 0,
    published: true,
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("documents")
      .select("id,title,description,url,order_index,published")
      .order("order_index", { ascending: true });
    if (error) {
      toast.error("Failed to load documents", { description: error.message });
    } else {
      setItems((data as DocumentRow[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!draft.title || !draft.url) {
      toast.error("Title and URL are required");
      return;
    }
    setCreating(true);
    const { error } = await (supabase as any).from("documents").insert(draft as any);
    setCreating(false);
    if (error) {
      toast.error("Create failed", { description: error.message });
    } else {
      toast.success("Document added");
      setDraft({ title: "", description: "", url: "", order_index: 0, published: true });
      load();
    }
  };

  const save = async (row: DocumentRow) => {
    setSavingId(row.id);
    const { error } = await (supabase as any)
      .from("documents")
      .update({
        title: row.title,
        description: row.description,
        url: row.url,
        order_index: row.order_index,
        published: row.published,
      })
      .eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast.error("Save failed", { description: error.message });
    } else {
      toast.success("Saved");
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    const { error } = await (supabase as any).from("documents").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
    } else {
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold">Manage Documents</h3>
          <p className="text-sm text-muted-foreground">Add, edit, publish, and reorder documents shown on the homepage.</p>
        </div>

        {/* Create new */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 items-end">
          <Input
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <Input
            placeholder="Description (optional)"
            value={draft.description ?? ""}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <Input
            placeholder="URL (https:// or /path)"
            value={draft.url}
            onChange={(e) => setDraft({ ...draft, url: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Order"
            value={draft.order_index}
            onChange={(e) => setDraft({ ...draft, order_index: Number(e.target.value) })}
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={draft.published}
                onCheckedChange={(v) => setDraft({ ...draft, published: v })}
                aria-label="Published"
              />
              <span className="text-sm">Published</span>
            </div>
            <Button onClick={create} disabled={creating}>
              {creating ? "Adding…" : "Add"}
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-4" />

        {/* List */}
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No documents yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map((row, idx) => (
              <div key={row.id} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-2 items-center">
                <Input
                  value={row.title}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, title: e.target.value } : it)))
                  }
                />
                <Input
                  value={row.description ?? ""}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, description: e.target.value } : it)))
                  }
                  placeholder="Description"
                />
                <Input
                  value={row.url}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, url: e.target.value } : it)))
                  }
                />
                <Input
                  type="number"
                  value={row.order_index}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, order_index: Number(e.target.value) } : it)))
                  }
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={row.published}
                    onCheckedChange={(v) =>
                      setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, published: v } : it)))
                    }
                    aria-label={`Toggle publish for ${row.title}`}
                  />
                  <span className="text-sm">Published</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="outline" onClick={() => save(row)} disabled={savingId === row.id}>
                    {savingId === row.id ? "Saving…" : "Save"}
                  </Button>
                  <Button variant="destructive" onClick={() => remove(row.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
