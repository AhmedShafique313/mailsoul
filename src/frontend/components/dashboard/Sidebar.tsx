"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  FileText,
  Inbox as InboxIcon,
  Layers,
  LogOut,
  Plus,
  Send,
  Settings,
  Sparkles,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { signOut } from "@/frontend/lib/auth-client";
import {
  folderMeta,
  getFolderCount,
  getInboxCount,
  inboxMeta,
  labelColors,
  type FolderKey,
  type InboxKey,
  type Mail,
} from "@/frontend/components/dashboard/data";

const folderIcons: Record<FolderKey, typeof InboxIcon> = {
  inbox: InboxIcon,
  starred: Star,
  snoozed: Clock,
  sent: Send,
  drafts: FileText,
  all: Layers,
  spam: AlertOctagon,
  trash: Trash2,
};

type Props = {
  mails: Mail[];
  userName: string;
  userEmail: string;
  activeInbox: InboxKey | "all";
  onSelectInbox: (key: InboxKey | "all") => void;
  activeFolder: FolderKey;
  onSelectFolder: (folder: FolderKey) => void;
  labels: string[];
  activeLabel: string | null;
  onSelectLabel: (label: string | null) => void;
  onCreateLabel: (label: string) => void;
  onCompose: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function Sidebar({
  mails,
  userName,
  userEmail,
  activeInbox,
  onSelectInbox,
  activeFolder,
  onSelectFolder,
  labels,
  activeLabel,
  onSelectLabel,
  onCreateLabel,
  onCompose,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: Props) {
  const router = useRouter();
  const [creatingLabel, setCreatingLabel] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/signin"),
      },
    });
  }

  function handleCreateLabel() {
    const trimmed = newLabel.trim();
    if (trimmed) onCreateLabel(trimmed);
    setNewLabel("");
    setCreatingLabel(false);
  }

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            aria-hidden
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-white/5 bg-[#05050a] transition-all duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-20" : "w-72"}`}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            {!collapsed && (
              <span className="truncate text-lg font-semibold tracking-tight text-white">
                Mailsoul
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="text-zinc-500 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white lg:block"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="px-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onCompose}
            title="Compose"
            className={`flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 py-2.5 text-sm font-semibold text-black shadow-lg shadow-violet-500/30 ${
              collapsed ? "w-full" : "w-full px-4"
            }`}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && "Compose"}
          </motion.button>
        </div>

        <nav className="no-scrollbar mt-5 flex-1 overflow-y-auto px-3">
          <div className="flex flex-col gap-0.5">
            {folderMeta.map((folder) => {
              const Icon = folderIcons[folder.key];
              const count = getFolderCount(mails, folder.key);
              return (
                <button
                  key={folder.key}
                  type="button"
                  title={folder.label}
                  onClick={() => onSelectFolder(folder.key)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    activeFolder === folder.key
                      ? "bg-violet-500/15 text-white"
                      : "text-zinc-400 hover:bg-white/5"
                  } ${collapsed ? "justify-center" : "justify-between"}`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && folder.label}
                  </span>
                  {!collapsed && count > 0 && (
                    <span className="text-xs text-zinc-500">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="my-4 h-px bg-white/5" />

          <div className="flex flex-col gap-0.5">
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                Inboxes
              </p>
            )}
            <button
              type="button"
              title="All Inboxes"
              onClick={() => onSelectInbox("all")}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                activeInbox === "all"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5"
              } ${collapsed ? "justify-center" : "justify-between"}`}
            >
              <span className="flex items-center gap-3">
                <Layers className="h-4 w-4 shrink-0" />
                {!collapsed && "All Inboxes"}
              </span>
              {!collapsed && (
                <span className="text-xs text-zinc-500">
                  {getInboxCount(mails, "all")}
                </span>
              )}
            </button>
            {inboxMeta.map((inbox) => (
              <button
                key={inbox.key}
                type="button"
                title={inbox.name}
                onClick={() => onSelectInbox(inbox.key)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  activeInbox === inbox.key
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5"
                } ${collapsed ? "justify-center" : "justify-between"}`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br ${inbox.colors}`}
                  />
                  {!collapsed && inbox.name}
                </span>
                {!collapsed && (
                  <span className="text-xs text-zinc-500">
                    {getInboxCount(mails, inbox.key)}
                  </span>
                )}
              </button>
            ))}
            <button
              type="button"
              disabled
              title="Coming soon"
              className={`flex items-center gap-3 rounded-xl border border-dashed border-white/10 px-3 py-2 text-sm font-medium text-zinc-500 opacity-60 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && "Connect inbox"}
            </button>
          </div>

          {!collapsed && (
            <>
              <div className="my-4 h-px bg-white/5" />
              <div className="flex flex-col gap-1 px-1">
                <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                  Labels
                </p>
                <button
                  type="button"
                  onClick={() => onSelectLabel(null)}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium transition-colors ${
                    activeLabel === null
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:bg-white/5"
                  }`}
                >
                  <Tag className="h-3 w-3" />
                  All labels
                </button>
                {labels.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onSelectLabel(label)}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium transition-colors ${
                      activeLabel === label
                        ? "bg-white/10 text-white"
                        : "text-zinc-500 hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        (labelColors[label] ?? "bg-zinc-500").split(" ")[0]
                      }`}
                    />
                    {label}
                  </button>
                ))}

                {creatingLabel ? (
                  <div className="flex items-center gap-1 px-1">
                    <input
                      autoFocus
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateLabel();
                        if (e.key === "Escape") setCreatingLabel(false);
                      }}
                      placeholder="New label"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateLabel}
                      className="shrink-0 rounded-lg bg-violet-500/20 px-2 py-1 text-xs font-medium text-violet-200"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCreatingLabel(true)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-zinc-600 transition-colors hover:bg-white/5 hover:text-zinc-400"
                  >
                    <Plus className="h-3 w-3" />
                    Create label
                  </button>
                )}
              </div>
            </>
          )}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div
            className={`flex items-center gap-2 rounded-xl px-2 py-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-400/40 text-xs font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">
                  {userName}
                </p>
                <p className="truncate text-[11px] text-zinc-500">
                  {userEmail}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            disabled
            title="Coming soon"
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-500 opacity-60 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!collapsed && "Settings"}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/10 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}
