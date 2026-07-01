import { NextRequest, NextResponse } from "next/server";
import { YahooError, getYahooCredentials, listMessages } from "@/backend/integrations/yahoo";
import type { FolderKey } from "@/frontend/components/dashboard/data";

export async function GET(request: NextRequest) {
  try {
    const creds = await getYahooCredentials(request.headers);
    const { searchParams } = new URL(request.url);

    const folder = (searchParams.get("folder") ?? "inbox") as FolderKey;
    const query = searchParams.get("q") ?? undefined;

    const mails = await listMessages(creds, { folder, query });
    return NextResponse.json({ mails });
  } catch (error) {
    if (error instanceof YahooError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }
}
