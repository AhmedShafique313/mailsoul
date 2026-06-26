"use client";

import { useState } from "react";
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
};

function colorsFor(inbox: Mail["inbox"]) {
  return inboxMeta.find((i) => i.key === inbox)?.colors ?? "from-violet-400 to-cyan-300";
}

export default function MailDetail({ mail, onToggleStar, onSnooze, onTrash, onSpam }: Props) {
  if (!mail) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-violet-300">
          <Sparkles className="h-5 w-5" />
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
    />
  );
}

function MailDetailContent({
  mail,
  onToggleStar,
  onSnooze,
  onTrash,
  onSpam,
}: {
  mail: Mail;
  onToggleStar: (id: string) => void;
  onSnooze: (id: string) => void;
  onTrash: (id: string) => void;
  onSpam: (id: string) => void;
}) {
  const [draft, setDraft] = useState(mail.aiDraft);
  const [sent, setSent] = useState(false);

  return (
    <div className="no-scrollbar flex h-full flex-col gap-5 overflow-y-auto rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <div>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colorsFor(
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
        <h2 className="mt-4 text-lg font-semibold text-white">
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
        <div className="mt-3 flex flex-col gap-2">
          {mail.body.map((paragraph, i) => (
            <p key={i} className="text-sm leading-6 text-zinc-300">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-auto rounded-2xl border border-violet-400/20 bg-violet-500/[0.06] p-4">
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
          rows={4}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm leading-6 text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
        />

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDraft(mail.aiDraft)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setSent(true)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-1.5 text-xs font-semibold text-black shadow-lg shadow-violet-500/30"
          >
            <Send className="h-3.5 w-3.5" />
            Send reply
          </motion.button>
        </div>

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
