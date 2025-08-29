import { NextResponse } from "next/server"
import { events } from "@/lib/dummy-data"
export async function GET() {
  return NextResponse.json({ events })
}


import { NextRequest, NextResponse } from "next/server"

// In-memory event store for demo (replace with DB in production)
let events: any[] = []

export async function POST(req: NextRequest) {
  const data = await req.json()
  // Generate a simple event ID
  const id = `e-${Date.now()}`
  const event = { ...data, id }
  events.push(event)
  return NextResponse.json({ id })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get("eventId")
  if (eventId) {
    const event = events.find((e) => e.id === eventId)
    if (!event) return NextResponse.json({}, { status: 404 })
    return NextResponse.json(event)
  }
  return NextResponse.json({ events })
}
