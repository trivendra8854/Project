import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import { Menu, Bell, Scale, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

interface Props {
  children: React.ReactNode;
}

const pageLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/": "Dashboard",
  "/cases": "My Cases",
  "/locator": "Find Legal Aid",
  "/guide": "AI Legal Guide",
  "/documents": "Document Vault",
  "/notifications": "Notifications",
  "/profile": "Profile",
};

export default function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const title = pageLabels[location] || "NyayaSetu";

  return (
    <div className="flex h-screen overflow-hidden mesh-bg">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 flex-shrink-0">
        <div className="w-full h-full">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 h-14 md:h-16"
          style={{
            borderBottom: "1px solid var(--app-separator)",
            background: "var(--app-topbar-bg)",
            backdropFilter: "blur(16px)",
            transition: "background 0.3s, border-color 0.3s",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-secondary)" }}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                <Scale size={14} color="white" />
              </div>
              <span className="font-display font-bold text-sm" style={{ color: "var(--app-text-primary)" }}>NyayaSetu</span>
            </div>
            <p className="hidden md:block font-semibold text-sm" style={{ color: "var(--app-text-primary)" }}>{title}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: "var(--app-card-bg)",
                border: "1px solid var(--app-card-border)",
                cursor: "pointer",
              }}
              whileTap={{ scale: 0.9 }}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Sun size={15} style={{ color: "#fbbf24" }} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Moon size={15} style={{ color: "#6366f1" }} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <Link href="/notifications">
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center relative"
                style={{ background: "var(--app-card-bg)", border: "1px solid var(--app-card-border)", cursor: "pointer" }}
              >
                <Bell size={15} style={{ color: "var(--app-text-secondary)" }} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" style={{ boxShadow: "0 0 6px rgba(239,68,68,0.6)" }} />
              </button>
            </Link>

            <Link href="/profile">
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", cursor: "pointer" }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </button>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
