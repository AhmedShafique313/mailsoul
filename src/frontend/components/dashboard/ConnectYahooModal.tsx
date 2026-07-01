"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ExternalLink, X } from "lucide-react";
import { connectYahoo } from "@/frontend/lib/yahoo-client";

type Props = {
  open: boolean;
  onClose: () => void;
  onConnected: () => void;
};

export default function ConnectYahooModal({ open, onClose, onConnected }: Props) {
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  function handleClose() {
    onClose();
    setConnected(false);
    setError("");
    setEmail("");
    setAppPassword("");
  }

  async function handleConnect() {
    if (!email.trim() || !appPassword.trim()) return;
    setConnecting(true);
    setError("");
    try {
      await connectYahoo(email.trim(), appPassword.trim());
      setConnected(true);
      onConnected();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Yahoo Mail.");
    } finally {
      setConnecting(false);
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
            className="relative w-full max-w-md rounded-t-3xl border border-white/10 bg-[#0a0a12] p-6 shadow-2xl sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-300" />
              <h3 className="text-lg font-semibold text-white">Connect Yahoo Mail</h3>
            </div>

            {connected ? (
              <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-8 text-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                <p className="text-sm font-medium text-emerald-200">
                  Yahoo Mail is connected. Your inbox will sync now.
                </p>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                <p className="text-sm leading-6 text-zinc-400">
                  Yahoo doesn&apos;t support third-party sign-in for reading mail, so use an app
                  password instead of your real password.
                </p>
                <a
                  href="https://login.yahoo.com/myaccount/security"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200"
                >
                  Generate an app password in Yahoo Account Security
                  <ExternalLink className="h-3 w-3" />
                </a>

                <label className="mt-2 flex flex-col gap-1">
                  <span className="text-xs font-medium text-zinc-400">Yahoo email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yahoo.com"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-zinc-400">App password</span>
                  <input
                    type="password"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    placeholder="16 character app password"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
                  />
                </label>

                {error && <p className="text-xs text-red-300">{error}</p>}

                <motion.button
                  whileHover={{ scale: connecting ? 1 : 1.02 }}
                  whileTap={{ scale: connecting ? 1 : 0.97 }}
                  type="button"
                  disabled={!email.trim() || !appPassword.trim() || connecting}
                  onClick={handleConnect}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-violet-500/30 disabled:opacity-50"
                >
                  {connecting ? "Connecting..." : "Connect"}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
