"use client";

import { motion } from "framer-motion";
import { AlertOctagon, Clock, Star, Trash2 } from "lucide-react";
import { inboxMeta, labelColors, type Mail } from "@/frontend/components/dashboard/data";

type Props = {
  mails: Mail[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleStar: (id: string) => void;
  onSnooze: (id: string) => void;
  onTrash: (id: string) => void;
  onSpam: (id: string) => void;
};

function colorsFor(inbox: Mail["inbox"]) {
  return inboxMeta.find((i) => i.key === inbox)?.colors ?? "from-violet-400 to-cyan-300";
}

export default function MailList({
  mails,
  selectedId,
  onSelect,
  onToggleStar,
  onSnooze,
  onTrash,
  onSpam,
}: Props) {
  if (mails.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
        <p className="text-sm font-medium text-zinc-300">No mail here yet</p>
        <p className="text-xs text-zinc-500">
          Try another folder, inbox, or clear your search.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {mails.map((mail, i) => (
        <motion.div
          key={mail.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
          className={`group flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
            selectedId === mail.id
              ? "border-violet-400/30 bg-violet-500/10"
              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
          }`}
        >
          <button
            type="button"
            onClick={() => onSelect(mail.id)}
            className="flex min-w-0 flex-1 items-start gap-3 text-left"
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colorsFor(
                mail.inbox
              )} text-xs font-semibold text-black`}
            >
              {mail.from.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`truncate text-sm ${
                    mail.unread ? "font-semibold text-white" : "font-medium text-zinc-300"
                  }`}
                >
                  {mail.from}
                </p>
                <span className="shrink-0 text-xs text-zinc-500">{mail.time}</span>
              </div>
              <p className="truncate text-sm text-zinc-300">{mail.subject}</p>
              <p className="truncate text-xs text-zinc-500">{mail.preview}</p>
              {mail.labels.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
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
          </button>

          <div className="flex shrink-0 flex-col items-end gap-2">
            {mail.unread && <span className="h-2 w-2 rounded-full bg-violet-400" />}
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
        </motion.div>
      ))}
    </div>
  );
}
