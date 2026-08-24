import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { ThumbsUp, ThumbsDown, Minus, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function getSessionId() {
  if (typeof window === "undefined") return "ssr-placeholder";
  let id = sessionStorage.getItem("tg-session-id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("tg-session-id", id);
  }
  return id;
}

type Reaction = "up" | "down" | "neutral";

interface PostReactionsProps {
  postSlug: string;
  compact?: boolean;
}

export default function PostReactions({ postSlug, compact = false }: PostReactionsProps) {
  const [sessionId] = useState(getSessionId);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [justReacted, setJustReacted] = useState(false);

  const stats = trpc.reactions.getStats.useQuery({ postSlug });
  const sessionCheck = trpc.reactions.checkSession.useQuery({ postSlug, sessionId });
  const reactMutation = trpc.reactions.react.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setJustReacted(true);
        stats.refetch();
        sessionCheck.refetch();
      }
    },
  });

  useEffect(() => {
    if (sessionCheck.data?.reacted) {
      setSelectedReaction(sessionCheck.data.reaction as Reaction);
    }
  }, [sessionCheck.data]);

  const handleReaction = useCallback(
    (reaction: Reaction) => {
      if (sessionCheck.data?.reacted || justReacted) return;
      setSelectedReaction(reaction);
      setShowComment(true);
    },
    [sessionCheck.data, justReacted]
  );

  const submitReaction = useCallback(() => {
    if (!selectedReaction) return;
    reactMutation.mutate({
      postSlug,
      reaction: selectedReaction,
      sessionId,
      comment: comment.trim() || undefined,
    });
    setShowComment(false);
    setComment("");
  }, [selectedReaction, postSlug, sessionId, comment, reactMutation]);

  const skipComment = useCallback(() => {
    if (!selectedReaction) return;
    reactMutation.mutate({
      postSlug,
      reaction: selectedReaction,
      sessionId,
    });
    setShowComment(false);
    setComment("");
  }, [selectedReaction, postSlug, sessionId, reactMutation]);

  const hasReacted = sessionCheck.data?.reacted || justReacted;
  const up = stats.data?.up ?? 0;
  const down = stats.data?.down ?? 0;
  const neutral = stats.data?.neutral ?? 0;
  const total = up + down + neutral;
  const comments = stats.data?.comments ?? [];

  const reactionButtons: { key: Reaction; icon: typeof ThumbsUp; label: string; count: number; activeColor: string }[] = [
    { key: "up", icon: ThumbsUp, label: "This hit", count: up, activeColor: "text-emerald-600" },
    { key: "neutral", icon: Minus, label: "Meh", count: neutral, activeColor: "text-amber-500" },
    { key: "down", icon: ThumbsDown, label: "Nah", count: down, activeColor: "text-red-500" },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {reactionButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleReaction(btn.key)}
            disabled={hasReacted}
            className={`flex items-center gap-1 text-sm transition-all ${
              selectedReaction === btn.key
                ? btn.activeColor
                : hasReacted
                ? "text-stone-400 cursor-default"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <btn.icon className="w-4 h-4" />
            {btn.count > 0 && <span className="font-mono text-xs">{btn.count}</span>}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="border-t border-stone-200 pt-8 mt-12">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="font-['Playfair_Display'] text-xl text-stone-800 mb-1">
          {hasReacted ? "You've weighed in." : "What's the verdict?"}
        </p>
        <p className="text-sm text-stone-500 font-['DM_Mono']">
          {total > 0 ? `${total} reader${total !== 1 ? "s" : ""} reacted` : "Be the first to react"}
        </p>
      </div>

      {/* Reaction Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {reactionButtons.map((btn) => {
          const isSelected = selectedReaction === btn.key;
          return (
            <button
              key={btn.key}
              onClick={() => handleReaction(btn.key)}
              disabled={hasReacted}
              className={`group flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? `${btn.activeColor} border-current bg-current/5 scale-105`
                  : hasReacted
                  ? "border-stone-200 text-stone-300 cursor-default"
                  : "border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700 hover:scale-105 cursor-pointer"
              }`}
            >
              <btn.icon className={`w-6 h-6 transition-transform ${isSelected ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="text-xs font-['DM_Mono'] uppercase tracking-wider">{btn.label}</span>
              {btn.count > 0 && (
                <span className="text-xs font-mono opacity-60">{btn.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Comment Input (slides in after selecting reaction) */}
      {showComment && !hasReacted && (
        <div className="max-w-md mx-auto animate-in slide-in-from-top-2 duration-300">
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-stone-400 mt-2.5 shrink-0" />
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  placeholder="Drop a quick thought... (optional)"
                  className="w-full bg-transparent border-none outline-none resize-none text-sm text-stone-700 placeholder:text-stone-400 font-['Source_Sans_3']"
                  rows={2}
                  autoFocus
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-stone-400 font-mono">{comment.length}/500</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipComment}
                      className="text-xs text-stone-500"
                    >
                      Skip
                    </Button>
                    <Button
                      size="sm"
                      onClick={submitReaction}
                      className="text-xs bg-stone-800 hover:bg-stone-700 text-white"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thank you message */}
      {hasReacted && justReacted && (
        <p className="text-center text-sm text-stone-500 font-['DM_Mono'] animate-in fade-in duration-500">
          Noted. Your take matters.
        </p>
      )}

      {/* Reaction Bar Visualization */}
      {total > 0 && (
        <div className="max-w-sm mx-auto mt-6">
          <div className="flex h-2 rounded-full overflow-hidden bg-stone-100">
            {up > 0 && (
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${(up / total) * 100}%` }}
              />
            )}
            {neutral > 0 && (
              <div
                className="bg-amber-400 transition-all duration-500"
                style={{ width: `${(neutral / total) * 100}%` }}
              />
            )}
            {down > 0 && (
              <div
                className="bg-red-400 transition-all duration-500"
                style={{ width: `${(down / total) * 100}%` }}
              />
            )}
          </div>
        </div>
      )}

      {/* Recent Comments */}
      {comments.length > 0 && (
        <div className="max-w-md mx-auto mt-8">
          <p className="text-xs font-['DM_Mono'] text-stone-400 uppercase tracking-wider mb-3">
            Reader takes
          </p>
          <div className="space-y-3">
            {comments.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 mt-0.5">
                  {c.reaction === "up" ? "👍" : c.reaction === "down" ? "👎" : "😐"}
                </span>
                <p className="text-stone-600 font-['Source_Sans_3'] leading-relaxed">
                  {c.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
