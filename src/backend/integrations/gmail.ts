import { auth } from "@/backend/lib/auth";
import type {
  CategoryKey,
  FolderKey,
  Mail,
} from "@/frontend/components/dashboard/data";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";

export class GmailError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function getGoogleAccessToken(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) throw new GmailError("Not signed in.", 401);

  try {
    const tokens = await auth.api.getAccessToken({
      body: { providerId: "google", userId: session.user.id },
      headers,
    });
    if (!tokens?.accessToken) {
      throw new GmailError("Google account is not connected.", 400);
    }
    return { accessToken: tokens.accessToken, userEmail: session.user.email };
  } catch {
    throw new GmailError("Google account is not connected.", 400);
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function gmailFetch(accessToken: string, path: string, init?: RequestInit) {
  const res = await fetch(`${GMAIL_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new GmailError(`Gmail API error (${res.status}): ${text}`, res.status);
  }

  if (res.status === 204) return null;
  return res.json();
}

const folderLabelIds: Record<Exclude<FolderKey, "starred" | "snoozed" | "all">, string> = {
  inbox: "INBOX",
  sent: "SENT",
  drafts: "DRAFT",
  spam: "SPAM",
  trash: "TRASH",
};

const categoryLabelIds: Record<CategoryKey, string> = {
  primary: "CATEGORY_PERSONAL",
  social: "CATEGORY_SOCIAL",
  updates: "CATEGORY_UPDATES",
  forums: "CATEGORY_FORUMS",
  promotions: "CATEGORY_PROMOTIONS",
};

type ListOptions = {
  folder: FolderKey;
  category?: CategoryKey | "all";
  query?: string;
  maxResults?: number;
};

export async function listMessages(accessToken: string, opts: ListOptions) {
  const params = new URLSearchParams();
  params.set("maxResults", String(opts.maxResults ?? 25));

  const labelIds: string[] = [];
  if (opts.folder === "starred") {
    labelIds.push("STARRED");
  } else if (opts.folder === "snoozed") {
    // Gmail's snooze feature has no public API; snoozed mail is tracked client-side only.
    labelIds.push("INBOX");
  } else if (opts.folder !== "all") {
    labelIds.push(folderLabelIds[opts.folder]);
  }
  if (opts.folder === "inbox" && opts.category && opts.category !== "all") {
    labelIds.push(categoryLabelIds[opts.category]);
  }
  labelIds.forEach((id) => params.append("labelIds", id));

  const qParts: string[] = [];
  if (opts.folder === "all" || opts.folder === "starred") {
    qParts.push("-in:spam", "-in:trash");
  }
  if (opts.query) qParts.push(opts.query);
  if (qParts.length) params.set("q", qParts.join(" "));

  const list = await gmailFetch(accessToken, `/messages?${params.toString()}`);
  const ids: string[] = (list?.messages ?? []).map((m: { id: string }) => m.id);

  const messages = await mapWithConcurrency(ids, 4, (id) =>
    gmailFetch(accessToken, `/messages/${id}?format=full`)
  );

  return messages.filter(Boolean).map((raw) => parseMessage(raw, opts.folder));
}

function decodeBase64Url(data: string) {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf-8");
}

function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

type GmailPart = {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailPart[];
};

function findPart(payload: GmailPart, mimeType: string): GmailPart | undefined {
  if (payload.mimeType === mimeType && payload.body?.data) return payload;
  if (payload.parts) {
    for (const part of payload.parts) {
      const found = findPart(part, mimeType);
      if (found) return found;
    }
  }
  return undefined;
}

function extractBodies(payload: GmailPart): { text: string; html: string } {
  const plainPart = findPart(payload, "text/plain");
  const htmlPart = findPart(payload, "text/html");
  return {
    text: plainPart?.body?.data ? decodeBase64Url(plainPart.body.data) : "",
    html: htmlPart?.body?.data ? decodeBase64Url(htmlPart.body.data) : "",
  };
}

function parseFromHeader(value: string) {
  const match = value.match(/^(.*?)\s*<(.+)>$/);
  if (match) {
    return { name: match[1].replace(/"/g, "").trim() || match[2], email: match[2] };
  }
  return { name: value, email: value };
}

function formatTime(internalDate: string) {
  const date = new Date(Number(internalDate));
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function categoryFromLabels(labelIds: string[]): CategoryKey {
  if (labelIds.includes("CATEGORY_SOCIAL")) return "social";
  if (labelIds.includes("CATEGORY_UPDATES")) return "updates";
  if (labelIds.includes("CATEGORY_FORUMS")) return "forums";
  if (labelIds.includes("CATEGORY_PROMOTIONS")) return "promotions";
  return "primary";
}

function folderFromLabels(labelIds: string[], requested: FolderKey): Mail["folder"] {
  if (requested !== "all" && requested !== "starred") return requested as Mail["folder"];
  if (labelIds.includes("DRAFT")) return "drafts";
  if (labelIds.includes("TRASH")) return "trash";
  if (labelIds.includes("SPAM")) return "spam";
  if (labelIds.includes("SENT")) return "sent";
  return "inbox";
}

type RawMessage = {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  internalDate: string;
  payload: GmailPart & { headers?: { name: string; value: string }[] };
};

function parseMessage(raw: RawMessage, requestedFolder: FolderKey): Mail {
  const headers = raw.payload.headers ?? [];
  const get = (name: string) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";

  const { name, email } = parseFromHeader(get("From"));
  const labelIds = raw.labelIds ?? [];
  const { text, html } = extractBodies(raw.payload);
  const fallbackText = text || (html ? stripHtml(html) : raw.snippet ?? "");

  return {
    id: raw.id,
    inbox: "gmail",
    folder: folderFromLabels(labelIds, requestedFolder),
    category: categoryFromLabels(labelIds),
    from: name,
    fromEmail: email,
    subject: get("Subject") || "(no subject)",
    preview: raw.snippet ?? "",
    body: fallbackText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    bodyHtml: html ? html.replace(/<script[\s\S]*?<\/script>/gi, "") : undefined,
    time: formatTime(raw.internalDate),
    unread: labelIds.includes("UNREAD"),
    starred: labelIds.includes("STARRED"),
    snoozed: false,
    labels: [],
    aiDraft: "",
    toneMatch: 0,
    threadId: raw.threadId,
    messageId: get("Message-Id") || get("Message-ID") || undefined,
  };
}

export async function modifyMessage(
  accessToken: string,
  id: string,
  body: { addLabelIds?: string[]; removeLabelIds?: string[] }
) {
  return gmailFetch(accessToken, `/messages/${id}/modify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function trashMessage(accessToken: string, id: string) {
  return gmailFetch(accessToken, `/messages/${id}/trash`, { method: "POST" });
}

export async function getLabelCounts(accessToken: string, labelIds: string[]) {
  const results = await mapWithConcurrency(labelIds, 3, async (id) => {
    try {
      const label = await gmailFetch(accessToken, `/labels/${id}`);
      return [id, { total: label?.messagesTotal ?? 0, unread: label?.messagesUnread ?? 0 }] as const;
    } catch {
      return [id, { total: 0, unread: 0 }] as const;
    }
  });
  return Object.fromEntries(results);
}

function encodeBase64Url(input: string) {
  return Buffer.from(input, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendMessage(
  accessToken: string,
  opts: {
    from: string;
    to: string;
    subject: string;
    body: string;
    threadId?: string;
    inReplyTo?: string;
  }
) {
  const headers = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
    `Content-Type: text/plain; charset="UTF-8"`,
  ];
  if (opts.inReplyTo) {
    headers.push(`In-Reply-To: ${opts.inReplyTo}`, `References: ${opts.inReplyTo}`);
  }
  const raw = `${headers.join("\r\n")}\r\n\r\n${opts.body}`;

  return gmailFetch(accessToken, "/messages/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      raw: encodeBase64Url(raw),
      ...(opts.threadId ? { threadId: opts.threadId } : {}),
    }),
  });
}
