import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Clock, Info, Trash2 } from "lucide-react";

interface Notif { id: string; title: string; body: string; type: "success" | "warning" | "info" | "urgent"; time: string; read: boolean; }

const initialNotifs: Notif[] = [
  { id: "1", title: "Hearing Date Reminder", body: "Your Tenant Rights Dispute case hearing is scheduled for June 30, 2026.", type: "urgent", time: "2 hours ago", read: false },
  { id: "2", title: "Document Submitted", body: "Your legal notice for Case #001 has been successfully submitted.", type: "success", time: "1 day ago", read: false },
  { id: "3", title: "New Legal Aid Available", body: "Free legal aid camp in your city (Delhi) on June 25, 2026.", type: "info", time: "2 days ago", read: true },
  { id: "4", title: "Response Received", body: "Your employer has responded to the termination notice. Review required.", type: "warning", time: "3 days ago", read: true },
  { id: "5", title: "Consumer Complaint Resolved", body: "Congratulations! Your consumer complaint against the electronics company has been resolved.", type: "success", time: "5 days ago", read: true },
  { id: "6", title: "Profile Updated", body: "Your profile information has been successfully updated.", type: "info", time: "1 week ago", read: true },
];

const typeStyle = {
  success: { icon: <CheckCircle size={16} />, color: "#10b981", darkColor: "#4ade80", bg: "var(--app-chip-green-bg)", border: "var(--app-chip-green-border)" },
  warning: { icon: <Clock size={16} />, color: "#d97706", darkColor: "#fbbf24", bg: "var(--app-chip-amber-bg)", border: "var(--app-chip-amber-border)" },
  urgent: { icon: <AlertCircle size={16} />, color: "#dc2626", darkColor: "#f87171", bg: "var(--app-chip-red-bg)", border: "var(--app-chip-red-border)" },
  info: { icon: <Info size={16} />, color: "#6366f1", darkColor: "#818cf8", bg: "var(--app-chip-bg)", border: "var(--app-chip-border)" },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifs);

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const remove = (id: string) => setNotifs(n => n.filter(x => x.id !== id));
  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold" style={{ color: "var(--app-text-primary)" }}>Notifications</h1>
            {unread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "var(--app-chip-red-bg)", color: "var(--app-danger-color)", border: "1px solid var(--app-chip-red-border)" }}>
                {unread}
              </span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--app-text-secondary)" }}>{unread} unread notifications</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="text-xs font-medium" style={{ color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}>Mark all read</button>
        )}
      </motion.div>

      {notifs.length === 0 ? (
        <div className="text-center py-20">
          <Bell size={40} style={{ color: "var(--app-text-muted)", margin: "0 auto 12px", opacity: 0.3 }} />
          <p className="text-sm font-medium" style={{ color: "var(--app-text-secondary)" }}>No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map((n, i) => {
            const s = typeStyle[n.type];
            return (
              <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => markRead(n.id)} className="card p-4 flex gap-4 cursor-pointer relative overflow-hidden">
                {!n.read && <div className="absolute top-0 left-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: s.color }} />}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold" style={{ color: n.read ? "var(--app-text-secondary)" : "var(--app-text-primary)" }}>{n.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />}
                      <button onClick={e => { e.stopPropagation(); remove(n.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-muted)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--app-danger-color)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--app-text-muted)"}
                      ><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--app-text-secondary)" }}>{n.body}</p>
                  <p className="text-xs mt-2" style={{ color: "var(--app-text-muted)" }}>{n.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
