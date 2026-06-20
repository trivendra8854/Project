import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useListComplaintTemplates, useCreateComplaint } from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

function generateComplaint(type: string, title: string, answers: Record<string, string>): string {
  const date = new Date().toLocaleDateString("en-IN");
  const to = {
    police_complaint: "The Station House Officer",
    consumer_court: "The District Consumer Forum",
    labour_office: "The Labour Commissioner",
    women_commission: "The Chairperson, National Commission for Women",
    cyber_cell: "The In-Charge, Cyber Crime Cell",
    municipality: "The Municipal Commissioner",
    revenue_department: "The Collector/District Magistrate",
  }[type] || "The Concerned Authority";

  const body = Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join("\n");
  return `Date: ${date}\n\nTo,\n${to}\n\nSubject: ${title}\n\nRespected Sir/Madam,\n\nI, ${answers["Your Full Name"] || "[Your Name]"}, am writing to bring to your attention the following matter:\n\n${body}\n\nI request you to kindly look into this matter and take appropriate action at the earliest.\n\nI shall be grateful for your help.\n\nThank you,\n${answers["Your Full Name"] || "[Your Name]"}\n${answers["Contact Number"] || ""}\n${date}`;
}

export default function NewComplaint() {
  const [step, setStep] = useState<"type" | "form" | "preview">("type");
  const [selectedType, setSelectedType] = useState("");
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: templates, isLoading } = useListComplaintTemplates();
  const createMutation = useCreateComplaint();

  const templateList = (templates as any[]) || [];
  const selectedTemplate = templateList.find((t: any) => t.type === selectedType);
  const questions = selectedTemplate?.questions || [];
  const generatedContent = step === "preview" ? generateComplaint(selectedType, title, answers) : "";

  const handleSubmit = () => {
    createMutation.mutate(
      { data: { type: selectedType, title, content: generatedContent, answers: JSON.stringify(answers) } },
      {
        onSuccess: (data: any) => {
          toast({ title: "Complaint saved", description: "Your complaint has been drafted successfully." });
          setLocation(`/complaints/${data.id}`);
        },
        onError: () => {
          toast({ title: "Error", description: "Could not save complaint", variant: "destructive" });
        },
      }
    );
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/complaints">
          <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Complaints
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Complaint</h1>
          <div className="flex items-center gap-2 mt-3">
            {["type", "form", "preview"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s || (i < ["type","form","preview"].indexOf(step)) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <span className="text-xs text-muted-foreground capitalize">{s === "type" ? "Choose Type" : s === "form" ? "Fill Details" : "Preview"}</span>
                {i < 2 && <div className="h-px w-6 bg-border" />}
              </div>
            ))}
          </div>
        </div>

        {step === "type" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select the type of complaint you want to file:</p>
            {isLoading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
            ) : (
              <div className="space-y-2">
                {templateList.map((t: any) => (
                  <button
                    key={t.type}
                    onClick={() => { setSelectedType(t.type); setTitle(t.title); }}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${selectedType === t.type ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-card"}`}
                  >
                    <p className="font-medium text-foreground">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                  </button>
                ))}
              </div>
            )}
            <Button className="w-full" disabled={!selectedType} onClick={() => setStep("form")}>
              Continue
            </Button>
          </div>
        )}

        {step === "form" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Complaint Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief title for your complaint" />
            </div>
            {questions.map((q: any) => (
              <div key={q.id || q.label} className="space-y-2">
                <Label>{q.label}{q.required && <span className="text-destructive ml-1">*</span>}</Label>
                {q.type === "textarea" ? (
                  <Textarea
                    placeholder={q.placeholder || ""}
                    value={answers[q.label] || ""}
                    onChange={e => setAnswers({ ...answers, [q.label]: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <Input
                    placeholder={q.placeholder || ""}
                    value={answers[q.label] || ""}
                    onChange={e => setAnswers({ ...answers, [q.label]: e.target.value })}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("type")}>Back</Button>
              <Button className="flex-1" onClick={() => setStep("preview")}>Preview Complaint</Button>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Preview</CardTitle>
                <CardDescription>Your generated complaint letter</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans bg-muted/30 rounded-md p-4">{generatedContent}</pre>
              </CardContent>
            </Card>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("form")}>Edit</Button>
              <Button className="flex-1" disabled={createMutation.isPending} onClick={handleSubmit}>
                {createMutation.isPending ? "Saving..." : "Save Complaint"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
