import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  return NextResponse.json({
    success: true,
    message: "Webhook placeholder modtog lead payload.",
    received_at: new Date().toISOString(),
    payload
  });
}
