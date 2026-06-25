"use client";

import { motion } from "framer-motion";
import { Inbox, BrainCircuit, PenLine, ShieldCheck, Search, Zap } from "lucide-react";

const features = [
  {
    icon: Inbox,
    title: "One unified inbox",
    description:
      "Gmail, Outlook, and every other account you connect, merged into a single calm timeline so you stop tab-hopping.",
  },
  {
    icon: BrainCircuit,
    title: "Tone-aware RAG engine",
    description:
      "Mailsoul reads your Sent folder to learn your tone, vocabulary, and structure, then retrieves it whenever you draft.",
  },
  {
    icon: PenLine,
    title: "Draft in your voice",
    description:
      "Generate replies that sound like you wrote them, not a generic assistant, so you edit less and send faster.",
  },
  {
    icon: Zap,
    title: "Real-time sync",
    description:
      "New mail across every connected channel lands in your unified inbox the moment it arrives.",
  },
  {
    icon: Search,
    title: "Search across everything",
    description:
      "One search bar, every account, so you can find a thread regardless of which inbox it actually lives in.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    description:
      "Official OAuth connections to every provider's developer API, so your credentials never touch our servers.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for inboxes that got out of hand
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Everything you need to manage every account from one place,
            without losing what makes your writing yours.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]"
              >
                <div
                  aria-hidden
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-400/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100"
                />
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-violet-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
