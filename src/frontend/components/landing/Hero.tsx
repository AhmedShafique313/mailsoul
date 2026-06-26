"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Inbox, Sparkles, Send } from "lucide-react";

type MailPreview = {
  from: string;
  subject: string;
  preview: string;
  source: string;
};

const inboxes: { key: string; name: string; count: number }[] = [
  { key: "all", name: "All Inboxes", count: 128 },
  { key: "gmail", name: "Gmail · Personal", count: 42 },
  { key: "outlook", name: "Outlook · Work", count: 31 },
  { key: "yahoo", name: "Yahoo Mail", count: 12 },
  { key: "icloud", name: "iCloud Mail", count: 9 },
  { key: "proton", name: "Proton Mail", count: 34 },
];

const mailsByInbox: Record<string, MailPreview[]> = {
  gmail: [
    {
      from: "Jordan",
      subject: "Dinner this weekend?",
      preview: "Thinking that new ramen place near the office...",
      source: "Gmail",
    },
    {
      from: "Sara · Figma",
      subject: "Your design file was shared",
      preview: "Sara invited you to collaborate on the Q3 brand kit.",
      source: "Gmail",
    },
  ],
  outlook: [
    {
      from: "Priya · Acme Corp",
      subject: "Re: Q3 partnership proposal",
      preview: "Loved the deck, can we lock a call for Thursday?",
      source: "Outlook",
    },
    {
      from: "IT Helpdesk",
      subject: "Password expiring in 3 days",
      preview: "Reset your password to keep access to Outlook.",
      source: "Outlook",
    },
  ],
  yahoo: [
    {
      from: "Yahoo Finance",
      subject: "Markets close higher today",
      preview: "Tech stocks rally as inflation data cools.",
      source: "Yahoo",
    },
    {
      from: "Mark",
      subject: "Old college friends reunion",
      preview: "We are planning a get together next month...",
      source: "Yahoo",
    },
  ],
  icloud: [
    {
      from: "Apple",
      subject: "Your iCloud storage is almost full",
      preview: "Upgrade your plan to keep backing up your devices.",
      source: "iCloud",
    },
    {
      from: "Aunt Carol",
      subject: "Photos from the trip",
      preview: "Sharing the album from our weekend getaway.",
      source: "iCloud",
    },
  ],
  proton: [
    {
      from: "Stripe",
      subject: "Your invoice is ready",
      preview: "Your March invoice has been generated.",
      source: "Proton",
    },
    {
      from: "ProtonVPN",
      subject: "Your subscription renews soon",
      preview: "Renew now to keep your connection secure.",
      source: "Proton",
    },
  ],
};

mailsByInbox.all = [
  mailsByInbox.outlook[0],
  mailsByInbox.gmail[0],
  mailsByInbox.proton[0],
];

export default function Hero() {
  const [activeInbox, setActiveInbox] = useState("all");
  const mails = mailsByInbox[activeInbox] ?? [];

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-28 lg:px-8 lg:pt-28">
      {/* Gradient mesh background */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[-10rem] -z-10 flex justify-center blur-3xl"
      >
        <div className="animate-blob h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-violet-600/40 via-fuchsia-500/30 to-cyan-400/30" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.15),transparent_60%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-4xl text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          Now in private beta, connect 5+ inboxes
        </div>

        <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          One inbox.{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            Every account.
          </span>{" "}
          Your voice.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-zinc-400">
          Mailsoul unifies Gmail, Outlook, and every other inbox you run into
          a single calm view, then uses your own Sent folder to learn how you
          actually write, so every draft already sounds like you.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-violet-500/30"
          >
            Claim your inbox
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            See how it works
          </motion.a>
        </div>
      </motion.div>

      {/* Hero visual: unified inbox mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="relative mx-auto mt-20 max-w-5xl"
      >
        <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-cyan-400/20 blur-2xl" />
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ml-3 flex items-center gap-1.5 text-xs text-zinc-400">
              <Inbox className="h-3.5 w-3.5" /> Mailsoul Unified Inbox
            </span>
          </div>

          <div className="grid grid-cols-1 divide-white/5 md:grid-cols-[260px_1fr] md:divide-x">
            <div className="hidden flex-col gap-1 p-4 md:flex">
              {inboxes.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveInbox(item.key)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeInbox === item.key
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5"
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-xs text-zinc-500">{item.count}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 p-5 text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeInbox}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-3"
                >
                  {mails.map((mail) => (
                    <div
                      key={mail.subject}
                      className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                    >
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-400/30 text-xs font-semibold text-white">
                        {mail.from.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-white">
                            {mail.from}
                          </p>
                          <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
                            {mail.source}
                          </span>
                        </div>
                        <p className="truncate text-sm text-zinc-300">
                          {mail.subject}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {mail.preview}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.85 }}
                className="mt-1 flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 p-3"
              >
                <Send className="h-4 w-4 shrink-0 text-violet-300" />
                <p className="text-xs text-violet-200">
                  Drafted in your tone, matched against 1,204 of your sent
                  emails.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
