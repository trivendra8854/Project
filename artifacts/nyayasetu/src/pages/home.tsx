import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Scale, FileText, Map, Shield, ArrowRight, Gavel, BookOpen, Users, Phone, Mail, Globe, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LanguageSelector } from "@/components/language-selector";

const FEATURES = [
  { icon: Shield, title: "Know Your Rights", desc: "Clear explanations of your legal rights covering property, consumer, labor, and civil laws.", href: "/rights" },
  { icon: FileText, title: "Draft Complaints", desc: "Answer a few questions and our system generates legally sound complaints ready for submission.", href: "/complaints/new" },
  { icon: Map, title: "Guided Journeys", desc: "Step-by-step roadmaps for common legal scenarios like property disputes and consumer cases.", href: "/journeys" },
  { icon: BookOpen, title: "Legal Education", desc: "Plain-language guides, FAQs and tips to help you understand Indian law.", href: "/learning" },
  { icon: Users, title: "Find Legal Aid", desc: "Connect with lawyers, NGOs, and District Legal Services Authorities near you.", href: "/legalaid" },
  { icon: Gavel, title: "AI Legal Assistant", desc: "Ask any legal question and get instant guidance powered by AI.", href: "/chat" },
];

export default function Home() {
  const { token } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(38, 45%, 96%)" }}>
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: "hsl(25, 65%, 35%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5" style={{ background: "hsl(25, 65%, 35%)", transform: "translate(-30%, 30%)" }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] opacity-3 -translate-x-1/2 -translate-y-1/2">
          <svg width="100%" height="100%" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="280" stroke="hsl(25, 65%, 35%)" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.15" />
            <circle cx="300" cy="300" r="200" stroke="hsl(25, 65%, 35%)" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.1" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="NyayaSetu Logo" className="h-12 w-12 rounded-full object-cover shadow-sm" />
            <div>
              <span className="font-serif text-xl font-bold text-foreground block leading-tight">NyayaSetu</span>
              <span className="text-xs text-muted-foreground">Bridging Justice</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
            <Link href="/rights" className="text-foreground/70 hover:text-primary transition-colors">Know Your Rights</Link>
            <Link href="/schemes" className="text-foreground/70 hover:text-primary transition-colors">Govt Schemes</Link>
            <Link href="/legalaid" className="text-foreground/70 hover:text-primary transition-colors">Find Help</Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            {!token ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden md:flex">Sign In</Button>
                </Link>
                <Link href="/login?tab=register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button size="sm">
                  Go to Dashboard <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1">
          <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
            <div className="max-w-3xl space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border text-xs font-semibold text-primary border-primary/20 bg-primary/5">
                <Gavel className="h-3 w-3" /> India's Legal Operating System
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Legal guidance that feels like{" "}
                <span className="text-primary italic">a knowledgeable friend.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                NyayaSetu empowers everyday Indian citizens to navigate the legal system with confidence. Draft complaints, understand your rights, and track your legal journeys — all in one secure place.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                {!token ? (
                  <>
                    <Link href="/login?tab=register">
                      <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                        Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/rights">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                        Explore Rights
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard">
                    <Button size="lg" className="h-12 px-8 text-base">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
              {[
                { value: "10,000+", label: "Citizens Helped" },
                { value: "50+", label: "Legal Rights Covered" },
                { value: "24/7", label: "AI Legal Assistance" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Feature Grid */}
          <section className="py-16 border-y" style={{ background: "hsl(38, 40%, 97%)" }}>
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Everything you need, simply explained</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">We break down complex legal processes into clear, actionable steps tailored for Indian citizens.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {FEATURES.map((f) => (
                  <Link key={f.href} href={token ? f.href : "/login"}>
                    <div className="group bg-card rounded-xl border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <f.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                      <div className="flex items-center gap-1 mt-3 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA section */}
          {!token && (
            <section className="py-16 container mx-auto px-4 text-center">
              <div className="max-w-2xl mx-auto bg-primary/5 rounded-2xl border border-primary/15 p-10">
                <Gavel className="h-10 w-10 text-primary mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Ready to know your rights?</h2>
                <p className="text-muted-foreground mb-6">Join thousands of citizens who use NyayaSetu to protect their legal rights and navigate the system with confidence.</p>
                <Link href="/login?tab=register">
                  <Button size="lg" className="h-12 px-8">
                    Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t" style={{ background: "hsl(25, 50%, 20%)" }}>
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/logo.jpeg" alt="NyayaSetu Logo" className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <span className="font-serif text-lg font-bold text-white block">NyayaSetu</span>
                    <span className="text-xs text-white/50">Bridging Justice</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">Empowering Indian citizens with accessible legal knowledge, tools, and support since 2024.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Contact Us</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary/70 shrink-0" /> Toll-Free: 1800-11-NYAYA (69292)</li>
                  <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary/70 shrink-0" /> Customer Care: +91-11-4567-8900</li>
                  <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary/70 shrink-0" /> help@nyayasetu.in</li>
                  <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary/70 shrink-0" /> admin@nyayasetu.in</li>
                  <li className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-primary/70 shrink-0" /> www.nyayasetu.in</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Quick Links</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li><Link href="/rights" className="hover:text-white transition-colors">Know Your Rights</Link></li>
                  <li><Link href="/schemes" className="hover:text-white transition-colors">Government Schemes</Link></li>
                  <li><Link href="/legalaid" className="hover:text-white transition-colors">Find Legal Aid</Link></li>
                  <li><Link href="/learning" className="hover:text-white transition-colors">Legal Learning Hub</Link></li>
                  <li><Link href="/chat" className="hover:text-white transition-colors">AI Legal Assistant</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Legal</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Grievance Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-white/40">© {new Date().getFullYear()} NyayaSetu Technologies Pvt. Ltd. All rights reserved.</p>
              <p className="text-xs text-white/30">CIN: U74999DL2024PTC123456 | Registered in India</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
