"use client";

import { motion } from "framer-motion";
import { Clock, Inbox, Sparkles, Zap } from "lucide-react";
import { getInboxCount, getUnreadCount, inboxMeta, type Mail } from "@/frontend/components/dashboard/data";

type Props = {
  mails: Mail[];
};

export default function InsightsRow({ mails }: Props) {
  const stats = [
    {
      icon: Inbox,
      value: getUnreadCount(mails, "all").toString(),
      label: "Unread",
      title: `${getUnreadCount(mails, "all")} unread of ${getInboxCount(mails, "all")} messages total`,
    },
    {
      icon: Sparkles,
      value: "93%",
      label: "Tone match",
      title: "Average tone match based on your last 1,204 sent emails",
    },
    {
      icon: Zap,
      value: inboxMeta.length.toString(),
      label: "Connected",
      title: "Gmail, Outlook, Yahoo, iCloud, Proton",
    },
    {
      icon: Clock,
      value: "2.4h",
      label: "Avg. reply",
      title: "18% faster since enabling drafts",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            title={stat.title}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/15 to-cyan-400/15 text-violet-300">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">{stat.value}</p>
              <p className="text-[11px] text-zinc-500">{stat.label}</p>
            </div>
            {i < stats.length - 1 && (
              <span className="ml-2.5 hidden h-7 w-px bg-white/10 sm:block" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
