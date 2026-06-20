import { useState } from "react";
import { Link } from "wouter";
import { Search, Scale, ShoppingCart, Home, Briefcase, Monitor, Heart, User, FileText, Book, ChevronRight } from "lucide-react";
import { useListRights, useGetRightsCategories } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_ICONS: Record<string, any> = {
  "womens-rights": Scale,
  "consumer-rights": ShoppingCart,
  "property-rights": Home,
  "labour-rights": Briefcase,
  "cyber-crime": Monitor,
  "senior-citizen-rights": Heart,
  "child-protection": User,
  "rti": FileText,
  "constitutional-rights": Book,
};

export default function RightsExplorer() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const params: any = { page: String(page), limit: "12" };
  if (search) params.q = search;
  if (selectedCategory) params.category = selectedCategory;

  const { data: rightsData, isLoading } = useListRights(params);
  const { data: categories, isLoading: catsLoading } = useGetRightsCategories();

  const articles = (rightsData as any)?.articles || [];
  const totalPages = (rightsData as any)?.totalPages || 1;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rights Explorer</h1>
          <p className="text-muted-foreground mt-1">Know your legal rights as an Indian citizen</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rights and laws..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Browse by Category</h2>
          {catsLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {(categories as any[])?.map((cat: any) => {
                const Icon = CATEGORY_ICONS[cat.id] || Scale;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(isActive ? null : cat.id); setPage(1); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-all ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/30 text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium leading-tight">{cat.name}</span>
                    {cat.count > 0 && <span className="text-xs text-muted-foreground">({cat.count})</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40" />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Scale className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No articles found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article: any) => (
                <Link key={article.id} href={`/rights/${article.id}`}>
                  <Card className="border-border cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all h-full">
                    <CardContent className="p-5">
                      <Badge variant="secondary" className="text-xs mb-3 capitalize">{article.category.replace(/-/g, " ")}</Badge>
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
                      <div className="flex items-center gap-1 mt-3 text-primary text-xs font-medium">
                        Read more <ChevronRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="flex items-center text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
