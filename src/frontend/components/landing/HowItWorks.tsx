"use client";

import { motion } from "framer-motion";
import { Link2, ScanSearch, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Connect your inboxes",
    description:
      "Securely link Gmail, Outlook, and other accounts through each provider's official developer application. OAuth only, no passwords stored.",
  },
  {
    icon: ScanSearch,
    step: "02",
    title: "Mailsoul learns your tone",
    description:
      "Our RAG pipeline indexes your Sent folder to understand your tone, vocabulary, and the way you structure a message.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Draft and send, faster",
    description:
      "Reply from one unified inbox with drafts that already sound like you. Review, tweak, and send in seconds.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            How Mailsoul works
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            From scattered inboxes to one voice in three steps.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.15 }}
          className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <div
            aria-hidden
            className="absolute top-10 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent md:block"
          />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                className="relative flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-[#0a0a12] shadow-lg shadow-violet-500/10"
                >
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[10px] font-bold text-black">
                    {step.step}
                  </span>
                  <Icon className="h-7 w-7 text-violet-300" />
                </motion.div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
