import { Link } from "wouter";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useGetLearningContent, useBookmarkContent } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListLearningContentQueryKey, getGetLearningContentQueryKey, getListBookmarksQueryKey } from "@workspace/api-client-react";

export default function LearningDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: content, isLoading, refetch } = useGetLearningContent(id);
  const bookmarkMutation = useBookmarkContent();
  const c = content as any;

  const handleBookmark = () => {
    bookmarkMutation.mutate(
      { id, data: { bookmarked: !c.isBookmarked } },
      {
        onSuccess: () => {
          refetch();
          queryClient.invalidateQueries({ queryKey: getListLearningContentQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListBookmarksQueryKey() });
          toast({ title: c.isBookmarked ? "Bookmark removed" : "Bookmarked" });
        },
      }
    );
  };

  if (isLoading) return <AppLayout><Skeleton className="h-64" /></AppLayout>;
  if (!c) return <AppLayout><div className="text-center py-16 text-muted-foreground">Content not found</div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/learning">
          <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Learning Hub
          </Button>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize">{c.type}</Badge>
              {c.tags?.map((tag: string, i: number) => (
                <span key={i} className="text-xs text-muted-foreground">#{tag}</span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{c.title}</h1>
            <p className="text-muted-foreground mt-2">{c.summary}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            className={c.isBookmarked ? "text-primary border-primary" : ""}
          >
            <Bookmark className={`h-4 w-4 mr-1 ${c.isBookmarked ? "fill-current" : ""}`} />
            {c.isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">{c.content}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
