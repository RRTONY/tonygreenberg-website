/**
 * NotificationBell — In-app notification bell with dropdown panel.
 * Shows unread count badge; click to see recent notifications.
 * Logged-in users see broadcasts + personal notifications.
 * Unauthenticated users see nothing (bell hidden).
 */
import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, ExternalLink, Megaphone, AlertTriangle, UserPlus, ClipboardCheck, Settings } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_ICONS: Record<string, typeof Bell> = {
  announcement: Megaphone,
  "fraud-story": AlertTriangle,
  signup: UserPlus,
  assessment: ClipboardCheck,
  system: Settings,
};

const CATEGORY_COLORS: Record<string, string> = {
  announcement: "#D4B96A",
  "fraud-story": "#DC2626",
  signup: "#22C55E",
  assessment: "#8B5CF6",
  system: "#6B7280",
};

function timeAgo(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export function NotificationBell({ isDark }: { isDark: boolean }) {
  const { isAuthenticated, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Only fetch if authenticated
  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery(
    undefined,
    { enabled: isAuthenticated, refetchInterval: 30000 }
  );

  const { data: notifications = [], refetch: refetchList } = trpc.notifications.list.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated && open }
  );

  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      refetchList();
      trpc.useUtils().notifications.unreadCount.invalidate();
    },
  });

  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => {
      refetchList();
      trpc.useUtils().notifications.unreadCount.invalidate();
    },
  });

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Don't render for unauthenticated users
  if (loading || !isAuthenticated) return null;

  const gold = "#D4B96A";
  const darkGold = "#8B6914";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        className="relative transition-all duration-200"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: isDark ? (unreadCount > 0 ? gold : "#aaa") : (unreadCount > 0 ? darkGold : "#999"),
          padding: "4px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = gold)}
        onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? (unreadCount > 0 ? gold : "#aaa") : (unreadCount > 0 ? darkGold : "#999"))}
      >
        <Bell size={14} />
        {unreadCount > 0 && (
          <span
            className="absolute flex items-center justify-center"
            style={{
              top: -2,
              right: -4,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: "#DC2626",
              color: "#fff",
              fontSize: "0.6rem",
              fontFamily: "'DM Mono', monospace",
              fontWeight: 700,
              padding: "0 4px",
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 z-[200]"
            style={{
              top: "calc(100% + 8px)",
              width: 360,
              maxHeight: 480,
              borderRadius: 12,
              border: `1px solid ${isDark ? "rgba(212, 185, 106,0.2)" : "rgba(139, 105, 20,0.12)"}`,
              background: isDark ? "#111118" : "#FAFAF7",
              boxShadow: isDark
                ? "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212, 185, 106,0.08)"
                : "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(139, 105, 20,0.06)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom: `1px solid ${isDark ? "rgba(212, 185, 106,0.12)" : "rgba(139, 105, 20,0.08)"}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isDark ? "#D4B96A" : "#8B6914",
                }}
              >
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending}
                  className="flex items-center gap-1 transition-colors duration-200"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.04em",
                    color: isDark ? "#888" : "#999",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? "#888" : "#999")}
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="overflow-y-auto flex-1" style={{ maxHeight: 400 }}>
              {notifications.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 px-4"
                  style={{ color: isDark ? "#555" : "#aaa" }}
                >
                  <Bell size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                  <span
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.85rem",
                    }}
                  >
                    No notifications yet
                  </span>
                  <span
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.75rem",
                      marginTop: 4,
                      opacity: 0.6,
                    }}
                  >
                    You'll see updates here when they arrive
                  </span>
                </div>
              ) : (
                notifications.map((n) => {
                  const CategoryIcon = CATEGORY_ICONS[n.category] || Bell;
                  const catColor = CATEGORY_COLORS[n.category] || gold;
                  const isUnread = !n.read;

                  return (
                    <div
                      key={n.id}
                      className="relative transition-colors duration-150"
                      style={{
                        padding: "12px 16px",
                        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                        background: isUnread
                          ? (isDark ? "rgba(212, 185, 106,0.04)" : "rgba(139, 105, 20,0.02)")
                          : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (isUnread) markRead.mutate({ notificationId: n.id });
                        if (n.link) window.location.href = n.link;
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark
                          ? "rgba(212, 185, 106,0.08)"
                          : "rgba(139, 105, 20,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isUnread
                          ? (isDark ? "rgba(212, 185, 106,0.04)" : "rgba(139, 105, 20,0.02)")
                          : "transparent";
                      }}
                    >
                      {/* Unread indicator */}
                      {isUnread && (
                        <span
                          className="absolute"
                          style={{
                            left: 6,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: catColor,
                          }}
                        />
                      )}

                      <div className="flex items-start gap-3">
                        <div
                          className="flex items-center justify-center flex-shrink-0"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: `${catColor}15`,
                            color: catColor,
                            marginTop: 1,
                          }}
                        >
                          <CategoryIcon size={14} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div
                            className="flex items-center gap-2"
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              fontWeight: isUnread ? 700 : 500,
                              color: isDark ? "#F5F0E0" : "#222",
                              lineHeight: 1.3,
                            }}
                          >
                            <span className="truncate">{n.title}</span>
                            {n.link && (
                              <ExternalLink
                                size={10}
                                style={{ flexShrink: 0, opacity: 0.4 }}
                              />
                            )}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.75rem",
                              color: isDark ? "#888" : "#777",
                              lineHeight: 1.4,
                              marginTop: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {n.message}
                          </div>
                          <div
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.6rem",
                              color: isDark ? "#555" : "#bbb",
                              marginTop: 4,
                            }}
                          >
                            {timeAgo(n.createdAt)}
                          </div>
                        </div>

                        {isUnread && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markRead.mutate({ notificationId: n.id });
                            }}
                            className="flex-shrink-0 transition-colors duration-150"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: isDark ? "#555" : "#ccc",
                              padding: 4,
                              borderRadius: 4,
                              marginTop: 2,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = gold)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? "#555" : "#ccc")}
                            aria-label="Mark as read"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
