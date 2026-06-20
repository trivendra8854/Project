import { Link } from "wouter";
import { ArrowLeft, ExternalLink, CheckSquare } from "lucide-react";
import { useGetScheme } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SchemeDetail({ id }: { id: number }) {
  const { data: scheme, isLoading } = useGetScheme(id);
  const s = scheme as any;

  if (isLoading) return <AppLayout><Skeleton className="h-64" /></AppLayout>;
  if (!s) return <AppLayout><div className="text-center py-16 text-muted-foreground">Scheme not found</div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/schemes">
          <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schemes
          </Button>
        </Link>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="capitalize">{s.category}</Badge>
            <span className="text-sm text-muted-foreground">{s.ministry}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{s.title}</h1>
          <p className="text-muted-foreground mt-2">{s.description}</p>
          {s.officialLink && (
            <a href={s.officialLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-primary text-sm hover:underline">
              Official Website <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Eligibility</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{s.eligibility}</p></CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Benefits</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{s.benefits}</p></CardContent>
          </Card>
        </div>

        {s.requiredDocuments?.length > 0 && (
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckSquare className="h-4 w-4 text-primary" /> Required Documents</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {s.requiredDocuments.map((doc: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{doc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">How to Apply</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{s.applicationProcess}</p></CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
