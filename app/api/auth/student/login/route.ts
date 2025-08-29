
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  // Accept any credentials
  const { email } = await req.json()
  const c = await cookies();
  c.set("session", JSON.stringify({ role: "student", id: email }), { httpOnly: true, path: "/" })
  return NextResponse.json({ success: true })
}
