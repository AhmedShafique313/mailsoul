import { NextRequest, NextResponse } from "next/server";
import { GmailError, getGoogleAccessToken, getLabelCounts } from "@/backend/integrations/gmail";

const LABEL_IDS = ["INBOX", "SENT", "DRAFT", "SPAM", "TRASH", "STARRED"];

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getGoogleAccessToken(request.headers);
    const counts = await getLabelCounts(accessToken, LABEL_IDS);
    return NextResponse.json({ counts });
  } catch (error) {
    if (error instanceof GmailError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to load labels." }, { status: 500 });
  }
}
