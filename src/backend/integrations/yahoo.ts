import { randomUUID } from "crypto";
import { ImapFlow, type ListResponse } from "imapflow";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";
import { auth } from "@/backend/lib/auth";
import { pool } from "@/backend/lib/db";
import { decryptSecret, encryptSecret } from "@/backend/lib/crypto";
import type { CategoryKey, FolderKey, Mail } from "@/frontend/components/dashboard/data";

const IMAP_HOST = "imap.mail.yahoo.com";
const IMAP_PORT = 993;
const SMTP_HOST = "smtp.mail.yahoo.com";
const SMTP_PORT = 465;

export class YahooError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type YahooCredentials = { email: string; appPassword: string };

async function verifyLogin(email: string, appPassword: string) {
  const client = new ImapFlow({
    host: IMAP_HOST,
    port: IMAP_PORT,
    secure: true,
    auth: { user: email, pass: appPassword },
    logger: false,
  });
  try {
    await client.connect();
  } catch {
    throw new YahooError(
      "Could not sign in to Yahoo Mail. Check the email and app password.",
      400
    );
  } finally {
    await client.logout().catch(() => {});
  }
}

export async function connectYahooAccount(headers: Headers, email: string, appPassword: string) {
  const session = await auth.api.getSession({ headers });
  if (!session) throw new YahooError("Not signed in.", 401);

  await verifyLogin(email, appPassword);

  const encrypted = encryptSecret(appPassword);
  await pool.query(
    `insert into "yahoo_account" ("id", "userId", "email", "appPassword", "updatedAt")
     values ($1, $2, $3, $4, now())
     on conflict ("userId") do update set "email" = $3, "appPassword" = $4, "updatedAt" = now()`,
    [randomUUID(), session.user.id, email, encrypted]
  );
}

export async function disconnectYahooAccount(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) throw new YahooError("Not signed in.", 401);
  await pool.query(`delete from "yahoo_account" where "userId" = $1`, [session.user.id]);
}

export async function getYahooCredentials(headers: Headers): Promise<YahooCredentials> {
  const session = await auth.api.getSession({ headers });
  if (!session) throw new YahooError("Not signed in.", 401);

  const result = await pool.query(
    `select "email", "appPassword" from "yahoo_account" where "userId" = $1`,
    [session.user.id]
  );
  if (result.rows.length === 0) {
    throw new YahooError("Yahoo Mail account is not connected.", 400);
  }
  const row = result.rows[0] as { email: string; appPassword: string };
  return { email: row.email, appPassword: decryptSecret(row.appPassword) };
}

export async function isYahooConnected(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) return false;
  const result = await pool.query(`select 1 from "yahoo_account" where "userId" = $1`, [
    session.user.id,
  ]);
  return result.rows.length > 0;
}

async function withClient<T>(
  creds: YahooCredentials,
  fn: (client: ImapFlow) => Promise<T>
): Promise<T> {
  const client = new ImapFlow({
    host: IMAP_HOST,
    port: IMAP_PORT,
    secure: true,
    auth: { user: creds.email, pass: creds.appPassword },
    logger: false,
  });
  try {
    await client.connect();
    return await fn(client);
  } catch (error) {
    if (error instanceof YahooError) throw error;
    throw new YahooError(
      error instanceof Error ? error.message : "Yahoo Mail request failed.",
      502
    );
  } finally {
    await client.logout().catch(() => {});
  }
}

type SpecialUse = "\\Inbox" | "\\Sent" | "\\Drafts" | "\\Junk" | "\\Trash";

const folderSpecialUse: Record<Exclude<FolderKey, "starred" | "snoozed" | "all">, SpecialUse> = {
  inbox: "\\Inbox",
  sent: "\\Sent",
  drafts: "\\Drafts",
  spam: "\\Junk",
  trash: "\\Trash",
};

const fallbackNames: Record<SpecialUse, string[]> = {
  "\\Inbox": ["INBOX"],
  "\\Sent": ["Sent", "Sent Messages"],
  "\\Drafts": ["Draft", "Drafts"],
  "\\Junk": ["Bulk Mail", "Bulk", "Spam", "Junk"],
  "\\Trash": ["Trash", "Deleted Items"],
};

async function resolveMailboxPath(client: ImapFlow, specialUse: SpecialUse) {
  const list: ListResponse[] = await client.list();
  const match = list.find((box) => box.specialUse === specialUse);
  if (match) return match.path;

  const fallback = fallbackNames[specialUse].find((name) => list.some((box) => box.path === name));
  return fallback ?? fallbackNames[specialUse][0];
}

