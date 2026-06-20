import { Link } from "wouter";
import { Map, ArrowRight, Clock } from "lucide-react";
import { useListJourneys } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Journeys() {
  const { data: journeys, isLoading } = useListJourneys();
  const list = (journeys as any[]) || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Guided Legal Journeys</h1>
          <p className="text-muted-foreground mt-1">Step-by-step guidance through complex legal situations</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16">
            <Map className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No journeys available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((journey: any) => (
              <Link key={journey.id} href={`/journeys/${journey.id}`}>
                <Card className="border-border cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all h-full">
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="capitalize text-xs mb-3">{journey.category?.replace(/-/g, " ")}</Badge>
                    <h3 className="font-semibold text-foreground mb-2">{journey.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{journey.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>~{journey.estimatedDays} days</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-medium">
                        Start journey <ArrowRight className="h-3 w-3" />
                      </div>
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
