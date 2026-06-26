"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Plus, Search } from "lucide-react";
import Sidebar from "@/frontend/components/dashboard/Sidebar";
import InsightsRow from "@/frontend/components/dashboard/InsightsRow";
import CategoryTabs from "@/frontend/components/dashboard/CategoryTabs";
import MailList from "@/frontend/components/dashboard/MailList";
import MailDetail from "@/frontend/components/dashboard/MailDetail";
import ComposeModal from "@/frontend/components/dashboard/ComposeModal";
import {
  initialMails,
  matchesFolder,
  type CategoryKey,
  type FolderKey,
  type InboxKey,
  type Mail,
} from "@/frontend/components/dashboard/data";

type Props = {
  userName: string;
  userEmail: string;
};

export default function DashboardView({ userName, userEmail }: Props) {
  const [mails, setMails] = useState<Mail[]>(initialMails);
  const [activeInbox, setActiveInbox] = useState<InboxKey | "all">("all");
  const [activeFolder, setActiveFolder] = useState<FolderKey>("inbox");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [customLabels, setCustomLabels] = useState<string[]>(() => {
    const fromMails = new Set(initialMails.flatMap((m) => m.labels));
    return Array.from(fromMails);
  });
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialMails[0]?.id ?? null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function updateMail(id: string, updater: (mail: Mail) => Mail) {
    setMails((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
  }

  const handleToggleStar = (id: string) =>
    updateMail(id, (m) => ({ ...m, starred: !m.starred }));
  const handleSnooze = (id: string) =>
    updateMail(id, (m) => ({ ...m, snoozed: !m.snoozed }));
  const handleTrash = (id: string) =>
    updateMail(id, (m) => ({ ...m, folder: "trash" }));
  const handleSpam = (id: string) =>
    updateMail(id, (m) => ({ ...m, folder: "spam" }));

  function handleCreateLabel(label: string) {
    setCustomLabels((prev) => (prev.includes(label) ? prev : [...prev, label]));
  }

  const filteredMails = useMemo(() => {
    let result =
      activeInbox === "all" ? mails : mails.filter((m) => m.inbox === activeInbox);

    result = result.filter((m) => matchesFolder(m, activeFolder));

    if (activeFolder === "inbox" && activeCategory !== "all") {
      result = result.filter((m) => m.category === activeCategory);
    }

    if (activeLabel) {
      result = result.filter((m) => m.labels.includes(activeLabel));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.from.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q)
      );
    }

    return result;
  }, [mails, activeInbox, activeFolder, activeCategory, activeLabel, search]);

  const selectedMail =
    filteredMails.find((m) => m.id === selectedId) ?? filteredMails[0] ?? null;

  return (
    <div className="relative flex min-h-screen bg-[#05050a] text-white">
      <Sidebar
        mails={mails}
        userName={userName}
        userEmail={userEmail}
        activeInbox={activeInbox}
        onSelectInbox={(key) => {
          setActiveInbox(key);
          setSelectedId(null);
          setMobileSidebarOpen(false);
        }}
        activeFolder={activeFolder}
        onSelectFolder={(folder) => {
          setActiveFolder(folder);
          setSelectedId(null);
          setMobileSidebarOpen(false);
        }}
        labels={customLabels}
        activeLabel={activeLabel}
        onSelectLabel={(label) => {
          setActiveLabel(label);
          setMobileSidebarOpen(false);
        }}
        onCreateLabel={handleCreateLabel}
        onCompose={() => {
          setComposeOpen(true);
          setMobileSidebarOpen(false);
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-[-14rem] -z-10 flex justify-center blur-3xl"
        >
          <div className="animate-blob h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-violet-600/30 via-fuchsia-500/20 to-cyan-400/20" />
        </div>

        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-[#05050a]/80 px-4 py-3 backdrop-blur-xl lg:px-8">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex max-w-md flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <Search className="h-4 w-4 shrink-0 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search every inbox..."
              className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setComposeOpen(true)}
            aria-label="Compose"
            className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 p-2.5 text-black shadow-lg shadow-violet-500/30 lg:hidden"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Welcome back, {userName.split(" ")[0]}.
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Here is everything across your inboxes, drafted in your voice.
              </p>
            </div>

            <InsightsRow mails={mails} />
          </motion.div>

          {activeFolder === "inbox" && (
            <CategoryTabs
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          )}

          <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="no-scrollbar max-h-[34rem] overflow-y-auto pr-1 lg:max-h-[40rem]">
              <MailList
                mails={filteredMails}
                selectedId={selectedMail?.id ?? null}
                onSelect={setSelectedId}
                onToggleStar={handleToggleStar}
                onSnooze={handleSnooze}
                onTrash={handleTrash}
                onSpam={handleSpam}
              />
            </div>
            <div className="lg:max-h-[40rem]">
              <MailDetail
                mail={selectedMail}
                onToggleStar={handleToggleStar}
                onSnooze={handleSnooze}
                onTrash={handleTrash}
                onSpam={handleSpam}
              />
            </div>
          </div>
        </main>

        <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
      </div>
    </div>
  );
}
