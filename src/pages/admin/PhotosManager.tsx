import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export type PhotoRow = {
  id: string;
  path: string;
  alt: string | null;
  order_index: number;
  published: boolean;
};

export default function PhotosManager() {
  const [items, setItems] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("photos")
      .select("id,path,alt,order_index,published")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      toast.error("Failed to load photos", { description: error.message });
    } else {
      setItems((data as PhotoRow[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    if (!file) return toast.error("Choose a file first");
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadErr } = await (supabase as any)
      .storage
      .from("gallery")
      .upload(path, file, { upsert: false, contentType: file.type || undefined });

    if (uploadErr) {
      setUploading(false);
      return toast.error("Upload failed", { description: uploadErr.message });
    }

    const { error: insertErr } = await (supabase as any)
      .from("photos")
      .insert({ path, alt, order_index: orderIndex, published: true });

    setUploading(false);
    if (insertErr) {
      toast.error("Failed to save photo record", { description: insertErr.message });
    } else {
      toast.success("Photo uploaded");
      setFile(null);
      setAlt("");
      setOrderIndex(0);
      (document.getElementById("photo-file") as HTMLInputElement | null)?.value && ((document.getElementById("photo-file") as HTMLInputElement).value = "");
      load();
    }
  };

  const publicUrl = (path: string) => {
    const { data } = (supabase as any).storage.from("gallery").getPublicUrl(path);
    return data.publicUrl as string;
  };

  const save = async (row: PhotoRow) => {
    setSavingId(row.id);
    const { error } = await (supabase as any)
      .from("photos")
      .update({ alt: row.alt, order_index: row.order_index, published: row.published })
      .eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast.error("Save failed", { description: error.message });
    } else {
      toast.success("Saved");
      load();
    }
  };

  const remove = async (row: PhotoRow) => {
    if (!confirm("Delete this photo? This removes it from storage too.")) return;
    const { error: delRowErr } = await (supabase as any).from("photos").delete().eq("id", row.id);
    if (delRowErr) return toast.error("Delete failed", { description: delRowErr.message });
    await (supabase as any).storage.from("gallery").remove([row.path]);
    toast.success("Deleted");
    setItems((prev) => prev.filter((i) => i.id !== row.id));
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold">Manage Photos</h3>
          <p className="text-sm text-muted-foreground">Upload, edit alt text, publish, and order gallery images.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end">
          <input id="photo-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Input placeholder="Alt text (for accessibility/SEO)" value={alt} onChange={(e) => setAlt(e.target.value)} />
          <Input type="number" placeholder="Order" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
          <div className="lg:col-span-2 flex justify-end">
            <Button onClick={upload} disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</Button>
          </div>
        </div>

        <div className="border-t border-border pt-4" />

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No photos yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map((row) => (
              <div key={row.id} className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-center">
                <div className="flex items-center gap-3">
                  <img src={publicUrl(row.path)} alt={row.alt ?? "Photo"} className="w-16 h-16 object-cover rounded-md border border-border" />
                  <span className="text-xs text-muted-foreground break-all">{row.path}</span>
                </div>
                <Input
                  value={row.alt ?? ""}
                  onChange={(e) =>
                    setItems((prev) => prev.map((it) => (it.id === row.id ? { ...it, alt: e.target.value } : it)))
                  }
                  placeholder="Alt text"
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
                    aria-label={`Toggle publish`}
                  />
                  <span className="text-sm">Published</span>
                </div>
                <div className="flex items-center gap-2 justify-end lg:col-span-1">
                  <Button variant="outline" onClick={() => save(row)} disabled={savingId === row.id}>
                    {savingId === row.id ? "Saving…" : "Save"}
                  </Button>
                  <Button variant="destructive" onClick={() => remove(row)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
