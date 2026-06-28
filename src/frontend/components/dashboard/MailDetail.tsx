"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  RefreshCw,
  Send,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { inboxMeta, labelColors, type Mail } from "@/frontend/components/dashboard/data";

type Props = {
  mail: Mail | null;
  onToggleStar: (id: string) => void;
  onSnooze: (id: string) => void;
  onTrash: (id: string) => void;
  onSpam: (id: string) => void;
  onReply: (mail: Mail, body: string) => Promise<void>;
};

function colorsFor(inbox: Mail["inbox"]) {
  return inboxMeta.find((i) => i.key === inbox)?.colors ?? "from-violet-400 to-cyan-300";
}

const FRAME_STYLE = `
  html, body { margin: 0; padding: 14px; background: #ffffff; color: #1f2328;
    font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; font-size: 13.5px; line-height: 1.55; }
  * { max-width: 100%; box-sizing: border-box; }
  img { height: auto; }
  table { max-width: 100% !important; }
  a { color: #7c3aed; }
  html { scrollbar-width: none; }
  ::-webkit-scrollbar { display: none; }
`;

function EmailHtmlFrame({ html }: { html: string }) {
  const srcDoc = useMemo(
    () => `<!doctype html><html><head><meta charset="utf-8"><style>${FRAME_STYLE}</style></head><body>${html}</body></html>`,
    [html]
  );

  return (
    <iframe
      title="Email content"
      srcDoc={srcDoc}
      sandbox=""
      className="h-full w-full rounded-xl border border-white/10 bg-white"
    />
  );
}

export default function MailDetail({ mail, onToggleStar, onSnooze, onTrash, onSpam, onReply }: Props) {
  if (!mail) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-violet-300">
          <Sparkles className="h-[18px] w-[18px]" />
        </span>
        <p className="text-sm font-medium text-zinc-300">
          Select an email to see your tone-matched draft
        </p>
        <p className="max-w-xs text-xs text-zinc-500">
          Mailsoul reads your Sent folder so every suggested reply already
          sounds like you.
        </p>
      </div>
    );
  }

  return (
    <MailDetailContent
      key={mail.id}
      mail={mail}
      onToggleStar={onToggleStar}
      onSnooze={onSnooze}
      onTrash={onTrash}
      onSpam={onSpam}
      onReply={onReply}
    />
  );
}

function MailDetailContent({
  mail,
  onToggleStar,
  onSnooze,
  onTrash,
  onSpam,
  onReply,
}: {
  mail: Mail;
  onToggleStar: (id: string) => void;
  onSnooze: (id: string) => void;
  onTrash: (id: string) => void;
  onSpam: (id: string) => void;
  onReply: (mail: Mail, body: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(mail.aiDraft);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSendReply() {
    if (!draft.trim()) return;
    setSending(true);
    setSendError("");
    try {
      await onReply(mail, draft);
      setSent(true);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send reply.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full min-h-[32rem] flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="shrink-0">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colorsFor(
              mail.inbox
            )} text-sm font-semibold text-black`}
          >
            {mail.from.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {mail.from}
            </p>
            <p className="truncate text-xs text-zinc-500">{mail.fromEmail}</p>
          </div>
          <span className="shrink-0 text-xs text-zinc-500">{mail.time}</span>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleStar(mail.id)}
              title="Star"
              className={`rounded-full p-1.5 transition-colors hover:bg-white/10 ${
                mail.starred ? "text-amber-300" : "text-zinc-500"
              }`}
            >
              <Star className="h-3.5 w-3.5" fill={mail.starred ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={() => onSnooze(mail.id)}
              title="Snooze"
              className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Clock className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSpam(mail.id)}
              title="Report spam"
              className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
            >
              <AlertOctagon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onTrash(mail.id)}
              title="Delete"
              className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <h2 className="mt-3 text-base font-semibold text-white">
          {mail.subject}
        </h2>
        {mail.labels.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {mail.labels.map((label) => (
              <span
                key={label}
                className={`rounded-full border px-2 py-0.5 text-[10px] ${
                  labelColors[label] ?? "border-white/10 bg-white/5 text-zinc-400"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1">
        {mail.bodyHtml ? (
          <EmailHtmlFrame html={mail.bodyHtml} />
        ) : (
          <div className="no-scrollbar flex h-full flex-col gap-2 overflow-y-auto">
            {mail.body.map((paragraph, i) => (
              <p key={i} className="text-sm leading-6 text-zinc-300">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 rounded-2xl border border-violet-400/20 bg-violet-500/[0.06] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Drafted in your tone
          </div>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
            {mail.toneMatch}% match
          </span>
        </div>

        <textarea
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="mt-2.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
        />

        <div className="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDraft(mail.aiDraft)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </button>

          <motion.button
            whileHover={{ scale: sending ? 1 : 1.03 }}
            whileTap={{ scale: sending ? 1 : 0.97 }}
            type="button"
            disabled={sending || !draft.trim()}
            onClick={handleSendReply}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-1.5 text-xs font-semibold text-black shadow-lg shadow-violet-500/30 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {sending ? "Sending..." : "Send reply"}
          </motion.button>
        </div>

        {sendError && (
          <p className="mt-2 text-xs text-red-300">{sendError}</p>
        )}

        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Reply sent to {mail.from.split(" ")[0]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
