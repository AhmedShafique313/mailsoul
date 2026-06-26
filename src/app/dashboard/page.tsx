import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/backend/lib/auth";
import DashboardView from "@/frontend/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard: Mailsoul",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  return (
    <DashboardView
      userName={session.user.name}
      userEmail={session.user.email}
    />
  );
}
