import { Link } from "wouter";
import { FileText, FolderOpen, Map, Bell, Scale, BookOpen, ArrowRight, TrendingUp, Users, Building } from "lucide-react";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  const quickActions = [
    { href: "/rights", label: "Explore Your Rights", icon: Scale, desc: "Know your legal rights" },
    { href: "/complaints/new", label: "File a Complaint", icon: FileText, desc: "Generate complaint letter" },
    { href: "/documents", label: "Manage Documents", icon: FolderOpen, desc: "Safe document vault" },
    { href: "/journeys", label: "Start a Journey", icon: Map, desc: "Guided legal paths" },
    { href: "/schemes", label: "Find Schemes", icon: Building, desc: "Government benefits" },
    { href: "/learning", label: "Learn the Law", icon: BookOpen, desc: "Legal education hub" },
    { href: "/legalaid", label: "Find Legal Aid", icon: Users, desc: "Lawyers & NGOs near you" },
    { href: "/chat", label: "AI Legal Help", icon: TrendingUp, desc: "Ask any legal question" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{stats?.welcomeMessage || "Welcome back!"}</h1>
          <p className="text-muted-foreground mt-1">Here's a summary of your legal activity</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Documents Stored" value={stats?.totalDocuments || 0} icon={FolderOpen} color="bg-primary/10 text-primary" />
          <StatCard title="Complaints Filed" value={stats?.totalComplaints || 0} icon={FileText} color="bg-amber-100 text-amber-700" />
          <StatCard title="Active Journeys" value={stats?.activeJourneys || 0} icon={Map} color="bg-emerald-100 text-emerald-700" />
          <StatCard title="Notifications" value={stats?.unreadNotifications || 0} icon={Bell} color="bg-blue-100 text-blue-700" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="border-border cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all group">
                  <CardContent className="p-4">
                    <action.icon className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-foreground">{action.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats?.recentComplaints && stats.recentComplaints.length > 0 && (
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Recent Complaints</CardTitle>
                <Link href="/complaints">
                  <Button variant="ghost" size="sm" className="text-primary h-7">View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {stats.recentComplaints.slice(0, 3).map((c: any) => (
                  <Link key={c.id} href={`/complaints/${c.id}`}>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{c.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{c.type.replace(/_/g, " ")}</p>
                      </div>
                      <Badge variant={c.status === "submitted" ? "default" : "secondary"} className="text-xs capitalize">
                        {c.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {stats?.featuredSchemes && stats.featuredSchemes.length > 0 && (
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Featured Schemes</CardTitle>
                <Link href="/schemes">
                  <Button variant="ghost" size="sm" className="text-primary h-7">View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {stats.featuredSchemes.slice(0, 3).map((s: any) => (
                  <Link key={s.id} href={`/schemes/${s.id}`}>
                    <div className="py-2 px-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{s.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{s.ministry}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {stats?.legalRightsHighlight && stats.legalRightsHighlight.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Know Your Rights</h2>
              <Link href="/rights">
                <Button variant="ghost" size="sm" className="text-primary">View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.legalRightsHighlight.map((r: any) => (
                <Link key={r.id} href={`/rights/${r.id}`}>
                  <Card className="border-border cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all">
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="text-xs mb-2 capitalize">{r.category.replace(/-/g, " ")}</Badge>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{r.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.summary}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
