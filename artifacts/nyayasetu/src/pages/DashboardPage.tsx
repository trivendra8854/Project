import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "wouter";
import { Scale, FileText, MapPin, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight, Mic } from "lucide-react";

function FolderIcon({ size, style }: { size: number; style?: React.CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
}

const quickActions = [
  { icon: MessageSquare, label: "Legal Guide", desc: "Get instant legal advice", href: "/guide", color: "#6366f1" },
  { icon: FolderIcon, label: "File a Case", desc: "Start tracking your case", href: "/cases", color: "#8b5cf6" },
  { icon: MapPin, label: "Find a Lawyer", desc: "Near you, free or paid", href: "/locator", color: "#06b6d4" },
  { icon: FileText, label: "Documents", desc: "Draft & store legal docs", href: "/documents", color: "#10b981" },
];

const recentActivity = [
  { status: "active", title: "Tenant Rights Dispute", updated: "2 hours ago", category: "Civil" },
  { status: "pending", title: "Employment Termination", updated: "1 day ago", category: "Labour" },
  { status: "resolved", title: "Consumer Complaint - Electronics", updated: "3 days ago", category: "Consumer" },
];

const legalTips = [
  "Always keep copies of all documents related to your case.",
  "You have the right to free legal aid if you cannot afford a lawyer.",
  "File an FIR within 24 hours of an incident for best results.",
  "Consumer complaints must be filed within 2 years of the issue.",
];

const statusChip: Record<string, string> = { active: "chip", pending: "chip chip-amber", resolved: "chip chip-green" };
const statusIcon: Record<string, React.ReactNode> = {
  active: <AlertCircle size={12} />,
  pending: <Clock size={12} />,
  resolved: <CheckCircle size={12} />,
};

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { user } = useAuth();
  const tip = legalTips[Math.floor(Date.now() / 86400000) % legalTips.length];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm mb-1" style={{ color: "var(--app-text-muted)" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-bold" style={{ color: "var(--app-text-primary)" }}>
              Welcome back, {user?.firstName} 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--app-text-secondary)" }}>Here's your legal activity overview</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "var(--app-chip-green-bg)", border: "1px solid var(--app-chip-green-border)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: "0 0 6px #22c55e" }} />
            <span className="text-xs font-medium" style={{ color: "#10b981" }}>Active</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Cases", value: "2", icon: FolderIcon, color: "#6366f1" },
          { label: "Documents", value: "8", icon: FileText, color: "#8b5cf6" },
          { label: "Legal Queries", value: "14", icon: MessageSquare, color: "#06b6d4" },
          { label: "Days Tracked", value: "47", icon: TrendingUp, color: "#10b981" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="font-display text-2xl font-bold" style={{ color: "var(--app-text-primary)" }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--app-text-muted)" }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
        <h2 className="font-display text-base font-semibold mb-4" style={{ color: "var(--app-text-primary)" }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, desc, href, color }) => (
            <Link key={href} href={href}>
              <motion.div className="card p-4 cursor-pointer" whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ color: "var(--app-text-primary)" }}>{label}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--app-text-muted)" }}>{desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* AI CTA */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.25 }}>
        <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: "var(--app-info-bg)", border: "1px solid var(--app-info-border)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <Mic size={22} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: "var(--app-text-primary)" }}>Ask our AI Legal Guide</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--app-text-secondary)" }}>Get answers to your legal questions in plain language</p>
          </div>
          <Link href="/guide">
            <button className="btn-primary" style={{ width: "auto", padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}>Ask Now</button>
          </Link>
        </div>
      </motion.div>

      {/* Recent cases */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-semibold" style={{ color: "var(--app-text-primary)" }}>Recent Cases</h2>
          <Link href="/cases">
            <button className="flex items-center gap-1 text-xs font-medium" style={{ color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}>
              View all <ArrowRight size={12} />
            </button>
          </Link>
        </div>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <motion.div key={i} className="card p-4 flex items-center gap-4 cursor-pointer" whileHover={{ x: 2 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--app-chip-bg)" }}>
                <Scale size={18} style={{ color: "#6366f1" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--app-text-primary)" }}>{item.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--app-text-muted)" }}>{item.category} · {item.updated}</p>
              </div>
              <span className={`${statusChip[item.status]} flex items-center gap-1`}>{statusIcon[item.status]}{item.status}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Legal tip */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.35 }}>
        <div className="rounded-2xl p-5 flex gap-4" style={{ background: "var(--app-success-bg)", border: "1px solid var(--app-success-border)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
            <CheckCircle size={16} style={{ color: "#10b981" }} />
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#10b981" }}>Legal Tip of the Day</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--app-text-secondary)" }}>{tip}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
