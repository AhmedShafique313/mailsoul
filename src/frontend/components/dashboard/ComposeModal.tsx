"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send, Sparkles, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSend: (payload: { to: string; subject: string; body: string }) => Promise<void>;
};

export default function ComposeModal({ open, onClose, onSend }: Props) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleClose() {
    onClose();
    setSent(false);
    setError("");
    setTo("");
    setSubject("");
    setMessage("");
  }

  async function handleSend() {
    if (!to.trim()) return;
    setSending(true);
    setError("");
    try {
      await onSend({ to: to.trim(), subject: subject.trim() || "(no subject)", body: message });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-t-3xl border border-white/10 bg-[#0a0a12] p-6 shadow-2xl sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-semibold text-white">New message</h3>

            {sent ? (
              <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-8 text-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                <p className="text-sm font-medium text-emerald-200">
                  Your message is on its way.
                </p>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="To: name@example.com"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
                />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
                />
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message, or let Mailsoul draft it in your tone..."
                  className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm leading-6 text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
                />

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                    Draft in my tone
                  </button>

                  <motion.button
                    whileHover={{ scale: to && !sending ? 1.03 : 1 }}
                    whileTap={{ scale: to && !sending ? 0.97 : 1 }}
                    type="button"
                    disabled={!to.trim() || sending}
                    onClick={handleSend}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-violet-500/30 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {sending ? "Sending..." : "Send"}
                  </motion.button>
                </div>

                {error && (
                  <p className="text-xs text-red-300">{error}</p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
