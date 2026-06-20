import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, Download, Trash2, File, Image, BookOpen, X } from "lucide-react";

interface Doc { id: string; name: string; type: string; size: string; date: string; category: string; }

const initialDocs: Doc[] = [
  { id: "1", name: "Rental Agreement.pdf", type: "pdf", size: "1.2 MB", date: "2026-05-10", category: "Civil" },
  { id: "2", name: "Employment Contract.pdf", type: "pdf", size: "840 KB", date: "2026-04-22", category: "Labour" },
  { id: "3", name: "Legal Notice Draft.docx", type: "doc", size: "310 KB", date: "2026-06-01", category: "Civil" },
  { id: "4", name: "Consumer Complaint.pdf", type: "pdf", size: "650 KB", date: "2026-03-18", category: "Consumer" },
  { id: "5", name: "Property Documents.jpg", type: "image", size: "3.1 MB", date: "2026-02-14", category: "Property" },
];

const fileIcon = (type: string) => {
  if (type === "pdf") return <BookOpen size={18} style={{ color: "#f87171" }} />;
  if (type === "image") return <Image size={18} style={{ color: "#818cf8" }} />;
  return <File size={18} style={{ color: "#60a5fa" }} />;
};

const categories = ["All", "Civil", "Labour", "Consumer", "Property", "Criminal", "Family"];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [filter, setFilter] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Civil");

  const filtered = filter === "All" ? docs : docs.filter(d => d.category === filter);
  const addDoc = () => {
    if (!newName.trim()) return;
    setDocs(d => [...d, { id: Date.now().toString(), name: newName.trim() + (newName.includes(".") ? "" : ".pdf"), type: "pdf", size: "0 KB", date: new Date().toISOString().slice(0, 10), category: newCategory }]);
    setNewName("");
    setShowUpload(false);
  };
  const remove = (id: string) => setDocs(d => d.filter(x => x.id !== id));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--app-text-primary)" }}>Document Vault</h1>
          <p className="text-sm mt-1" style={{ color: "var(--app-text-secondary)" }}>{docs.length} documents stored securely</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2" style={{ width: "auto", padding: "0.625rem 1.25rem" }}>
          <Upload size={15} /> Upload
        </button>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={filter === c
              ? { background: "var(--app-chip-bg)", border: "1px solid var(--app-chip-border)", color: "#6366f1" }
              : { background: "var(--app-input-bg)", border: "1px solid var(--app-input-border)", color: "var(--app-text-muted)" }
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <AnimatePresence>
          {filtered.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--app-input-bg)" }}>
                {fileIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--app-text-primary)" }}>{doc.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="chip" style={{ padding: "2px 7px", fontSize: "10px" }}>{doc.category}</span>
                  <span className="text-xs" style={{ color: "var(--app-text-muted)" }}>{doc.size} · {doc.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-muted)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#6366f1"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--app-text-muted)"}
                ><Download size={14} /></button>
                <button onClick={() => remove(doc.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-muted)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--app-danger-color)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--app-text-muted)"}
                ><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText size={40} style={{ color: "var(--app-text-muted)", margin: "0 auto 12px", opacity: 0.4 }} />
          <p className="text-sm font-medium" style={{ color: "var(--app-text-secondary)" }}>No documents in this category</p>
        </div>
      )}

      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }} onClick={e => e.target === e.currentTarget && setShowUpload(false)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} className="w-full max-w-md rounded-2xl p-6" style={{ background: "var(--app-modal-bg)", border: "1px solid var(--app-modal-border)" }}>
              <div className="flex items-center justify-between mb-6">
                <p className="font-display text-lg font-bold" style={{ color: "var(--app-text-primary)" }}>Add Document</p>
                <button onClick={() => setShowUpload(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-muted)" }}><X size={20} /></button>
              </div>
              <div className="rounded-xl p-8 text-center mb-4" style={{ border: "2px dashed var(--app-chip-border)", background: "var(--app-chip-bg)" }}>
                <Upload size={28} style={{ color: "#6366f1", margin: "0 auto 8px" }} />
                <p className="text-sm font-medium" style={{ color: "var(--app-text-primary)" }}>Click to upload or drag & drop</p>
                <p className="text-xs mt-1" style={{ color: "var(--app-text-muted)" }}>PDF, DOC, JPG, PNG up to 10MB</p>
              </div>
              <div className="space-y-3">
                <input className="input-field" placeholder="Document name" value={newName} onChange={e => setNewName(e.target.value)} />
                <select className="input-field" value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ cursor: "pointer", background: "var(--app-option-bg)" }}>
                  {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowUpload(false)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={addDoc} className="btn-primary flex-1">Add Document</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