function formatTime(date: Date) {
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

type ListOptions = {
  folder: FolderKey;
  query?: string;
  maxResults?: number;
};

export async function listMessages(creds: YahooCredentials, opts: ListOptions) {
  const requested = (opts.folder === "starred" || opts.folder === "all" ? "inbox" : opts.folder) as Exclude<
    FolderKey,
    "starred" | "snoozed" | "all"
  >;
  const specialUse = folderSpecialUse[requested];

  return withClient(creds, async (client) => {
    const path = await resolveMailboxPath(client, specialUse);
    const lock = await client.getMailboxLock(path);
    try {
      const mailbox = client.mailbox;
      if (!mailbox || mailbox.exists === 0) return [];

      const max = opts.maxResults ?? 25;
      const from = Math.max(1, mailbox.exists - max + 1);
      const range = `${from}:${mailbox.exists}`;

      const results: Mail[] = [];
      for await (const msg of client.fetch(range, { envelope: true, flags: true, source: true, uid: true })) {
        const parsed = msg.source ? await simpleParser(msg.source) : null;
        const flags = msg.flags ?? new Set<string>();
        const envelope = msg.envelope;
        const from_ = envelope?.from?.[0];
        const bodyText = parsed?.text ?? "";
        const bodyHtml = typeof parsed?.html === "string" ? parsed.html : undefined;

        const mail: Mail = {
          id: String(msg.uid),
          inbox: "yahoo",
          folder: requested,
          category: "primary" as CategoryKey,
          from: from_?.name || from_?.address || "Unknown",
          fromEmail: from_?.address ?? "",
          subject: envelope?.subject || "(no subject)",
          preview: (bodyText || "").slice(0, 140),
          body: bodyText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
          bodyHtml,
          time: formatTime(envelope?.date ? new Date(envelope.date) : new Date()),
          unread: !flags.has("\\Seen"),
          starred: flags.has("\\Flagged"),
          snoozed: false,
          labels: [],
          aiDraft: "",
          toneMatch: 0,
          threadId: envelope?.messageId ?? undefined,
          messageId: envelope?.messageId ?? undefined,
        };

        if (opts.query) {
          const haystack = `${mail.subject} ${mail.from} ${mail.fromEmail} ${mail.preview}`.toLowerCase();
          if (!haystack.includes(opts.query.toLowerCase())) continue;
        }
        results.push(mail);
      }
      results.reverse();
      if (opts.folder === "starred") return results.filter((m) => m.starred);
      return results;
    } finally {
      lock.release();
    }
  });
}

export async function getFolderCounts(creds: YahooCredentials) {
  return withClient(creds, async (client) => {
    const counts: Record<string, { total: number; unread: number }> = {};
    for (const key of Object.keys(folderSpecialUse) as (keyof typeof folderSpecialUse)[]) {
      try {
        const path = await resolveMailboxPath(client, folderSpecialUse[key]);
        const status = await client.status(path, { messages: true, unseen: true });
        counts[key] = { total: status.messages ?? 0, unread: status.unseen ?? 0 };
      } catch {
        counts[key] = { total: 0, unread: 0 };
      }
    }
    return counts;
  });
}

export async function setFlag(creds: YahooCredentials, id: string, flag: string, add: boolean) {
  await withClient(creds, async (client) => {
    const path = await resolveMailboxPath(client, "\\Inbox");
    const lock = await client.getMailboxLock(path);
    try {
      if (add) await client.messageFlagsAdd(Number(id), [flag], { uid: true });
      else await client.messageFlagsRemove(Number(id), [flag], { uid: true });
    } finally {
      lock.release();
    }
  });
}

export async function moveMessage(creds: YahooCredentials, id: string, destination: SpecialUse) {
  await withClient(creds, async (client) => {
    const inboxPath = await resolveMailboxPath(client, "\\Inbox");
    const lock = await client.getMailboxLock(inboxPath);
    try {
      const destPath = await resolveMailboxPath(client, destination);
      await client.messageMove(Number(id), destPath, { uid: true });
    } finally {
      lock.release();
    }
  });
}

export async function sendMessage(
  creds: YahooCredentials,
  opts: { to: string; subject: string; body: string; inReplyTo?: string }
) {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: { user: creds.email, pass: creds.appPassword },
  });

  await transporter.sendMail({
    from: creds.email,
    to: opts.to,
    subject: opts.subject,
    text: opts.body,
    inReplyTo: opts.inReplyTo,
    references: opts.inReplyTo,
  });
}
