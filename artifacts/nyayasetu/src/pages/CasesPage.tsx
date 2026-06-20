import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Plus, X, Clock, CheckCircle, AlertCircle, Calendar, Tag, ChevronDown } from "lucide-react";

interface Case {
  id: string;
  title: string;
  category: string;
  status: "active" | "pending" | "resolved";
  description: string;
  filedDate: string;
  nextDate: string;
  notes: string;
}

const categories = ["Civil", "Criminal", "Family", "Consumer", "Labour", "Property", "Other"];

const initialCases: Case[] = [
  { id: "1", title: "Tenant Rights Dispute", category: "Civil", status: "active", description: "Landlord refusing to return security deposit after vacating the property.", filedDate: "2026-05-15", nextDate: "2026-06-30", notes: "Sent legal notice. Awaiting response." },
  { id: "2", title: "Employment Termination", category: "Labour", status: "pending", description: "Wrongful termination without due notice from employer.", filedDate: "2026-06-01", nextDate: "2026-07-05", notes: "Gathering payslips and employment documents." },
  { id: "3", title: "Consumer Complaint - Electronics", category: "Consumer", status: "resolved", description: "Defective laptop not replaced under warranty by manufacturer.", filedDate: "2026-03-20", nextDate: "-", notes: "Complaint resolved. Replacement received." },
];

const chipMap: Record<string, string> = { active: "chip", pending: "chip chip-amber", resolved: "chip chip-green" };

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "Civil", status: "active", description: "", nextDate: "", notes: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const addCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setCases(c => [...c, { ...form, id: Date.now().toString(), filedDate: new Date().toISOString().slice(0, 10), status: form.status as Case["status"] }]);
    setForm({ title: "", category: "Civil", status: "active", description: "", nextDate: "", notes: "" });
    setShowModal(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--app-text-primary)" }}>My Cases</h1>
          <p className="text-sm mt-1" style={{ color: "var(--app-text-secondary)" }}>{cases.length} cases tracked</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2" style={{ width: "auto", padding: "0.625rem 1.25rem" }}>
          <Plus size={16} /> New Case
        </button>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {["All", "Active", "Pending", "Resolved"].map(f => (
          <button key={f} className="chip" style={{ cursor: "pointer" }}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {cases.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: i * 0.05 }} className="card overflow-hidden">
              <div className="p-4 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--app-chip-bg)" }}>
                  <Scale size={18} style={{ color: "#6366f1" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--app-text-primary)" }}>{c.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="chip" style={{ padding: "2px 8px", fontSize: "11px" }}>{c.category}</span>
                        <span className={`${chipMap[c.status]} flex items-center gap-1`} style={{ padding: "2px 8px", fontSize: "11px" }}>
                          {c.status === "active" && <AlertCircle size={10} />}
                          {c.status === "pending" && <Clock size={10} />}
                          {c.status === "resolved" && <CheckCircle size={10} />}
                          {c.status}
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={16} style={{ color: "var(--app-text-muted)", transform: expanded === c.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0, marginTop: 2 }} />
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {expanded === c.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--app-separator)" }}>
                      <div className="pt-3">
                        <p className="text-xs font-medium mb-1" style={{ color: "var(--app-text-muted)" }}>Description</p>
                        <p className="text-sm" style={{ color: "var(--app-text-secondary)" }}>{c.description}</p>
                      </div>
                      <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} style={{ color: "var(--app-text-muted)" }} />
                          <span className="text-xs" style={{ color: "var(--app-text-muted)" }}>Filed: {c.filedDate}</span>
                        </div>
                        {c.nextDate && c.nextDate !== "-" && (
                          <div className="flex items-center gap-2">
                            <Clock size={13} style={{ color: "#d97706" }} />
                            <span className="text-xs" style={{ color: "#d97706" }}>Next: {c.nextDate}</span>
                          </div>
                        )}
                      </div>
                      {c.notes && (
                        <div className="rounded-xl p-3" style={{ background: "var(--app-input-bg)", border: "1px solid var(--app-input-border)" }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Tag size={11} style={{ color: "var(--app-text-muted)" }} />
                            <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Notes</p>
                          </div>
                          <p className="text-xs" style={{ color: "var(--app-text-secondary)" }}>{c.notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} className="w-full max-w-lg rounded-2xl p-6" style={{ background: "var(--app-modal-bg)", border: "1px solid var(--app-modal-border)" }}>
              <div className="flex items-center justify-between mb-6">
                <p className="font-display text-lg font-bold" style={{ color: "var(--app-text-primary)" }}>Add New Case</p>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-muted)" }}><X size={20} /></button>
              </div>
              <form onSubmit={addCase} className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--app-text-muted)" }}>Case Title *</label>
                  <input className="input-field" placeholder="e.g. Tenant Rights Dispute" value={form.title} onChange={set("title")} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--app-text-muted)" }}>Category</label>
                    <select className="input-field" value={form.category} onChange={set("category")} style={{ cursor: "pointer", background: "var(--app-option-bg)" }}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--app-text-muted)" }}>Status</label>
                    <select className="input-field" value={form.status} onChange={set("status")} style={{ cursor: "pointer", background: "var(--app-option-bg)" }}>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--app-text-muted)" }}>Next Hearing Date</label>
                  <input className="input-field" type="date" value={form.nextDate} onChange={set("nextDate")} style={{ colorScheme: "auto" }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--app-text-muted)" }}>Description</label>
                  <textarea className="input-field" placeholder="Briefly describe your case..." value={form.description} onChange={set("description")} rows={3} style={{ resize: "none" }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--app-text-muted)" }}>Notes</label>
                  <textarea className="input-field" placeholder="Any additional notes..." value={form.notes} onChange={set("notes")} rows={2} style={{ resize: "none" }} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Add Case</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
