import { NextResponse } from "next/server"
import { attendance } from "@/lib/dummy-data"

export async function GET() {
  return NextResponse.json({ attendance })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  // Simulate success (no persistence in demo)
  return NextResponse.json({ ok: true, received: body })
}
