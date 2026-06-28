export type InboxKey = "gmail" | "outlook" | "yahoo" | "icloud" | "proton";

export type FolderKey =
  | "inbox"
  | "starred"
  | "snoozed"
  | "sent"
  | "drafts"
  | "all"
  | "spam"
  | "trash";

export type CategoryKey = "primary" | "social" | "updates" | "forums" | "promotions";

export type Mail = {
  id: string;
  inbox: InboxKey;
  folder: Exclude<FolderKey, "starred" | "snoozed" | "all">;
  category: CategoryKey;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string[];
  bodyHtml?: string;
  time: string;
  unread: boolean;
  starred: boolean;
  snoozed: boolean;
  labels: string[];
  aiDraft: string;
  toneMatch: number;
  threadId?: string;
  messageId?: string;
};

export const inboxMeta: {
  key: InboxKey;
  name: string;
  colors: string;
}[] = [
  { key: "gmail", name: "Gmail", colors: "from-red-400 to-amber-300" },
  { key: "outlook", name: "Outlook", colors: "from-blue-400 to-sky-300" },
  { key: "yahoo", name: "Yahoo Mail", colors: "from-purple-400 to-fuchsia-300" },
  { key: "icloud", name: "iCloud Mail", colors: "from-cyan-400 to-blue-300" },
  { key: "proton", name: "Proton Mail", colors: "from-violet-400 to-indigo-300" },
];

export const folderMeta: { key: FolderKey; label: string }[] = [
  { key: "inbox", label: "Inbox" },
  { key: "starred", label: "Starred" },
  { key: "snoozed", label: "Snoozed" },
  { key: "sent", label: "Sent" },
  { key: "drafts", label: "Drafts" },
  { key: "all", label: "All Mail" },
  { key: "spam", label: "Spam" },
  { key: "trash", label: "Trash" },
];

export const categoryMeta: { key: CategoryKey; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "social", label: "Social" },
  { key: "updates", label: "Updates" },
  { key: "forums", label: "Forums" },
  { key: "promotions", label: "Promotions" },
];

export const labelColors: Record<string, string> = {
  Work: "bg-violet-500/15 text-violet-300 border-violet-400/20",
  Personal: "bg-cyan-500/15 text-cyan-300 border-cyan-400/20",
  Finance: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  Travel: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
};

