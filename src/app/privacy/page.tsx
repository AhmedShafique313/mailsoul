import type { Metadata } from "next";
import Navbar from "@/frontend/components/landing/Navbar";
import Footer from "@/frontend/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy: Mailsoul",
  description:
    "How Mailsoul collects, uses, and protects your data across every inbox you connect.",
};

const sections = [
  {
    title: "Overview",
    body: [
      "Mailsoul is a unified inbox for Gmail, Outlook, and every other account you connect, paired with a tone matching assistant that helps you draft replies faster. This policy explains what data we collect, why we collect it, and how you stay in control of it.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "Account details you give us when you create a Mailsoul account, such as your name and email address.",
      "Read and send access to the inboxes you choose to connect, granted through each provider's official OAuth flow. We never ask for or store your email password.",
      "The contents of your Sent folder, which our drafting assistant indexes to learn your tone, vocabulary, and the way you structure a message.",
    ],
  },
  {
    title: "How we use your data",
    body: [
      "To merge your connected accounts into a single unified inbox view.",
      "To build a private tone profile from your Sent folder so draft suggestions sound like you, not a generic assistant.",
      "To keep your inbox in sync in real time and let you search across every connected account at once.",
      "We do not sell your data, and we do not use the content of your emails to train models that serve other users.",
    ],
  },
  {
    title: "How we store and protect data",
    body: [
      "Connections to Gmail, Outlook, Yahoo Mail, iCloud Mail, Proton Mail, and other providers use OAuth tokens scoped to the minimum access required. Tokens and indexed content are encrypted at rest.",
      "You can disconnect any inbox at any time from your account settings, which immediately revokes our access and removes the associated tone index.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can request a copy of the data we hold about you, ask us to correct it, or ask us to delete your account and all associated data.",
      "Reach out through our contact form and we will action your request as soon as possible.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "Mailsoul is in private beta and this policy may be updated as the product evolves. We will let active users know before any material change takes effect.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#05050a] text-white">
      <Navbar />
      <main className="flex-1 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-zinc-500">Last updated June 2026</p>

          <div className="mt-12 flex flex-col gap-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-white">
                  {section.title}
                </h2>
                <div className="mt-3 flex flex-col gap-2">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-sm leading-7 text-zinc-400">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
