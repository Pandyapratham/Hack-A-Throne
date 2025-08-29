
import { NextRequest, NextResponse } from "next/server"

let admins: any[] = []

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()
  if (admins.find((a) => a.email === email)) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 })
  }
  admins.push({ id: `a-${Date.now()}`, name, email, password })
  return NextResponse.json({ success: true })
}
