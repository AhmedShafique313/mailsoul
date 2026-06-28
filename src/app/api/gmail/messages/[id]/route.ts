import { NextRequest, NextResponse } from "next/server";
import {
  GmailError,
  getGoogleAccessToken,
  modifyMessage,
  trashMessage,
} from "@/backend/integrations/gmail";

type Action = "star" | "unstar" | "trash" | "spam" | "read" | "unread";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { accessToken } = await getGoogleAccessToken(request.headers);
    const { action } = (await request.json()) as { action: Action };

    switch (action) {
      case "star":
        await modifyMessage(accessToken, id, { addLabelIds: ["STARRED"] });
        break;
      case "unstar":
        await modifyMessage(accessToken, id, { removeLabelIds: ["STARRED"] });
        break;
      case "trash":
        await trashMessage(accessToken, id);
        break;
      case "spam":
        await modifyMessage(accessToken, id, {
          addLabelIds: ["SPAM"],
          removeLabelIds: ["INBOX"],
        });
        break;
      case "read":
        await modifyMessage(accessToken, id, { removeLabelIds: ["UNREAD"] });
        break;
      case "unread":
        await modifyMessage(accessToken, id, { addLabelIds: ["UNREAD"] });
        break;
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof GmailError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  }
}
