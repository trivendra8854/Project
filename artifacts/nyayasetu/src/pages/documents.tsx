import { useState, useRef } from "react";
import { FolderOpen, Upload, Pencil, Trash2, FileText, Image, File } from "lucide-react";
import { useListDocuments, useUpdateDocument, useDeleteDocument } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListDocumentsQueryKey } from "@workspace/api-client-react";

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) return <Image className="h-8 w-8 text-blue-500" />;
  if (mimeType === "application/pdf") return <FileText className="h-8 w-8 text-red-500" />;
  return <File className="h-8 w-8 text-gray-500" />;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Documents() {
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const params: any = {};
  if (search) params.q = search;
  const { data: documents, isLoading, refetch } = useListDocuments(params);
  const updateMutation = useUpdateDocument();
  const deleteMutation = useDeleteDocument();

  const docList = (documents as any[]) || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      await refetch();
      toast({ title: "Document uploaded", description: file.name });
    } catch {
      toast({ title: "Upload failed", description: "Could not upload file", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRename = (doc: any) => {
    if (editingId === doc.id) {
      updateMutation.mutate(
        { id: doc.id, data: { name: editName } },
        {
          onSuccess: () => { setEditingId(null); refetch(); toast({ title: "Renamed" }); },
        }
      );
    } else {
      setEditingId(doc.id);
      setEditName(doc.name);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteMutation.mutate({ id } as any, {
      onSuccess: () => { refetch(); toast({ title: "Document deleted" }); },
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Document Vault</h1>
            <p className="text-muted-foreground mt-1">Securely store your important legal documents</p>
          </div>
          <div>
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp" onChange={handleUpload} />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" /> {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </div>

        <Input
          placeholder="Search documents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {isLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : docList.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-semibold text-foreground mb-1">No documents yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload your first document to keep it safe and accessible</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Upload your first document
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {docList.map((doc: any) => (
              <Card key={doc.id} className="border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  <FileIcon mimeType={doc.mimeType} />
                  <div className="flex-1 min-w-0">
                    {editingId === doc.id ? (
                      <Input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="h-7 text-sm"
                        onKeyDown={e => e.key === "Enter" && handleRename(doc)}
                      />
                    ) : (
                      <p className="font-medium text-foreground line-clamp-1">{doc.name}</p>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{formatSize(doc.size)}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString("en-IN")}</span>
                      {doc.category && <Badge variant="secondary" className="text-xs">{doc.category}</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRename(doc)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                      {editingId === doc.id && <span className="ml-1 text-xs">Save</span>}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
