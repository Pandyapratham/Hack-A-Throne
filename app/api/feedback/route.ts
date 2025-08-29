import { NextResponse } from "next/server"
import { feedback } from "@/lib/dummy-data"

export async function GET() {
  return NextResponse.json({ feedback })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({ ok: true, received: body })
}
