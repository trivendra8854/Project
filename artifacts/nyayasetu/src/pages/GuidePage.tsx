import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Bot, User, Sparkles, ChevronRight } from "lucide-react";

interface Message { role: "user" | "bot"; text: string; }

const suggestions = [
  "What are my rights as a tenant?",
  "How do I file a consumer complaint?",
  "What is the process for a divorce in India?",
  "My employer hasn't paid my salary. What can I do?",
  "How to register an FIR?",
  "What is the time limit to file a case in consumer court?",
];

const faqs: Record<string, string> = {
  "what are my rights as a tenant": "As a tenant in India, you have the right to:\n• Written rental agreement\n• Safe and habitable property\n• Adequate notice before eviction (usually 15-30 days)\n• Return of security deposit within 30 days of vacating\n• Approach Rent Control Court for disputes\n\nThe Rental Housing Authority Act governs tenant rights in many states.",
  "how do i file a consumer complaint": "To file a consumer complaint in India:\n1. First, send a written complaint to the seller/company\n2. If unresolved, file at Consumer Disputes Redressal Commission\n   • District Forum: Disputes up to ₹1 crore\n   • State Commission: ₹1–10 crore\n   • National Commission: Above ₹10 crore\n3. File within 2 years of the issue\n4. No court fees for claims under ₹5 lakh\n\nYou can also file online at edaakhil.nic.in",
  "what is the process for a divorce in india": "Divorce in India can be obtained by:\n\nMutual Consent Divorce:\n• File joint petition in Family Court\n• 6-month waiting period (can be waived)\n• Second motion hearing → Decree of divorce granted\n\nContested Divorce:\n• File petition citing grounds (cruelty, desertion, adultery)\n• Service of summons to spouse\n• Evidence and hearing → Court decree\n\nAveraged 1-3 years. Consult a family lawyer.",
  "my employer hasn't paid my salary": "If your employer hasn't paid salary:\n1. Send a formal written notice to HR/employer\n2. File complaint with the Labour Commissioner in your district\n3. Approach the Payment of Wages Authority\n4. File complaint under Payment of Wages Act, 1936\n5. If amount >₹1 lakh, approach the Labour Court\n\nYou're entitled to salary + compensation for delayed payment.",
  "how to register an fir": "To register an FIR:\n1. Visit the nearest Police Station\n2. Narrate the incident to the officer-in-charge\n3. Request them to write down your complaint\n4. Read, sign, and get a free copy of the FIR\n\nIf police refuses:\n• Approach the Superintendent of Police\n• File complaint with Judicial Magistrate under Sec 156(3) CrPC\n• File online on state police websites",
  "what is the time limit to file a case in consumer court": "Limitation period for consumer complaints:\n• General rule: 2 years from the date of cause of action\n• Extension: Court can condone delay if sufficient cause is shown\n• The clock starts from when you first experienced the deficiency\n\nFile as soon as possible with all supporting documents.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const key of Object.keys(faqs)) {
    if (lower.includes(key.split(" ").slice(0, 4).join(" "))) return faqs[key];
  }
  return `Thank you for your question about "${input}".\n\nHere's what I suggest:\n\n1. Document everything — Keep records of all relevant documents, communications, and dates.\n2. Know your rights — Most civil disputes are governed by the Civil Procedure Code. Criminal matters fall under the Indian Penal Code.\n3. Seek free legal aid — Contact your District Legal Services Authority (DLSA) for free help.\n4. Approach a lawyer — Use our "Find Legal Aid" feature to connect with a qualified lawyer.\n\nWould you like to know more about any specific aspect?`;
}

export default function GuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! I'm your AI Legal Guide. I can help you understand your rights, explain legal processes, and guide you through common legal issues in India.\n\nWhat legal question can I help you with today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(m => [...m, { role: "bot", text: getBotResponse(text) }]);
    }, 1200 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div className="p-6 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--app-separator)" }}>
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold" style={{ color: "var(--app-text-primary)" }}>AI Legal Guide</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: "0 0 5px #22c55e" }} />
              <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>Online · Free legal guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <p className="text-xs font-medium mb-3" style={{ color: "var(--app-text-muted)" }}>Common Questions</p>
            <div className="flex flex-col gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => send(s)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all card" style={{ fontSize: "13px", color: "var(--app-text-secondary)", background: "var(--app-card-bg)" }}>
                  <ChevronRight size={14} style={{ color: "#6366f1", flexShrink: 0 }} />
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                style={m.role === "bot"
                  ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }
                  : { background: "var(--app-card-bg)", border: "1px solid var(--app-card-border)" }
                }
              >
                {m.role === "bot" ? <Bot size={15} color="white" /> : <User size={15} style={{ color: "var(--app-text-secondary)" }} />}
              </div>
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={m.role === "bot"
                  ? { background: "var(--app-card-bg)", border: "1px solid var(--app-card-border)", color: "var(--app-text-secondary)", whiteSpace: "pre-line", borderRadius: "4px 16px 16px 16px" }
                  : { background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white", borderRadius: "16px 4px 16px 16px" }
                }
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Bot size={15} color="white" />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: "var(--app-card-bg)", border: "1px solid var(--app-card-border)", borderRadius: "4px 16px 16px 16px" }}>
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: "#6366f1" }} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 md:p-6" style={{ borderTop: "1px solid var(--app-separator)" }}>
        <div className="flex gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <input
              className="input-field"
              style={{ paddingRight: "3rem" }}
              placeholder="Ask a legal question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--app-text-muted)" }}>
              <Mic size={16} />
            </button>
          </div>
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() && !isTyping ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
              color: input.trim() && !isTyping ? "white" : "var(--app-text-muted)",
              cursor: input.trim() && !isTyping ? "pointer" : "default",
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
