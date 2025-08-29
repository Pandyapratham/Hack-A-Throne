
import { NextRequest, NextResponse } from "next/server"

let students: any[] = []

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()
  if (students.find((s) => s.email === email)) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 })
  }
  students.push({ id: `s-${Date.now()}`, name, email, password })
  return NextResponse.json({ success: true })
}
