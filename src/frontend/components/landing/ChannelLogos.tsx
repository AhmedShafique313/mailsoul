"use client";

import { motion } from "framer-motion";

const channels = [
  { name: "Gmail", colors: "from-red-400 to-amber-300" },
  { name: "Outlook", colors: "from-blue-400 to-sky-300" },
  { name: "Yahoo Mail", colors: "from-purple-400 to-fuchsia-300" },
  { name: "iCloud Mail", colors: "from-cyan-400 to-blue-300" },
  { name: "Proton Mail", colors: "from-violet-400 to-indigo-300" },
  { name: "Zoho Mail", colors: "from-orange-400 to-red-300" },
];

export default function ChannelLogos() {
  return (
    <section id="channels" className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-zinc-500">
          Connects to the inboxes you already use
        </p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6"
        >
          {channels.map((channel) => (
            <motion.div
              key={channel.name}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -4 }}
              className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]"
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br ${channel.colors}`}
              />
              <span className="truncate text-sm text-zinc-300">
                {channel.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Mailsoul connects 5+ providers via their official developer APIs,
          with more added every release.
        </p>
      </div>
    </section>
  );
}
