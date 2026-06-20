import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

interface Props {
  onEnter: () => void;
}

export default function SplashPage({ onEnter }: Props) {
  const [pulse, setPulse] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => setPulse(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const isLight = theme === "light";
  const textPrimary = isLight ? "#1e1b4b" : "#ffffff";
  const textSecondary = isLight ? "rgba(67,56,202,0.7)" : "rgba(148,163,184,0.8)";
  const textMuted = isLight ? "rgba(79,70,229,0.5)" : "rgba(148,163,184,0.5)";
  const orbColor1 = isLight ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.18)";
  const orbColor2 = isLight ? "rgba(139,92,246,0.08)" : "rgba(139,92,246,0.12)";

  return (
    <div
      className="splash-bg min-h-screen flex flex-col items-center justify-center cursor-pointer select-none relative"
      onClick={onEnter}
    >
      {/* Theme toggle */}
      <button
        onClick={e => { e.stopPropagation(); toggleTheme(); }}
        className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "var(--app-card-bg)", border: "1px solid var(--app-card-border)", cursor: "pointer" }}
      >
        {isLight
          ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={textSecondary} strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fbbf24" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        }
      </button>

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{ width: 600, height: 600, left: "50%", top: "30%", transform: "translate(-50%, -50%)", background: `radial-gradient(circle, ${orbColor1} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: 300, height: 300, left: "20%", top: "60%", background: `radial-gradient(circle, ${orbColor2} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: 200, height: 200, right: "15%", top: "25%", background: `radial-gradient(circle, ${orbColor1} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", boxShadow: "0 0 60px rgba(99,102,241,0.45), 0 0 120px rgba(99,102,241,0.2)" }}
          >
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <path d="M26 4L6 16V28C6 38.5 14.5 48 26 50C37.5 48 46 38.5 46 28V16L26 4Z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2" />
              <path d="M16 26H36M16 32H28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="26" cy="20" r="4" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center gap-3"
        >
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight" style={{ color: textPrimary }}>
            Nyaya<span className="gradient-text">Setu</span>
          </h1>
          <div className="w-12 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg, #6366f1, #818cf8)" }} />
          <p className="text-base md:text-lg font-medium tracking-widest uppercase" style={{ color: textSecondary, letterSpacing: "0.2em" }}>
            Justice Made Accessible
          </p>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="max-w-md text-sm md:text-base leading-relaxed"
          style={{ color: textSecondary }}
        >
          Free legal guidance, case tracking, and expert support — all in one place. Your rights, protected.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {["AI Legal Guide", "Case Tracker", "Find Lawyers", "Document Vault"].map(f => (
            <span key={f} className="chip text-xs">{f}</span>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex flex-col items-center gap-3 mt-2"
        >
          <motion.button
            onClick={onEnter}
            className="btn-primary"
            style={{ width: "auto", padding: "0.875rem 2.5rem", fontSize: "0.95rem" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
          <motion.p
            className="text-xs"
            style={{ color: textMuted }}
            animate={pulse ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Free to use · No hidden fees
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 flex items-center gap-2"
        style={{ color: textMuted }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: "0 0 6px #22c55e" }} />
        <span className="text-xs font-medium">Trusted by 50,000+ users across India</span>
      </motion.div>
    </div>
  );
}
