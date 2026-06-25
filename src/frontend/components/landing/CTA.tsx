"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section id="cta" className="px-6 py-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-16 text-center"
      >
        <div
          aria-hidden
          className="animate-blob absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.25),transparent_70%)]"
        />
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Bring every inbox into one voice.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
          Join the private beta and connect Gmail, Outlook, and the rest of
          your accounts in minutes.
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4" />
              You&apos;re on the list. We&apos;ll email {email} when it&apos;s your turn.
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-violet-500/30"
              >
                Join waitlist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-4 text-xs text-zinc-500">
          No spam. Just an invite when your spot opens up.
        </p>
      </motion.div>
    </section>
  );
}
