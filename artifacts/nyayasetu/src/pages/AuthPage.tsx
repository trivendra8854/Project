import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock, ArrowRight, Scale, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface Props {
  onSuccess: () => void;
}

export default function AuthPage({ onSuccess }: Props) {
  const { login, signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", city: "", password: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.city || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    signup(form);
    onSuccess();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    const ok = login(form.email, form.password);
    if (ok) {
      onSuccess();
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const iconColor = "var(--app-text-muted)";

  return (
    <div className="splash-bg min-h-screen flex items-center justify-center p-4 md:p-6 relative">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "var(--app-card-bg)", border: "1px solid var(--app-card-border)", cursor: "pointer" }}
      >
        {theme === "dark"
          ? <Sun size={15} style={{ color: "#fbbf24" }} />
          : <Moon size={15} style={{ color: "#6366f1" }} />
        }
      </button>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{ width: 500, height: 500, left: "50%", top: "20%", transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", boxShadow: "0 0 40px rgba(99,102,241,0.35)" }}
          >
            <Scale size={28} color="white" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold" style={{ color: "var(--app-text-primary)" }}>NyayaSetu</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--app-text-muted)", letterSpacing: "0.15em" }}>JUSTICE MADE ACCESSIBLE</p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--app-card-bg)", border: "1px solid var(--app-card-border)", backdropFilter: "blur(24px)" }}
        >
          {/* Tab switcher */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: "var(--app-input-bg)" }}>
            {(["signup", "login"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={mode === tab
                  ? { background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }
                  : { color: "var(--app-text-secondary)", background: "transparent" }
                }
              >
                {tab === "signup" ? "Create Account" : "Sign In"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "signup" ? (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSignup}
                className="flex flex-col gap-4"
              >
                <div>
                  <p className="font-display text-xl font-semibold mb-1" style={{ color: "var(--app-text-primary)" }}>Create your account</p>
                  <p className="text-sm" style={{ color: "var(--app-text-secondary)" }}>Join thousands getting free legal help</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }} />
                    <input className="input-field" style={{ paddingLeft: "2.25rem" }} placeholder="First name" value={form.firstName} onChange={set("firstName")} autoComplete="given-name" />
                  </div>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }} />
                    <input className="input-field" style={{ paddingLeft: "2.25rem" }} placeholder="Last name" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" />
                  </div>
                </div>

                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }} />
                  <input className="input-field" style={{ paddingLeft: "2.25rem" }} placeholder="Phone number" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
                </div>

                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }} />
                  <input className="input-field" style={{ paddingLeft: "2.25rem" }} placeholder="Email address" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
                </div>

                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }} />
                  <input className="input-field" style={{ paddingLeft: "2.25rem" }} placeholder="City" value={form.city} onChange={set("city")} autoComplete="address-level2" />
                </div>

                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }} />
                  <input
                    className="input-field"
                    style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                    placeholder="Password (min. 6 characters)"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: iconColor, background: "none", border: "none", cursor: "pointer" }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {error && (
                  <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "var(--app-chip-red-bg)", border: "1px solid var(--app-chip-red-border)", color: "var(--app-danger-color)" }}>
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-1">
                  Create Account <ArrowRight size={16} />
                </button>

                <p className="text-center text-sm" style={{ color: "var(--app-text-secondary)" }}>
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setMode("login"); setError(""); }} className="font-semibold" style={{ color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}>
                    Login here
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleLogin}
                className="flex flex-col gap-4"
              >
                <div>
                  <p className="font-display text-xl font-semibold mb-1" style={{ color: "var(--app-text-primary)" }}>Welcome back</p>
                  <p className="text-sm" style={{ color: "var(--app-text-secondary)" }}>Sign in to access your legal dashboard</p>
                </div>

                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }} />
                  <input className="input-field" style={{ paddingLeft: "2.25rem" }} placeholder="Email address" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
                </div>

                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }} />
                  <input
                    className="input-field"
                    style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                    placeholder="Password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: iconColor, background: "none", border: "none", cursor: "pointer" }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {error && (
                  <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "var(--app-chip-red-bg)", border: "1px solid var(--app-chip-red-border)", color: "var(--app-danger-color)" }}>
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-1">
                  Sign In <ArrowRight size={16} />
                </button>

                <p className="text-center text-sm" style={{ color: "var(--app-text-secondary)" }}>
                  Don't have an account?{" "}
                  <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="font-semibold" style={{ color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}>
                    Sign up here
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: "var(--app-text-muted)" }}>
          By continuing, you agree to NyayaSetu's Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
