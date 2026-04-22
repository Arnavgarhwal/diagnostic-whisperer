import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Plus, Trash2, Edit3, Loader2, Check, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface MyMedicine {
  id: string;
  medicine_name: string;
  dosage: string | null;
  quantity: number;
  notes: string | null;
}

interface FormState {
  medicine_name: string;
  dosage: string;
  quantity: number;
  notes: string;
}

const emptyForm: FormState = { medicine_name: "", dosage: "", quantity: 1, notes: "" };

const MyMedicinesManager = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MyMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("user_medicines")
      .select("id, medicine_name, dosage, quantity, notes")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Couldn't load medicines", description: error.message, variant: "destructive" });
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (m: MyMedicine) => {
    setEditingId(m.id);
    setForm({
      medicine_name: m.medicine_name,
      dosage: m.dosage ?? "",
      quantity: m.quantity,
      notes: m.notes ?? "",
    });
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = async () => {
    if (!user) return;
    if (!form.medicine_name.trim()) {
      toast({ title: "Name required", description: "Please enter the medicine name.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      user_id: user.id,
      medicine_name: form.medicine_name.trim(),
      dosage: form.dosage.trim() || null,
      quantity: Math.max(1, Number(form.quantity) || 1),
      notes: form.notes.trim() || null,
    };
    const op = editingId
      ? supabase.from("user_medicines").update(payload).eq("id", editingId)
      : supabase.from("user_medicines").insert(payload);
    const { error } = await op;
    setSaving(false);
    if (error) {
      toast({ title: editingId ? "Update failed" : "Add failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editingId ? "Medicine updated" : "Medicine added" });
    cancel();
    load();
  };

  const remove = async (id: string) => {
    const prev = items;
    setItems(items.filter((i) => i.id !== id));
    const { error } = await supabase.from("user_medicines").delete().eq("id", id);
    if (error) {
      setItems(prev);
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Removed" });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Pill className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">My Medicines</h2>
            <p className="text-xs text-muted-foreground">Securely synced to your account</p>
          </div>
        </div>
        <Button variant="hero" size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-4 border-2 border-dashed border-primary/30 rounded-xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Medicine name *</label>
                  <Input
                    value={form.medicine_name}
                    onChange={(e) => setForm({ ...form, medicine_name: e.target.value })}
                    placeholder="e.g., Paracetamol 500mg"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Dosage</label>
                  <Input
                    value={form.dosage}
                    onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                    placeholder="e.g., 1 tablet twice daily"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
                  <Input
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                  <Input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="e.g., After meals"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={save} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                  {editingId ? "Update" : "Save"}
                </Button>
                <Button size="sm" variant="ghost" onClick={cancel} disabled={saving}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-3">You haven't added any medicines yet.</p>
          <Button variant="outline" size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-1" /> Add your first medicine
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-accent/30"
            >
              <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center text-xl">💊</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium truncate">{m.medicine_name}</p>
                  <Badge variant="secondary" className="text-xs">Qty {m.quantity}</Badge>
                </div>
                {(m.dosage || m.notes) && (
                  <p className="text-xs text-muted-foreground truncate">
                    {[m.dosage, m.notes].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(m)}>
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => remove(m.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMedicinesManager;
