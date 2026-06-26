import type { Metadata } from "next";
import Navbar from "@/frontend/components/landing/Navbar";
import Footer from "@/frontend/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service: Mailsoul",
  description: "The terms that govern your use of Mailsoul's unified inbox.",
};

const sections = [
  {
    title: "Acceptance of terms",
    body: [
      "By creating a Mailsoul account or connecting an inbox, you agree to these terms. If you do not agree, please do not use the product.",
    ],
  },
  {
    title: "The service",
    body: [
      "Mailsoul unifies Gmail, Outlook, and other connected accounts into a single inbox, and uses a tone matching assistant built from your Sent folder to help you draft replies faster.",
      "Mailsoul is currently offered as a private beta. Features, connected providers, and reliability may change as we continue building the product.",
    ],
  },
  {
    title: "Your account",
    body: [
      "You must provide accurate information when creating an account and keep your login credentials secure.",
      "You are responsible for the inboxes you choose to connect and for the access you grant to those providers through OAuth.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "You agree not to use Mailsoul to send spam, harass others, or violate any applicable law or the terms of any connected email provider.",
      "We may suspend or terminate accounts that misuse the service or attempt to circumvent its security.",
    ],
  },
  {
    title: "Third-party providers",
    body: [
      "Connected providers such as Gmail, Outlook, Yahoo Mail, iCloud Mail, and Proton Mail are accessed through their official developer APIs. Your use of those providers remains subject to their own terms.",
      "We are not responsible for outages, policy changes, or access restrictions imposed by a third-party provider.",
    ],
  },
  {
    title: "Beta availability",
    body: [
      "During the private beta, Mailsoul is provided as is, without warranties of uninterrupted or error-free service. We will do our best to keep you informed of any significant changes.",
    ],
  },
  {
    title: "Termination",
    body: [
      "You may stop using Mailsoul and disconnect your accounts at any time. We may suspend access if these terms are violated or if required by law.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "To the extent permitted by law, Mailsoul is not liable for indirect or incidental damages arising from your use of the service.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these terms as Mailsoul evolves. Continued use of the service after an update means you accept the revised terms.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#05050a] text-white">
      <Navbar />
      <main className="flex-1 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Terms of Service
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
