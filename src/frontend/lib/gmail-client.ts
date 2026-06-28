import type { CategoryKey, FolderKey, Mail } from "@/frontend/components/dashboard/data";

export type GmailAction = "star" | "unstar" | "trash" | "spam" | "read" | "unread";

async function parseOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}

export async function fetchMails(folder: FolderKey, category: CategoryKey | "all", search?: string) {
  const params = new URLSearchParams({ folder, category });
  if (search) params.set("q", search);
  const res = await fetch(`/api/gmail/messages?${params.toString()}`);
  const data = await parseOrThrow(res);
  return data.mails as Mail[];
}

export async function fetchLabelCounts() {
  const res = await fetch("/api/gmail/labels");
  const data = await parseOrThrow(res);
  return data.counts as Record<string, { total: number; unread: number }>;
}

export async function updateMailAction(id: string, action: GmailAction) {
  const res = await fetch(`/api/gmail/messages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return parseOrThrow(res);
}

export async function sendMail(payload: {
  to: string;
  subject: string;
  body: string;
  threadId?: string;
  inReplyTo?: string;
}) {
  const res = await fetch("/api/gmail/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseOrThrow(res);
}
