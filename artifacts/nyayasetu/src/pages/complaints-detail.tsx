import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useGetComplaint, useUpdateComplaint, useDeleteComplaint } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function ComplaintDetail({ id }: { id: number }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: complaint, isLoading, refetch } = useGetComplaint(id);
  const updateMutation = useUpdateComplaint();
  const deleteMutation = useDeleteComplaint();

  const c = complaint as any;

  const handleEdit = () => {
    setEditTitle(c.title);
    setEditContent(c.content);
    setEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate(
      { id, data: { title: editTitle, content: editContent } },
      {
        onSuccess: () => {
          setEditing(false);
          refetch();
          toast({ title: "Complaint updated" });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    deleteMutation.mutate({ id } as any, {
      onSuccess: () => {
        setLocation("/complaints");
        toast({ title: "Complaint deleted" });
      },
    });
  };

  const handleDownload = () => {
    if (!c) return;
    const blob = new Blob([c.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <AppLayout><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/complaints">
          <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            {!editing ? (
              <h1 className="text-2xl font-bold text-foreground">{c?.title}</h1>
            ) : (
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-lg font-bold" />
            )}
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary" className="capitalize">{c?.type?.replace(/_/g, " ")}</Badge>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${c?.status === "submitted" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                {c?.status?.replace(/_/g, " ")}
              </span>
              <span className="text-xs text-muted-foreground">{c?.createdAt && new Date(c.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {!editing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleEdit}><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>Download</Button>
                <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>Save</Button>
              </>
            )}
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Complaint Letter</CardTitle>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans bg-muted/30 rounded-md p-4">{c?.content}</pre>
            ) : (
              <Textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
