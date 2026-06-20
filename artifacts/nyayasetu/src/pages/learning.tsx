import { useState } from "react";
import { Link } from "wouter";
import { BookOpen, Bookmark, Search, ChevronRight } from "lucide-react";
import { useListLearningContent, useListBookmarks, useBookmarkContent } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getListLearningContentQueryKey, getListBookmarksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const TYPE_OPTIONS = ["all", "article", "faq", "tip"];

export default function Learning({ bookmarksOnly = false }: { bookmarksOnly?: boolean }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const params: any = {};
  if (type !== "all") params.type = type;
  if (search) params.q = search;

  const { data: content, isLoading: contentLoading } = useListLearningContent(params);
  const { data: bookmarks, isLoading: bookmarksLoading } = useListBookmarks();
  const bookmarkMutation = useBookmarkContent();

  const allContent = bookmarksOnly ? (bookmarks as any[]) || [] : (content as any[]) || [];
  const isLoading = bookmarksOnly ? bookmarksLoading : contentLoading;

  const handleBookmark = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    bookmarkMutation.mutate(
      { id: item.id, data: { bookmarked: !item.isBookmarked } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLearningContentQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListBookmarksQueryKey() });
          toast({ title: item.isBookmarked ? "Bookmark removed" : "Bookmarked" });
        },
      }
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{bookmarksOnly ? "My Bookmarks" : "Legal Learning Hub"}</h1>
          <p className="text-muted-foreground mt-1">{bookmarksOnly ? "Articles and tips you've saved" : "Understand the law through plain-language guides"}</p>
        </div>

        {!bookmarksOnly && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {TYPE_OPTIONS.map(t => (
                <Button
                  key={t}
                  variant={type === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setType(t)}
                  className="capitalize"
                >
                  {t}
                </Button>
              ))}
            </div>
          </>
        )}

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : allContent.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">{bookmarksOnly ? "No bookmarks yet" : "No content found"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allContent.map((item: any) => (
              <Link key={item.id} href={`/learning/${item.id}`}>
                <Card className="border-border cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs capitalize">{item.type}</Badge>
                        {item.tags?.slice(0, 2).map((tag: string, i: number) => (
                          <span key={i} className="text-xs text-muted-foreground">#{tag}</span>
                        ))}
                      </div>
                      <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{item.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleBookmark(e, item)}
                        className={`p-1.5 rounded hover:bg-muted transition-colors ${item.isBookmarked ? "text-primary" : "text-muted-foreground"}`}
                      >
                        <Bookmark className={`h-4 w-4 ${item.isBookmarked ? "fill-current" : ""}`} />
                      </button>
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
