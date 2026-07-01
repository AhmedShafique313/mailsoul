import { NextRequest, NextResponse } from "next/server";
import { YahooError, getYahooCredentials, sendMessage } from "@/backend/integrations/yahoo";

export async function POST(request: NextRequest) {
  try {
    const creds = await getYahooCredentials(request.headers);
    const { to, subject, body, inReplyTo } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing to, subject, or body." }, { status: 400 });
    }

    await sendMessage(creds, { to, subject, body, inReplyTo });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof YahooError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
