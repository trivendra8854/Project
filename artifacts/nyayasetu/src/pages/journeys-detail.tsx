import { Link } from "wouter";
import { ArrowLeft, CheckCircle, Circle, Clock } from "lucide-react";
import { useGetJourney, useGetJourneyProgress, useUpdateJourneyProgress } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function JourneyDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const { data: journey, isLoading: journeyLoading } = useGetJourney(id);
  const { data: progress, isLoading: progressLoading, refetch } = useGetJourneyProgress(id);
  const updateMutation = useUpdateJourneyProgress();

  const j = journey as any;
  const p = progress as any;
  const steps: any[] = j?.steps || [];
  const completedSteps: number[] = p?.completedSteps || [];

  const toggleStep = (stepNumber: number) => {
    const newCompleted = completedSteps.includes(stepNumber)
      ? completedSteps.filter(s => s !== stepNumber)
      : [...completedSteps, stepNumber];
    const newCurrent = Math.max(...newCompleted.concat([0])) + 1;

    updateMutation.mutate(
      { id, data: { currentStep: newCurrent, completedSteps: newCompleted } },
      {
        onSuccess: () => { refetch(); toast({ title: "Progress updated" }); },
      }
    );
  };

  if (journeyLoading || progressLoading) {
    return <AppLayout><div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-96" /></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/journeys">
          <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journeys
          </Button>
        </Link>

        <div>
          <Badge variant="secondary" className="capitalize mb-3">{j?.category?.replace(/-/g, " ")}</Badge>
          <h1 className="text-2xl font-bold text-foreground">{j?.title}</h1>
          <p className="text-muted-foreground mt-2">{j?.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> ~{j?.estimatedDays} days
            </div>
          </div>
        </div>

        {p && (
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Your Progress</span>
                <span className="text-sm font-bold text-primary">{p.completionPercent}%</span>
              </div>
              <Progress value={p.completionPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{completedSteps.length} of {steps.length} steps completed</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-semibold text-foreground">Steps to Follow</h2>
            {steps.map((step: any) => {
              const isCompleted = completedSteps.includes(step.stepNumber);
              return (
                <Card key={step.stepNumber} className={`border-border transition-all ${isCompleted ? "bg-emerald-50 border-emerald-200" : ""}`}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <button onClick={() => toggleStep(step.stepNumber)} className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-medium">Step {step.stepNumber}</span>
                        {isCompleted && <Badge className="text-xs bg-emerald-100 text-emerald-700 border-0">Completed</Badge>}
                      </div>
                      <p className={`font-medium ${isCompleted ? "text-emerald-700 line-through" : "text-foreground"}`}>{step.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      {step.tips && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-700">
                          Tip: {step.tips}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            {j?.eligibility && (
              <Card className="border-border">
                <CardHeader><CardTitle className="text-sm">Eligibility</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">{j.eligibility}</CardContent>
              </Card>
            )}
            {j?.requiredDocuments?.length > 0 && (
              <Card className="border-border">
                <CardHeader><CardTitle className="text-sm">Required Documents</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {j.requiredDocuments.map((doc: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {j?.applicableLaws?.length > 0 && (
              <Card className="border-border">
                <CardHeader><CardTitle className="text-sm">Applicable Laws</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {j.applicableLaws.map((law: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        {law}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
