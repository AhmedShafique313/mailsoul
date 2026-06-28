import { NextRequest, NextResponse } from "next/server";
import { GmailError, getGoogleAccessToken, listMessages } from "@/backend/integrations/gmail";
import type { CategoryKey, FolderKey } from "@/frontend/components/dashboard/data";

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getGoogleAccessToken(request.headers);
    const { searchParams } = new URL(request.url);

    const folder = (searchParams.get("folder") ?? "inbox") as FolderKey;
    const category = (searchParams.get("category") ?? "all") as CategoryKey | "all";
    const query = searchParams.get("q") ?? undefined;

    const mails = await listMessages(accessToken, { folder, category, query });
    return NextResponse.json({ mails });
  } catch (error) {
    if (error instanceof GmailError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }
}
