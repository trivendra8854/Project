import { useEffect } from "react";
import { X, Bell, CheckCheck, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { useListNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { getListNotificationsQueryKey } from "@workspace/api-client-react";

const TYPE_ICONS: Record<string, any> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  alert: Bell,
};

const TYPE_COLORS: Record<string, string> = {
  info: "text-blue-500",
  warning: "text-amber-500",
  success: "text-emerald-500",
  alert: "text-primary",
};

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useListNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();
  const list = (notifications as any[]) || [];
  const unreadCount = list.filter((n: any) => !n.isRead).length;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleMarkRead = (id: number) => {
    markReadMutation.mutate({ id, data: { isRead: true } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    });
  };

  const handleMarkAll = () => {
    markAllMutation.mutate(undefined, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    });
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Notifications</h2>
            {unreadCount > 0 && <Badge className="text-xs h-5 px-1.5">{unreadCount}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAll} className="text-xs h-7">
                <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
              </Button>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
              <Bell className="h-10 w-10 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {list.map((notif: any) => {
                const Icon = TYPE_ICONS[notif.type] || Bell;
                const colorClass = TYPE_COLORS[notif.type] || "text-primary";
                return (
                  <div
                    key={notif.id}
                    className={`px-5 py-4 flex items-start gap-3 cursor-pointer hover:bg-muted/30 transition-colors ${!notif.isRead ? "bg-primary/3" : ""}`}
                    onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                  >
                    <div className={`mt-0.5 shrink-0 ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${!notif.isRead ? "text-foreground" : "text-muted-foreground"}`}>{notif.title}</p>
                        {!notif.isRead && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{new Date(notif.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
