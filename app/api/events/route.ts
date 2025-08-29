import { NextRequest, NextResponse } from "next/server";
import { events as initialEvents } from "@/lib/dummy-data";

// In-memory event store for demo (replace with DB in production)
// Initialize with dummy data, but allow it to be modified.
let events: any[] = [...initialEvents];

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Generate a simple event ID
    const id = `e-${Date.now()}`;
    const event = { ...data, id };
    events.push(event);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  if (eventId) {
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  }
  return NextResponse.json({ events });
}