export const initialMails: Mail[] = [
  {
    id: "m1",
    inbox: "outlook",
    folder: "inbox",
    category: "primary",
    from: "Priya Sharma",
    fromEmail: "priya@acmecorp.com",
    subject: "Re: Q3 partnership proposal",
    preview: "Loved the deck, can we lock a call for Thursday?",
    body: [
      "Hi, just went through the deck with our team and we're impressed with the direction.",
      "Could we lock a call for Thursday afternoon to talk through pricing and rollout timeline?",
      "Looking forward to it.",
    ],
    time: "9:42 AM",
    unread: true,
    starred: true,
    snoozed: false,
    labels: ["Work"],
    aiDraft:
      "Thursday afternoon works well on my end, how does 3pm your time sound? I'll send a calendar hold and a quick pricing summary ahead of the call so we can dive straight into rollout.",
    toneMatch: 96,
  },
  {
    id: "m2",
    inbox: "gmail",
    folder: "inbox",
    category: "primary",
    from: "Jordan Lee",
    fromEmail: "jordan.lee@gmail.com",
    subject: "Dinner this weekend?",
    preview: "Thinking that new ramen place near the office...",
    body: [
      "Hey! A few of us are doing dinner this weekend, thinking that new ramen place near the office.",
      "You free Saturday around 7?",
    ],
    time: "8:15 AM",
    unread: true,
    starred: false,
    snoozed: false,
    labels: ["Personal"],
    aiDraft:
      "Saturday at 7 works for me, count me in. Want me to grab a table or are you already on it?",
    toneMatch: 91,
  },
  {
    id: "m3",
    inbox: "proton",
    folder: "inbox",
    category: "updates",
    from: "Stripe",
    fromEmail: "invoices@stripe.com",
    subject: "Your invoice is ready",
    preview: "Your March invoice has been generated.",
    body: [
      "Your invoice for March is ready to view in your dashboard.",
      "Amount due: $48.00. This will be charged automatically in 3 days.",
    ],
    time: "Yesterday",
    unread: false,
    starred: false,
    snoozed: false,
    labels: ["Finance"],
    aiDraft: "No reply needed, this is an automated billing notice.",
    toneMatch: 100,
  },
  {
    id: "m4",
    inbox: "outlook",
    folder: "inbox",
    category: "updates",
    from: "IT Helpdesk",
    fromEmail: "helpdesk@acmecorp.com",
    subject: "Password expiring in 3 days",
    preview: "Reset your password to keep access to Outlook.",
    body: [
      "Your corporate password will expire in 3 days.",
      "Reset it now to avoid being locked out of your account.",
    ],
    time: "Yesterday",
    unread: false,
    starred: false,
    snoozed: false,
    labels: ["Work"],
    aiDraft: "No reply needed, just reset the password through the IT portal.",
    toneMatch: 100,
  },
  {
    id: "m5",
    inbox: "yahoo",
    folder: "inbox",
    category: "social",
    from: "Mark Davies",
    fromEmail: "mark.d@yahoo.com",
    subject: "Old college friends reunion",
    preview: "We are planning a get together next month...",
    body: [
      "Hey, a bunch of us from college are planning a reunion next month.",
      "Would love for you to make it if your schedule allows.",
    ],
    time: "2 days ago",
    unread: true,
    starred: true,
    snoozed: false,
    labels: [],
    aiDraft:
      "This sounds great, count me in tentatively. Send me the date as soon as it's locked and I'll block my calendar.",
    toneMatch: 88,
  },
  {
    id: "m6",
    inbox: "icloud",
    folder: "inbox",
    category: "primary",
    from: "Aunt Carol",
    fromEmail: "carol@icloud.com",
    subject: "Photos from the trip",
    preview: "Sharing the album from our weekend getaway.",
    body: [
      "Sharing the album from our weekend getaway, some really good shots in there!",
      "Let me know which ones you want printed.",
    ],
    time: "3 days ago",
    unread: false,
    starred: false,
    snoozed: true,
    labels: ["Travel"],
    aiDraft:
      "These came out beautifully, thank you for sharing! I'd love prints of the sunset shots from the dock.",
    toneMatch: 90,
  },
  {
    id: "m7",
    inbox: "gmail",
    folder: "inbox",
    category: "forums",
    from: "Sara Kim · Figma",
    fromEmail: "sara@figma.com",
    subject: "Your design file was shared",
    preview: "Sara invited you to collaborate on the Q3 brand kit.",
    body: [
      "Sara Kim invited you to collaborate on \"Q3 Brand Kit.\"",
      "Open the file to start reviewing the latest components.",
    ],
    time: "4 days ago",
    unread: false,
    starred: false,
    snoozed: false,
    labels: ["Work"],
    aiDraft: "No reply needed, just open the file when you get a chance.",
    toneMatch: 100,
  },
  {
    id: "m8",
    inbox: "gmail",
    folder: "inbox",
    category: "promotions",
    from: "Notion",
    fromEmail: "news@notion.so",
    subject: "New AI features just shipped",
    preview: "See what's new in your workspace this week.",
    body: [
      "We just shipped a batch of new AI features for your workspace.",
      "Take a look and let us know what you think.",
    ],
    time: "5 days ago",
    unread: false,
    starred: false,
    snoozed: false,
    labels: [],
    aiDraft: "No reply needed, this is a product update newsletter.",
    toneMatch: 100,
  },
  {
    id: "m9",
    inbox: "outlook",
    folder: "sent",
    category: "primary",
    from: "You",
    fromEmail: "you@mailsoul.app",
    subject: "Re: Onboarding checklist",
    preview: "Thanks, this is exactly what I needed to get started.",
    body: [
      "Thanks, this is exactly what I needed to get started.",
      "I'll have the first milestone done by Friday.",
    ],
    time: "Yesterday",
    unread: false,
    starred: false,
    snoozed: false,
    labels: ["Work"],
    aiDraft: "",
    toneMatch: 100,
  },
  {
    id: "m10",
    inbox: "gmail",
    folder: "drafts",
    category: "primary",
    from: "You",
    fromEmail: "you@mailsoul.app",
    subject: "Following up on the budget review",
    preview: "Hi team, wanted to follow up on the budget review from...",
    body: [
      "Hi team, wanted to follow up on the budget review from last week.",
      "Let me know if you need anything else from my side before the deadline.",
    ],
    time: "2 days ago",
    unread: false,
    starred: false,
    snoozed: false,
    labels: ["Finance"],
    aiDraft: "",
    toneMatch: 100,
  },
  {
    id: "m11",
    inbox: "yahoo",
    folder: "spam",
    category: "promotions",
    from: "MegaSavings Deals",
    fromEmail: "deals@megasavings-offers.biz",
    subject: "You've won a $500 gift card!!!",
    preview: "Click here now to claim your prize before it expires...",
    body: [
      "Congratulations! You have been selected to receive a $500 gift card.",
      "Click the link below before this offer expires.",
    ],
    time: "1 week ago",
    unread: false,
    starred: false,
    snoozed: false,
    labels: [],
    aiDraft: "",
    toneMatch: 0,
  },
  {
    id: "m12",
    inbox: "proton",
    folder: "trash",
    category: "updates",
    from: "Old Newsletter",
    fromEmail: "noreply@oldnewsletter.com",
    subject: "Weekly digest: 12 stories you missed",
    preview: "Here is your weekly roundup of top stories.",
    body: ["Here is your weekly roundup of the top stories you may have missed."],
    time: "2 weeks ago",
    unread: false,
    starred: false,
    snoozed: false,
    labels: [],
    aiDraft: "",
    toneMatch: 0,
  },
];

export function matchesFolder(mail: Mail, folder: FolderKey) {
  switch (folder) {
    case "starred":
      return mail.starred && mail.folder !== "trash" && mail.folder !== "spam";
    case "snoozed":
      return mail.snoozed;
    case "all":
      return mail.folder !== "trash" && mail.folder !== "spam";
    default:
      return mail.folder === folder;
  }
}

export function getFolderCount(mails: Mail[], folder: FolderKey) {
  return mails.filter((m) => matchesFolder(m, folder)).length;
}

export function getInboxCount(mails: Mail[], key: InboxKey | "all") {
  if (key === "all") return mails.length;
  return mails.filter((m) => m.inbox === key).length;
}

export function getUnreadCount(mails: Mail[], key: InboxKey | "all") {
  const set = key === "all" ? mails : mails.filter((m) => m.inbox === key);
  return set.filter((m) => m.unread).length;
}
