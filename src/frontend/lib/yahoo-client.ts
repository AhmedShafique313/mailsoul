import type { FolderKey, Mail } from "@/frontend/components/dashboard/data";

export type YahooAction = "star" | "unstar" | "trash" | "spam" | "read" | "unread";

async function parseOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}

export async function fetchYahooStatus() {
  const res = await fetch("/api/yahoo/connect");
  const data = await parseOrThrow(res);
  return data.connected as boolean;
}

export async function connectYahoo(email: string, appPassword: string) {
  const res = await fetch("/api/yahoo/connect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, appPassword }),
  });
  return parseOrThrow(res);
}

export async function disconnectYahoo() {
  const res = await fetch("/api/yahoo/connect", { method: "DELETE" });
  return parseOrThrow(res);
}

export async function fetchYahooMails(folder: FolderKey, search?: string) {
  const params = new URLSearchParams({ folder });
  if (search) params.set("q", search);
  const res = await fetch(`/api/yahoo/messages?${params.toString()}`);
  const data = await parseOrThrow(res);
  return data.mails as Mail[];
}

export async function fetchYahooLabelCounts() {
  const res = await fetch("/api/yahoo/labels");
  const data = await parseOrThrow(res);
  return data.counts as Record<string, { total: number; unread: number }>;
}

export async function updateYahooMailAction(id: string, action: YahooAction) {
  const res = await fetch(`/api/yahoo/messages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return parseOrThrow(res);
}

export async function sendYahooMail(payload: {
  to: string;
  subject: string;
  body: string;
  inReplyTo?: string;
}) {
  const res = await fetch("/api/yahoo/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseOrThrow(res);
}
