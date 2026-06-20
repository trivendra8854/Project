import { Link } from "wouter";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";
import { useGetRightsArticle } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function RightsArticle({ id }: { id: number }) {
  const { data: article, isLoading } = useGetRightsArticle(id);

  if (isLoading) {
    return <AppLayout><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div></AppLayout>;
  }

  if (!article) {
    return <AppLayout><div className="text-center py-16 text-muted-foreground">Article not found</div></AppLayout>;
  }

  const a = article as any;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/rights">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Rights Explorer
          </Button>
        </Link>

        <div>
          <Badge variant="secondary" className="capitalize mb-3">{a.category?.replace(/-/g, " ")}</Badge>
          <h1 className="text-2xl font-bold text-foreground">{a.title}</h1>
          <p className="text-muted-foreground mt-2">{a.summary}</p>
        </div>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">{a.content}</p>
            </div>
          </CardContent>
        </Card>

        {a.relevantLaws?.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Relevant Laws
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {a.relevantLaws.map((law: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-foreground">{law}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {a.legalProvisions?.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Legal Provisions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {a.legalProvisions.map((p: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span className="text-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {a.governmentResources?.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-primary" /> Government Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {a.governmentResources.map((r: string, i: number) => (
                  <li key={i} className="text-sm text-foreground">{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
