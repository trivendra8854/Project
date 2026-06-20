import { useState, useRef, useEffect } from "react";
import { Plus, Send, MessageSquare } from "lucide-react";
import {
  useListChatSessions,
  useGetChatMessages,
  useCreateChatSession,
  useSendChatMessage,
  getGetChatMessagesQueryKey,
  getListChatSessionsQueryKey,
} from "@workspace/api-client-react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function Chat() {
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: sessions, isLoading: sessionsLoading } = useListChatSessions();
  const { data: messages, isLoading: msgsLoading } = useGetChatMessages(
    activeSession!,
    { query: { enabled: !!activeSession } }
  );
  const createMutation = useCreateChatSession();
  const sendMutation = useSendChatMessage();

  const sessionList = (sessions as any[]) || [];
  const messageList = (messages as any[]) || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList.length]);

  const handleNewSession = () => {
    createMutation.mutate(
      { data: { title: "New Conversation" } },
      {
        onSuccess: (data: any) => {
          setActiveSession(data.id);
          queryClient.invalidateQueries({ queryKey: getListChatSessionsQueryKey() });
        },
      }
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeSession) return;
    const msg = message;
    setMessage("");
    sendMutation.mutate(
      { id: activeSession, data: { message: msg } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey(activeSession) });
        },
      }
    );
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-8rem)] flex border border-border rounded-lg overflow-hidden">
        <div className="w-64 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <Button onClick={handleNewSession} className="w-full" size="sm" disabled={createMutation.isPending}>
              <Plus className="mr-2 h-4 w-4" /> New Conversation
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessionsLoading ? (
              <div className="space-y-2 p-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : sessionList.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No conversations yet</div>
            ) : (
              sessionList.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSession(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeSession === s.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <p className="line-clamp-1">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.messageCount} messages</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {!activeSession ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">AI Legal Assistant</p>
                <p className="text-sm mt-1">Start a new conversation to ask any legal question</p>
                <Button className="mt-4" onClick={handleNewSession}>Start Conversation</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-border px-4 py-3">
                <p className="font-medium text-foreground text-sm">AI Legal Assistant</p>
                <p className="text-xs text-muted-foreground">Ask any question about Indian law and your legal rights</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {msgsLoading ? (
                  <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
                ) : messageList.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Send a message to get started. You can ask about your rights, how to file complaints, or any legal question.
                  </div>
                ) : (
                  messageList.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-lg px-4 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {sendMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSend} className="border-t border-border p-4 flex gap-3">
                <Input
                  placeholder="Ask a legal question..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!message.trim() || sendMutation.isPending} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
