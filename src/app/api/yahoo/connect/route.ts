import { NextRequest, NextResponse } from "next/server";
import {
  YahooError,
  connectYahooAccount,
  disconnectYahooAccount,
  isYahooConnected,
} from "@/backend/integrations/yahoo";

export async function GET(request: NextRequest) {
  const connected = await isYahooConnected(request.headers);
  return NextResponse.json({ connected });
}

export async function POST(request: NextRequest) {
  try {
    const { email, appPassword } = (await request.json()) as {
      email?: string;
      appPassword?: string;
    };
    if (!email || !appPassword) {
      return NextResponse.json({ error: "Missing email or app password." }, { status: 400 });
    }
    await connectYahooAccount(request.headers, email, appPassword);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof YahooError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to connect Yahoo Mail." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await disconnectYahooAccount(request.headers);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof YahooError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to disconnect Yahoo Mail." }, { status: 500 });
  }
}
