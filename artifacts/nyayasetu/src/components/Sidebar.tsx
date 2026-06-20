import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, MapPin, MessageSquare, FileText,
  Bell, User, LogOut, Scale
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, label: "My Cases", href: "/cases" },
  { icon: MapPin, label: "Find Legal Aid", href: "/locator" },
  { icon: MessageSquare, label: "Legal Guide", href: "/guide" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: User, label: "Profile", href: "/profile" },
];

interface Props {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: Props) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "var(--app-sidebar-bg)",
        borderRight: "1px solid var(--app-sidebar-border)",
        backdropFilter: "blur(24px)",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}
        >
          <Scale size={18} color="white" />
        </div>
        <div>
          <p className="font-display font-bold text-base leading-tight" style={{ color: "var(--app-text-primary)" }}>NyayaSetu</p>
          <p className="text-xs" style={{ color: "var(--app-text-muted)", letterSpacing: "0.1em" }}>LEGAL AID</p>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div
          className="mx-4 mb-4 px-3 py-3 rounded-xl"
          style={{ background: "var(--app-info-bg)", border: "1px solid var(--app-info-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
            >
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--app-text-primary)" }}>{user.firstName} {user.lastName}</p>
              <p className="text-xs truncate" style={{ color: "var(--app-text-muted)" }}>{user.city}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = location === href || (href === "/dashboard" && location === "/");
          return (
            <Link key={href} href={href} onClick={onClose}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer ${active ? "nav-item-active" : "nav-item"}`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span className="text-sm font-medium">{label}</span>
                {active && (
                  <motion.div
                    layoutId="active-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--app-nav-active-color)" }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 pt-2">
        <div className="h-px mb-4" style={{ background: "var(--app-separator)" }} />
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all"
          style={{ color: "var(--app-text-muted)", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--app-danger-bg)"; (e.currentTarget as HTMLElement).style.color = "var(--app-danger-color)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--app-text-muted)"; }}
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
