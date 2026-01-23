import { useState, useEffect } from "react";
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
  Check,
  Filter,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { exportHealthRecords } from "@/utils/exportData";

interface HealthRecord {
  id: number;
  name: string;
  type: "prescription" | "report" | "scan" | "vaccination" | "insurance" | "other";
  date: string;
  doctor?: string;
  hospital?: string;
  fileType: "pdf" | "image" | "document";
  size: string;
  notes?: string;
}

const recordCategories = [
  { value: "all", label: "All Records" },
  { value: "prescription", label: "Prescriptions" },
  { value: "report", label: "Lab Reports" },
  { value: "scan", label: "Scans & Imaging" },
  { value: "vaccination", label: "Vaccinations" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

const mockRecords: HealthRecord[] = [
  {
    id: 1,
    name: "Complete Blood Count Report",
    type: "report",
    date: "2024-01-15",
    doctor: "Dr. Sarah Johnson",
    hospital: "City Medical Center",
    fileType: "pdf",
    size: "245 KB",
    notes: "Annual health checkup results",
  },
  {
    id: 2,
    name: "Prescription - Diabetes Medication",
    type: "prescription",
    date: "2024-01-12",
    doctor: "Dr. Michael Chen",
    hospital: "HealthFirst Clinic",
    fileType: "image",
    size: "1.2 MB",
  },
  {
    id: 3,
    name: "Chest X-Ray",
    type: "scan",
    date: "2024-01-08",
    doctor: "Dr. Emily Williams",
    hospital: "Metro Diagnostics",
    fileType: "image",
    size: "3.5 MB",
  },
  {
    id: 4,
    name: "COVID-19 Vaccination Certificate",
    type: "vaccination",
    date: "2023-08-20",
    hospital: "Government Health Center",
    fileType: "pdf",
    size: "156 KB",
  },
  {
    id: 5,
    name: "Health Insurance Policy",
    type: "insurance",
    date: "2023-12-01",
    fileType: "pdf",
    size: "890 KB",
    notes: "Valid until Dec 2024",
  },
  {
    id: 6,
    name: "MRI Brain Scan Report",
    type: "scan",
    date: "2023-11-15",
    doctor: "Dr. Robert Davis",
    hospital: "Advanced Imaging Center",
    fileType: "pdf",
    size: "5.2 MB",
  },
  {
    id: 7,
    name: "Thyroid Function Test",
    type: "report",
    date: "2024-01-10",
    doctor: "Dr. Priya Sharma",
    hospital: "PathLab Plus",
    fileType: "pdf",
    size: "312 KB",
  },
  {
    id: 8,
    name: "Eye Examination Report",
    type: "other",
    date: "2023-10-22",
    doctor: "Dr. Lisa Anderson",
    hospital: "Vision Care Clinic",
    fileType: "pdf",
    size: "178 KB",
  },
];

const HealthRecords = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    type: "prescription" as HealthRecord["type"],
    doctor: "",
    hospital: "",
    notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("healthai-records");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords(mockRecords);
      localStorage.setItem("healthai-records", JSON.stringify(mockRecords));
    }
  }, []);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(search.toLowerCase()) ||
      record.doctor?.toLowerCase().includes(search.toLowerCase()) ||
      record.hospital?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || record.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    const newRecord: HealthRecord = {
      id: records.length + 1,
      name: uploadForm.name,
      type: uploadForm.type,
      date: new Date().toISOString().split("T")[0],
      doctor: uploadForm.doctor || undefined,
      hospital: uploadForm.hospital || undefined,
      fileType: "pdf",
      size: "1.0 MB",
      notes: uploadForm.notes || undefined,
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem("healthai-records", JSON.stringify(updated));
    setShowUploadModal(false);
    setUploadForm({ name: "", type: "prescription", doctor: "", hospital: "", notes: "" });
    toast({
      title: "Record Uploaded",
      description: "Your health record has been saved successfully.",
    });
  };

  const handleDelete = (id: number) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    localStorage.setItem("healthai-records", JSON.stringify(updated));
    toast({
      title: "Record Deleted",
      description: "The health record has been removed.",
    });
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "image":
        return <FileImage className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: HealthRecord["type"]) => {
    const styles = {
      prescription: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      report: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      scan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      vaccination: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      insurance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return styles[type];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <FolderOpen className="w-3 h-3 mr-1" />
              Health Records
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your <span className="text-gradient">Medical Documents</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Securely store and access all your health records in one place.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Total Records", value: records.length, icon: FileText },
              { label: "Prescriptions", value: records.filter((r) => r.type === "prescription").length, icon: File },
              { label: "Lab Reports", value: records.filter((r) => r.type === "report").length, icon: FileText },
              { label: "Scans", value: records.filter((r) => r.type === "scan").length, icon: Image },
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

          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                exportHealthRecords(records);
                toast({
                  title: "Export Complete",
                  description: "Health records exported as CSV.",
                });
              }}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="hero" onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Record
            </Button>
          </div>

          {/* Category Filter */}
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

          {/* Records Grid */}
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
                    {getFileIcon(record.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{record.name}</h3>
                    <Badge className={`${getTypeBadge(record.type)} text-xs mt-1`}>
                      {record.type}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  {record.doctor && <p>👨‍⚕️ {record.doctor}</p>}
                  {record.hospital && <p>🏥 {record.hospital}</p>}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{record.size}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
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

          {filteredRecords.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No records found</h3>
              <p className="text-muted-foreground mb-4">
                {search ? "Try a different search term" : "Upload your first health record"}
              </p>
              <Button variant="hero" onClick={() => setShowUploadModal(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Record
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
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
                <h2 className="text-xl font-bold">Upload Health Record</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Click or drag files to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Document Name *
                  </label>
                  <Input
                    value={uploadForm.name}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, name: e.target.value })
                    }
                    placeholder="e.g., Blood Test Report"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Document Type
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-border bg-background"
                    value={uploadForm.type}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        type: e.target.value as HealthRecord["type"],
                      })
                    }
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
                    <label className="text-sm font-medium mb-1 block">
                      Doctor Name
                    </label>
                    <Input
                      value={uploadForm.doctor}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, doctor: e.target.value })
                      }
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Hospital/Clinic
                    </label>
                    <Input
                      value={uploadForm.hospital}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, hospital: e.target.value })
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Notes</label>
                  <Input
                    value={uploadForm.notes}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, notes: e.target.value })
                    }
                    placeholder="Add any notes (optional)"
                  />
                </div>

                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleUpload}
                  disabled={!uploadForm.name}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Record
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Record Modal */}
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
              className="bg-background rounded-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Record Details</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedRecord(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-accent/30 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    {getFileIcon(selectedRecord.fileType)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedRecord.name}</h3>
                    <Badge className={getTypeBadge(selectedRecord.type)}>
                      {selectedRecord.type}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(selectedRecord.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">File Size</p>
                    <p className="font-medium">{selectedRecord.size}</p>
                  </div>
                  {selectedRecord.doctor && (
                    <div>
                      <p className="text-muted-foreground">Doctor</p>
                      <p className="font-medium">{selectedRecord.doctor}</p>
                    </div>
                  )}
                  {selectedRecord.hospital && (
                    <div>
                      <p className="text-muted-foreground">Hospital/Clinic</p>
                      <p className="font-medium">{selectedRecord.hospital}</p>
                    </div>
                  )}
                </div>

                {selectedRecord.notes && (
                  <div className="p-3 bg-accent/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedRecord.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="hero" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default HealthRecords;
