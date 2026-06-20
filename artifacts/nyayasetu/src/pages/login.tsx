import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { useLogin, useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultTab = params.get("tab") === "register" ? "register" : "login";
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [showPw, setShowPw] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ fullName: "", email: "", mobile: "", password: "" });

  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  useEffect(() => {
    const p = new URLSearchParams(search);
    setTab(p.get("tab") === "register" ? "register" : "login");
  }, [search]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { data: { email: loginForm.email, password: loginForm.password } },
      {
        onSuccess: (data: any) => { login(data.token); setLocation("/dashboard"); },
        onError: (err: any) => toast({ title: "Login failed", description: err?.data?.error || "Invalid credentials", variant: "destructive" }),
      }
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { data: { fullName: regForm.fullName, email: regForm.email, mobile: regForm.mobile, password: regForm.password } },
      {
        onSuccess: (data: any) => { login(data.token); setLocation("/dashboard"); },
        onError: (err: any) => toast({ title: "Registration failed", description: err?.data?.error || "Could not create account", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "hsl(38, 45%, 96%)" }}>
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: "hsl(25,65%,35%)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-5" style={{ background: "hsl(25,65%,35%)", transform: "translate(-30%,30%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex flex-col items-center gap-2 cursor-pointer">
              <img src="/logo.jpeg" alt="NyayaSetu Logo" className="h-16 w-16 rounded-full object-cover shadow-md" />
              <span className="font-serif text-2xl font-bold text-foreground">NyayaSetu</span>
              <span className="text-xs text-muted-foreground -mt-1">Bridging Justice</span>
            </div>
          </Link>
        </div>

        <Card className="border-border shadow-sm">
          <div className="flex border-b border-border">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <CardContent className="p-6">
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email address</Label>
                  <Input type="email" placeholder="you@example.com" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      required
                      className="pr-10"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  New to NyayaSetu?{" "}
                  <button type="button" onClick={() => setTab("register")} className="text-primary hover:underline font-medium">Create account</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Priya Sharma" value={regForm.fullName} onChange={e => setRegForm(f => ({ ...f, fullName: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Email address</Label>
                  <Input type="email" placeholder="you@example.com" value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Mobile number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input type="tel" placeholder="+91 98765 43210" value={regForm.mobile} onChange={e => setRegForm(f => ({ ...f, mobile: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={regForm.password}
                      onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? "Creating account..." : "Create Account"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-primary hover:underline font-medium">Sign in</button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link href="/" className="hover:text-primary transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
