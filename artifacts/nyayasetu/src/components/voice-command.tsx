import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { useLocation } from "wouter";

const COMMANDS: { patterns: string[]; action: string; path?: string; description: string }[] = [
  { patterns: ["dashboard", "home", "main"], action: "navigate", path: "/dashboard", description: "Go to Dashboard" },
  { patterns: ["rights", "my rights", "legal rights"], action: "navigate", path: "/rights", description: "Open Rights Explorer" },
  { patterns: ["complaint", "file complaint", "new complaint"], action: "navigate", path: "/complaints/new", description: "File a Complaint" },
  { patterns: ["documents", "document vault", "my documents"], action: "navigate", path: "/documents", description: "Open Document Vault" },
  { patterns: ["journey", "journeys", "legal journey"], action: "navigate", path: "/journeys", description: "View Legal Journeys" },
  { patterns: ["scheme", "schemes", "government scheme"], action: "navigate", path: "/schemes", description: "Find Government Schemes" },
  { patterns: ["learn", "learning", "education", "learning hub"], action: "navigate", path: "/learning", description: "Open Learning Hub" },
  { patterns: ["legal aid", "lawyer", "find lawyer", "find help"], action: "navigate", path: "/legalaid", description: "Find Legal Aid" },
  { patterns: ["chat", "assistant", "ai", "ask"], action: "navigate", path: "/chat", description: "Open AI Assistant" },
  { patterns: ["profile", "settings", "account"], action: "navigate", path: "/profile", description: "Open Profile" },
];

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceCommand() {
  const [, setLocation] = useLocation();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [show, setShow] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  const processCommand = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();
    for (const cmd of COMMANDS) {
      if (cmd.patterns.some(p => lower.includes(p))) {
        setFeedback(`✓ ${cmd.description}`);
        setTimeout(() => {
          if (cmd.path) setLocation(cmd.path);
          setShow(false);
          setFeedback("");
          setTranscript("");
        }, 800);
        return;
      }
    }
    setFeedback("Command not recognized. Try: 'go to dashboard', 'file complaint', 'find schemes'...");
  }, [setLocation]);

  const startListening = useCallback(() => {
    if (!supported) return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = localStorage.getItem("nyaya_lang") || "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        processCommand(t);
        setListening(false);
      }
    };
    recognition.onerror = () => { setListening(false); setFeedback("Could not understand. Please try again."); };
    recognition.onend = () => setListening(false);
    recognition.start();
  }, [supported, processCommand]);

  if (!supported) return null;

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        title="Voice Command"
      >
        <Mic className="h-5 w-5" />
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Voice Commands</h3>
              <button onClick={() => { setShow(false); setTranscript(""); setFeedback(""); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 py-4">
              <button
                onClick={startListening}
                disabled={listening}
                className={`h-20 w-20 rounded-full flex items-center justify-center shadow-md transition-all ${listening ? "bg-red-500 text-white scale-110 animate-pulse" : "bg-primary text-primary-foreground hover:scale-105"}`}
              >
                {listening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </button>
              <p className="text-sm text-muted-foreground font-medium">
                {listening ? "Listening..." : "Tap to speak a command"}
              </p>
              {transcript && (
                <div className="w-full bg-muted/50 rounded-lg p-3 text-sm text-foreground text-center italic">
                  "{transcript}"
                </div>
              )}
              {feedback && (
                <div className={`w-full rounded-lg p-3 text-sm text-center font-medium ${feedback.startsWith("✓") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                  {feedback}
                </div>
              )}
            </div>

            <div className="mt-2 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Try saying:</p>
              <div className="grid grid-cols-2 gap-1">
                {["Go to dashboard", "File a complaint", "Find schemes", "Open learning hub", "Find legal aid", "Open AI assistant"].map(ex => (
                  <span key={ex} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">"{ex}"</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
