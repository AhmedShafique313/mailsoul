import { NextRequest, NextResponse } from "next/server";
import { GmailError, getGoogleAccessToken, sendMessage } from "@/backend/integrations/gmail";

export async function POST(request: NextRequest) {
  try {
    const { accessToken, userEmail } = await getGoogleAccessToken(request.headers);
    const { to, subject, body, threadId, inReplyTo } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing to, subject, or body." }, { status: 400 });
    }

    const result = await sendMessage(accessToken, {
      from: userEmail,
      to,
      subject,
      body,
      threadId,
      inReplyTo,
    });

    return NextResponse.json({ ok: true, id: result?.id });
  } catch (error) {
    if (error instanceof GmailError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
