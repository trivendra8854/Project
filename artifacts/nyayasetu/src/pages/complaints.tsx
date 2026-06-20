import { Link } from "wouter";
import { Plus, FileText, ChevronRight } from "lucide-react";
import { useListComplaints } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function Complaints() {
  const { data: complaints, isLoading } = useListComplaints();
  const list = (complaints as any[]) || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Complaints</h1>
            <p className="text-muted-foreground mt-1">Manage and track your legal complaints</p>
          </div>
          <Link href="/complaints/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Complaint
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
            <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-semibold text-foreground mb-1">No complaints yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Generate a professional complaint letter for any legal issue</p>
            <Link href="/complaints/new">
              <Button>Create your first complaint</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((complaint: any) => (
              <Link key={complaint.id} href={`/complaints/${complaint.id}`}>
                <Card className="border-border cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all">
                  <CardContent className="p-4 flex items-center gap-4">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground line-clamp-1">{complaint.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">{complaint.type?.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(complaint.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[complaint.status] || STATUS_COLORS.draft}`}>
                        {complaint.status?.replace(/_/g, " ")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
