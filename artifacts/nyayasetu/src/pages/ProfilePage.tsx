import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Lock, Edit3, Check, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = () => {
    const stored = localStorage.getItem("nyayasetu_user");
    if (stored) localStorage.setItem("nyayasetu_user", JSON.stringify({ ...JSON.parse(stored), ...form }));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initial = `${form.firstName[0] || ""}${form.lastName[0] || ""}`;

  const fields = [
    { icon: User, label: "First Name", key: "firstName", value: form.firstName },
    { icon: User, label: "Last Name", key: "lastName", value: form.lastName },
    { icon: Mail, label: "Email Address", key: "email", value: form.email, type: "email" },
    { icon: Phone, label: "Phone Number", key: "phone", value: form.phone, type: "tel" },
    { icon: MapPin, label: "City", key: "city", value: form.city },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--app-text-primary)" }}>My Profile</h1>
        <p className="text-sm mt-1" style={{ color: "var(--app-text-secondary)" }}>Manage your personal information</p>
      </motion.div>

      {/* Avatar card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-2xl p-6 flex items-center gap-6" style={{ background: "var(--app-info-bg)", border: "1px solid var(--app-info-border)" }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-2xl text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}>
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-xl font-bold" style={{ color: "var(--app-text-primary)" }}>{form.firstName} {form.lastName}</p>
            <p className="text-sm mt-0.5" style={{ color: "var(--app-text-secondary)" }}>{form.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="chip" style={{ padding: "3px 10px" }}>
                <span className="flex items-center gap-1.5"><Shield size={11} />Verified Member</span>
              </span>
              <span className="chip chip-green" style={{ padding: "3px 10px" }}>{form.city}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personal info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-sm" style={{ color: "var(--app-text-primary)" }}>Personal Information</p>
          <button
            onClick={() => editing ? save() : setEditing(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={editing
              ? { background: "var(--app-chip-green-bg)", border: "1px solid var(--app-chip-green-border)", color: "#10b981", cursor: "pointer" }
              : { background: "var(--app-chip-bg)", border: "1px solid var(--app-chip-border)", color: "#6366f1", cursor: "pointer" }
            }
          >
            {editing ? <><Check size={13} /> Save Changes</> : <><Edit3 size={13} /> Edit</>}
          </button>
        </div>

        {saved && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 px-4 py-2.5 rounded-xl flex items-center gap-2" style={{ background: "var(--app-success-bg)", border: "1px solid var(--app-success-border)" }}>
            <Check size={14} style={{ color: "#10b981" }} />
            <p className="text-sm font-medium" style={{ color: "#10b981" }}>Profile updated successfully</p>
          </motion.div>
        )}

        <div className="space-y-3">
          {fields.map(({ icon: Icon, label, key, value, type }) => (
            <div key={key} className="card p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--app-chip-bg)" }}>
                <Icon size={16} style={{ color: "#6366f1" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium mb-1" style={{ color: "var(--app-text-muted)" }}>{label}</p>
                {editing
                  ? <input className="input-field" style={{ padding: "0.4rem 0.6rem", fontSize: "0.875rem" }} value={value} type={type || "text"} onChange={set(key)} />
                  : <p className="text-sm font-medium" style={{ color: "var(--app-text-primary)" }}>{value || "—"}</p>
                }
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="font-semibold text-sm mb-4" style={{ color: "var(--app-text-primary)" }}>Security</p>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--app-chip-bg)" }}>
            <Lock size={16} style={{ color: "#6366f1" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--app-text-primary)" }}>Password</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--app-text-muted)" }}>Last changed during registration</p>
          </div>
          <button className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "var(--app-chip-bg)", border: "1px solid var(--app-chip-border)", color: "#6366f1", cursor: "pointer" }}>
            Change
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <p className="font-semibold text-sm mb-4" style={{ color: "var(--app-text-primary)" }}>Activity Summary</p>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Cases", value: "3" }, { label: "Documents", value: "5" }, { label: "Queries", value: "12" }].map(({ label, value }) => (
            <div key={label} className="card p-4 text-center">
              <p className="font-display text-2xl font-bold" style={{ color: "var(--app-text-primary)" }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--app-text-muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sign out */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <button
          onClick={logout}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "var(--app-danger-bg)", border: "1px solid var(--app-danger-border)", color: "var(--app-danger-color)", cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
        >
          Sign Out from NyayaSetu
        </button>
      </motion.div>
    </div>
  );
}
