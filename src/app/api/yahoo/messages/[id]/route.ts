import { NextRequest, NextResponse } from "next/server";
import { YahooError, getYahooCredentials, moveMessage, setFlag } from "@/backend/integrations/yahoo";

type Action = "star" | "unstar" | "trash" | "spam" | "read" | "unread";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const creds = await getYahooCredentials(request.headers);
    const { action } = (await request.json()) as { action: Action };

    switch (action) {
      case "star":
        await setFlag(creds, id, "\\Flagged", true);
        break;
      case "unstar":
        await setFlag(creds, id, "\\Flagged", false);
        break;
      case "trash":
        await moveMessage(creds, id, "\\Trash");
        break;
      case "spam":
        await moveMessage(creds, id, "\\Junk");
        break;
      case "read":
        await setFlag(creds, id, "\\Seen", true);
        break;
      case "unread":
        await setFlag(creds, id, "\\Seen", false);
        break;
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof YahooError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  }
}
