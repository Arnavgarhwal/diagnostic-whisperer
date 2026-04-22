import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  FolderOpen,
  Download,
  Trash2,
  Eye,
  Calendar,
  Search,
  Plus,
  File,
  Image,
  FileImage,
  X,
  FileDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { exportHealthRecords } from "@/utils/exportData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type RecordType = "prescription" | "report" | "scan" | "vaccination" | "insurance" | "other";

interface DbRecord {
  id: string;
  title: string;
  record_type: string | null;
  record_date: string | null;
  notes: string | null;
  file_url: string | null;
  created_at: string;
}

const recordCategories: { value: RecordType | "all"; label: string }[] = [
  { value: "all", label: "All Records" },
  { value: "prescription", label: "Prescriptions" },
  { value: "report", label: "Lab Reports" },
  { value: "scan", label: "Scans & Imaging" },
  { value: "vaccination", label: "Vaccinations" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

const HealthRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<DbRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RecordType | "all">("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DbRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadForm, setUploadForm] = useState<{
    name: string;
    type: RecordType;
    doctor: string;
    hospital: string;
    notes: string;
  }>({ name: "", type: "prescription", doctor: "", hospital: "", notes: "" });

  const loadRecords = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("medical_records")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast({ title: "Failed to load records", description: error.message, variant: "destructive" });
    } else {
      setRecords(data ?? []);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(search.toLowerCase()) ||
      (record.notes ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || record.record_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = async () => {
    if (!user) return;
    if (!uploadForm.name.trim()) {
      toast({ title: "Name required", description: "Please give the record a name.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const meta = [uploadForm.doctor && `Doctor: ${uploadForm.doctor}`, uploadForm.hospital && `Hospital: ${uploadForm.hospital}`, uploadForm.notes]
      .filter(Boolean)
      .join("\n");

    const { error } = await supabase.from("medical_records").insert({
      user_id: user.id,
      title: uploadForm.name,
      record_type: uploadForm.type,
      record_date: new Date().toISOString().split("T")[0],
      notes: meta || null,
    });
    setIsSaving(false);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }
    setShowUploadModal(false);
    setUploadForm({ name: "", type: "prescription", doctor: "", hospital: "", notes: "" });
    toast({ title: "Record Saved", description: "Your health record has been saved securely." });
    loadRecords();
  };

  const handleDelete = async (id: string) => {
    const prev = records;
    setRecords(records.filter((r) => r.id !== id));
    const { error } = await supabase.from("medical_records").delete().eq("id", id);
    if (error) {
      setRecords(prev);
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Record Deleted" });
  };

  const getTypeBadge = (type: string | null) => {
    const t = (type ?? "other") as RecordType;
    const styles: Record<RecordType, string> = {
      prescription: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      report: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      scan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      vaccination: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      insurance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return styles[t] ?? styles.other;
  };

  const exportRows = records.map((r) => ({
    id: r.id,
    name: r.title,
    type: (r.record_type ?? "other") as string,
    date: r.record_date ?? r.created_at.split("T")[0],
    fileType: "pdf",
    size: "—",
    notes: r.notes ?? "",
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <FolderOpen className="w-3 h-3 mr-1" />
              Health Records
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your <span className="text-gradient">Medical Documents</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Securely stored in your private cloud — only you can see them.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Records", value: records.length, icon: FileText },
              { label: "Prescriptions", value: records.filter((r) => r.record_type === "prescription").length, icon: File },
              { label: "Lab Reports", value: records.filter((r) => r.record_type === "report").length, icon: FileText },
              { label: "Scans", value: records.filter((r) => r.record_type === "scan").length, icon: Image },
            ].map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search records..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12" />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                exportHealthRecords(exportRows);
                toast({ title: "Export Complete", description: "Health records exported as CSV." });
              }}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="hero" onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {recordCategories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <FileImage className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{record.title}</h3>
                      <Badge className={`${getTypeBadge(record.record_type)} text-xs mt-1`}>
                        {record.record_type ?? "other"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(record.record_date ?? record.created_at).toLocaleDateString()}</span>
                    </div>
                    {record.notes && <p className="line-clamp-2 whitespace-pre-line">{record.notes}</p>}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">Private</span>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelectedRecord(record)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" disabled>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredRecords.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No records found</h3>
              <p className="text-muted-foreground mb-4">
                {search ? "Try a different search term" : "Add your first health record"}
              </p>
              <Button variant="hero" onClick={() => setShowUploadModal(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add Health Record</h2>
                <Button size="icon" variant="ghost" onClick={() => setShowUploadModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Document Name *</label>
                  <Input
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    placeholder="e.g., Blood Test Report"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Document Type</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-border bg-background"
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as RecordType })}
                  >
                    <option value="prescription">Prescription</option>
                    <option value="report">Lab Report</option>
                    <option value="scan">Scan / Imaging</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Doctor</label>
                    <Input
                      value={uploadForm.doctor}
                      onChange={(e) => setUploadForm({ ...uploadForm, doctor: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Hospital/Clinic</label>
                    <Input
                      value={uploadForm.hospital}
                      onChange={(e) => setUploadForm({ ...uploadForm, hospital: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Notes</label>
                  <Input
                    value={uploadForm.notes}
                    onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                    placeholder="Optional notes"
                  />
                </div>

                <Button variant="hero" className="w-full" onClick={handleUpload} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Save Record
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedRecord.title}</h2>
                <Button size="icon" variant="ghost" onClick={() => setSelectedRecord(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Badge className={`${getTypeBadge(selectedRecord.record_type)} mb-3`}>
                {selectedRecord.record_type ?? "other"}
              </Badge>
              <p className="text-sm text-muted-foreground mb-2">
                <Calendar className="w-3 h-3 inline mr-1" />
                {new Date(selectedRecord.record_date ?? selectedRecord.created_at).toLocaleDateString()}
              </p>
              {selectedRecord.notes && (
                <div className="p-3 rounded-lg bg-accent/30 text-sm whitespace-pre-line">{selectedRecord.notes}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default HealthRecords;
