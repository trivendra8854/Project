import { Link } from "wouter";
import { Users, FileText, FolderOpen, MessageSquare, TrendingUp } from "lucide-react";
import { useGetAdminStats } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function StatCard({ title, value, icon: Icon, desc }: { title: string; value: number; icon: any; desc?: string }) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-3xl font-bold text-foreground">{value.toLocaleString("en-IN")}</p>
        {desc && <p className="text-xs text-muted-foreground mt-1">{desc}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();
  const s = stats as any;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Platform overview and analytics</p>
          </div>
          <Link href="/admin/users">
            <Button variant="outline" size="sm"><Users className="mr-2 h-4 w-4" /> Manage Users</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Users" value={s?.totalUsers || 0} icon={Users} desc={`+${s?.newUsersThisMonth || 0} this month`} />
              <StatCard title="Documents" value={s?.totalDocuments || 0} icon={FolderOpen} />
              <StatCard title="Complaints" value={s?.totalComplaints || 0} icon={FileText} />
              <StatCard title="AI Sessions" value={s?.totalSessions || 0} icon={MessageSquare} />
            </div>

            {s?.topComplaintTypes?.length > 0 && (
              <Card className="border-border">
                <CardHeader><CardTitle className="text-base">Complaints by Type</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={s.topComplaintTypes}>
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
