import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  return NextResponse.json({
    success: true,
    message: "Lead import endpoint er klar til at blive koblet til Supabase inserts.",
    count: Array.isArray(payload?.leads) ? payload.leads.length : 0
  });
}
