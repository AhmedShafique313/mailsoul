"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-white/5 px-6 py-10 lg:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </span>
          <span className="text-sm font-semibold text-white">Mailsoul</span>
        </div>
        <p className="text-sm text-zinc-500">
          (c) {new Date().getFullYear()} Mailsoul. All inboxes, one voice.
        </p>
      </div>
    </motion.footer>
  );
}
