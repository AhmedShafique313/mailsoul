"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Menu, Plus, Search } from "lucide-react";
import Sidebar from "@/frontend/components/dashboard/Sidebar";
import InsightsRow from "@/frontend/components/dashboard/InsightsRow";
import CategoryTabs from "@/frontend/components/dashboard/CategoryTabs";
import MailList from "@/frontend/components/dashboard/MailList";
import MailDetail from "@/frontend/components/dashboard/MailDetail";
import ComposeModal from "@/frontend/components/dashboard/ComposeModal";
import {
  fetchLabelCounts,
  fetchMails,
  sendMail,
  updateMailAction,
} from "@/frontend/lib/gmail-client";
import {
  type CategoryKey,
  type FolderKey,
  type InboxKey,
  type Mail,
} from "@/frontend/components/dashboard/data";

type Props = {
  userName: string;
  userEmail: string;
};

const labelCountKey: Partial<Record<FolderKey, string>> = {
  inbox: "INBOX",
  sent: "SENT",
  drafts: "DRAFT",
  spam: "SPAM",
  trash: "TRASH",
  starred: "STARRED",
};

export default function DashboardView({ userName, userEmail }: Props) {
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeInbox, setActiveInbox] = useState<InboxKey | "all">("all");
  const [activeFolder, setActiveFolder] = useState<FolderKey>("inbox");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [customLabels, setCustomLabels] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [folderCounts, setFolderCounts] = useState<Partial<Record<FolderKey, number>>>({});

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchMails(activeFolder, activeCategory, search.trim() || undefined);
        if (!cancelled) {
          setMails(result);
          setSelectedId(result[0]?.id ?? null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load mail.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, search ? 350 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeFolder, activeCategory, search]);

  function refreshFolderCounts() {
    fetchLabelCounts()
      .then((counts) => {
        const mapped: Partial<Record<FolderKey, number>> = {};
        for (const [folder, labelId] of Object.entries(labelCountKey)) {
          mapped[folder as FolderKey] = counts[labelId as string]?.total ?? 0;
        }
        setFolderCounts(mapped);
      })
      .catch(() => {});
  }

  useEffect(() => {
    refreshFolderCounts();
  }, [activeFolder]);

  function updateMail(id: string, updater: (mail: Mail) => Mail) {
    setMails((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
  }

  async function handleSelect(id: string) {
    setSelectedId(id);
    const mail = mails.find((m) => m.id === id);
    if (mail?.unread) {
      updateMail(id, (m) => ({ ...m, unread: false }));
      try {
        await updateMailAction(id, "read");
      } catch {
        updateMail(id, (m) => ({ ...m, unread: true }));
      }
    }
  }

  async function handleToggleStar(id: string) {
    const mail = mails.find((m) => m.id === id);
    if (!mail) return;
    const nextStarred = !mail.starred;
    updateMail(id, (m) => ({ ...m, starred: nextStarred }));
    try {
      await updateMailAction(id, nextStarred ? "star" : "unstar");
    } catch {
      updateMail(id, (m) => ({ ...m, starred: !nextStarred }));
    }
  }

  function handleSnooze(id: string) {
    updateMail(id, (m) => ({ ...m, snoozed: !m.snoozed }));
  }

  async function handleTrash(id: string) {
    setMails((prev) => prev.filter((m) => m.id !== id));
    try {
      await updateMailAction(id, "trash");
      refreshFolderCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move to trash.");
    }
  }

  async function handleSpam(id: string) {
    setMails((prev) => prev.filter((m) => m.id !== id));
    try {
      await updateMailAction(id, "spam");
      refreshFolderCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to report spam.");
    }
  }

  async function handleSend(payload: { to: string; subject: string; body: string }) {
    await sendMail(payload);
  }

  async function handleReply(mail: Mail, body: string) {
    await sendMail({
      to: mail.fromEmail,
      subject: mail.subject.toLowerCase().startsWith("re:") ? mail.subject : `Re: ${mail.subject}`,
      body,
      threadId: mail.threadId,
      inReplyTo: mail.messageId,
    });
  }

  function handleCreateLabel(label: string) {
    setCustomLabels((prev) => (prev.includes(label) ? prev : [...prev, label]));
  }

  const filteredMails = useMemo(() => {
    let result = mails;

    if (activeInbox !== "all" && activeInbox !== "gmail") {
      result = [];
    }

    if (activeFolder === "starred") {
      result = result.filter((m) => m.starred);
    } else if (activeFolder === "snoozed") {
      result = result.filter((m) => m.snoozed);
    }

    if (activeLabel) {
      result = result.filter((m) => m.labels.includes(activeLabel));
    }

    return result;
  }, [mails, activeInbox, activeFolder, activeLabel]);

  const selectedMail =
    filteredMails.find((m) => m.id === selectedId) ?? filteredMails[0] ?? null;

  return (
    <div className="relative flex min-h-screen bg-[#05050a] text-white">
      <Sidebar
        mails={filteredMails}
        liveFolderCounts={folderCounts}
        userName={userName}
        userEmail={userEmail}
        activeInbox={activeInbox}
        onSelectInbox={(key) => {
          setActiveInbox(key);
          setMobileSidebarOpen(false);
        }}
        activeFolder={activeFolder}
        onSelectFolder={(folder) => {
          setActiveFolder(folder);
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

        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-[#05050a]/80 px-4 py-2.5 backdrop-blur-xl lg:px-8">
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

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white">
                Welcome back, {userName.split(" ")[0]}.
              </h1>
              <p className="mt-0.5 text-sm text-zinc-400">
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

          {error && (
            <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="grid flex-1 grid-cols-1 gap-3 lg:h-[calc(100vh-13rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="no-scrollbar max-h-[26rem] overflow-y-auto pr-1 lg:h-full lg:max-h-none">
              {loading ? (
                <div className="flex h-40 items-center justify-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading mail...
                </div>
              ) : (
                <MailList
                  mails={filteredMails}
                  selectedId={selectedMail?.id ?? null}
                  onSelect={handleSelect}
                  onToggleStar={handleToggleStar}
                  onSnooze={handleSnooze}
                  onTrash={handleTrash}
                  onSpam={handleSpam}
                />
              )}
            </div>
            <div className="lg:h-full">
              <MailDetail
                mail={selectedMail}
                onToggleStar={handleToggleStar}
                onSnooze={handleSnooze}
                onTrash={handleTrash}
                onSpam={handleSpam}
                onReply={handleReply}
              />
            </div>
          </div>
        </main>

        <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} onSend={handleSend} />
      </div>
    </div>
  );
}
