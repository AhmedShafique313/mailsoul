import { NextRequest, NextResponse } from "next/server";
import { YahooError, getFolderCounts, getYahooCredentials } from "@/backend/integrations/yahoo";

export async function GET(request: NextRequest) {
  try {
    const creds = await getYahooCredentials(request.headers);
    const counts = await getFolderCounts(creds);
    return NextResponse.json({ counts });
  } catch (error) {
    if (error instanceof YahooError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to load labels." }, { status: 500 });
  }
}
