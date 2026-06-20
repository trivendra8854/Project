import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Star, Search, Filter, Clock, CheckCircle } from "lucide-react";

const lawyers = [
  { name: "Adv. Priya Sharma", specialization: "Civil & Property Law", city: "Delhi", rating: 4.8, experience: "12 years", phone: "+91 98765 43210", free: true, available: true },
  { name: "Adv. Rahul Gupta", specialization: "Criminal Defense", city: "Mumbai", rating: 4.6, experience: "8 years", phone: "+91 87654 32109", free: false, available: true },
  { name: "Adv. Sunita Rao", specialization: "Family & Divorce Law", city: "Bangalore", rating: 4.9, experience: "15 years", phone: "+91 76543 21098", free: true, available: false },
  { name: "Adv. Arun Kumar", specialization: "Labour & Employment", city: "Chennai", rating: 4.7, experience: "10 years", phone: "+91 65432 10987", free: false, available: true },
  { name: "Adv. Meena Verma", specialization: "Consumer Rights", city: "Hyderabad", rating: 4.5, experience: "6 years", phone: "+91 54321 09876", free: true, available: true },
  { name: "Adv. Vikram Singh", specialization: "Corporate & Tax Law", city: "Pune", rating: 4.8, experience: "18 years", phone: "+91 43210 98765", free: false, available: false },
];

const cities = ["All Cities", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune"];
const specs = ["All Specializations", "Civil & Property Law", "Criminal Defense", "Family & Divorce Law", "Labour & Employment", "Consumer Rights", "Corporate & Tax Law"];

export default function LocatorPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All Cities");
  const [spec, setSpec] = useState("All Specializations");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = lawyers.filter(l => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.specialization.toLowerCase().includes(search.toLowerCase())) return false;
    if (city !== "All Cities" && l.city !== city) return false;
    if (spec !== "All Specializations" && l.specialization !== spec) return false;
    if (freeOnly && !l.free) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--app-text-primary)" }}>Find Legal Aid</h1>
        <p className="text-sm mt-1" style={{ color: "var(--app-text-secondary)" }}>Connect with qualified lawyers near you — many offer free consultations</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--app-text-muted)" }} />
          <input className="input-field" style={{ paddingLeft: "2.5rem" }} placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="input-field" style={{ width: "auto", flexShrink: 0, cursor: "pointer", background: "var(--app-option-bg)" }} value={city} onChange={e => setCity(e.target.value)}>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input-field" style={{ width: "auto", flexShrink: 0, cursor: "pointer", background: "var(--app-option-bg)" }} value={spec} onChange={e => setSpec(e.target.value)}>
            {specs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => setFreeOnly(v => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={freeOnly
              ? { background: "var(--app-chip-green-bg)", border: "1px solid var(--app-chip-green-border)", color: "#10b981" }
              : { background: "var(--app-input-bg)", border: "1px solid var(--app-input-border)", color: "var(--app-text-secondary)" }
            }
          >
            <Filter size={14} /> Free Only
          </button>
        </div>
      </motion.div>

      <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>{filtered.length} lawyers found</p>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((l, i) => (
          <motion.div key={l.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontSize: "1.1rem" }}>
                {l.name.split(" ")[1]?.[0] || l.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight" style={{ color: "var(--app-text-primary)" }}>{l.name}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star size={11} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                    <span className="text-xs font-medium" style={{ color: "#f59e0b" }}>{l.rating}</span>
                  </div>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--app-text-secondary)" }}>{l.specialization}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {l.free && <span className="chip chip-green" style={{ padding: "2px 8px", fontSize: "10px" }}>Free Aid</span>}
                  <span className={`chip ${l.available ? "chip-green" : "chip-amber"}`} style={{ padding: "2px 8px", fontSize: "10px", display: "flex", alignItems: "center", gap: "3px" }}>
                    {l.available ? <CheckCircle size={9} /> : <Clock size={9} />}
                    {l.available ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--app-text-muted)" }}>
              <div className="flex items-center gap-1.5"><MapPin size={12} />{l.city}</div>
              <div className="flex items-center gap-1.5"><Clock size={12} />{l.experience} exp.</div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${l.phone}`} className="btn-primary flex-1 flex items-center justify-center gap-2" style={{ padding: "0.5rem", fontSize: "0.8rem" }}><Phone size={14} /> Call</a>
              <button className="btn-ghost flex-1" style={{ padding: "0.5rem", fontSize: "0.8rem" }}>View Profile</button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <MapPin size={40} style={{ color: "var(--app-text-muted)", margin: "0 auto 12px", opacity: 0.4 }} />
          <p className="text-sm font-medium" style={{ color: "var(--app-text-secondary)" }}>No lawyers match your filters</p>
          <p className="text-xs mt-1" style={{ color: "var(--app-text-muted)" }}>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
