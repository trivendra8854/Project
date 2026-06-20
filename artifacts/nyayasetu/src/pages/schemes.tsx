import { useState } from "react";
import { Link } from "wouter";
import { Search, Building, ChevronRight } from "lucide-react";
import { useListSchemes } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Schemes() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const params: any = { page: String(page) };
  if (search) params.q = search;

  const { data: schemesData, isLoading } = useListSchemes(params);
  const schemes = (schemesData as any)?.schemes || [];
  const totalPages = (schemesData as any)?.totalPages || 1;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Government Schemes</h1>
          <p className="text-muted-foreground mt-1">Discover schemes and benefits you're eligible for</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schemes..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-16">
            <Building className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No schemes found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {schemes.map((scheme: any) => (
                <Link key={scheme.id} href={`/schemes/${scheme.id}`}>
                  <Card className="border-border cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <Badge variant="secondary" className="text-xs capitalize">{scheme.category}</Badge>
                        <span className="text-xs text-muted-foreground shrink-0">{scheme.ministry}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{scheme.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{scheme.description}</p>
                      <div className="border-t border-border pt-3">
                        <p className="text-xs font-medium text-foreground mb-1">Eligibility</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{scheme.eligibility}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-primary text-xs font-medium">
                        View details <ChevronRight className="h-3 w-3" />
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
