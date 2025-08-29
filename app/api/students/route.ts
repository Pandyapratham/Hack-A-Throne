import { NextResponse } from "next/server"
import { students } from "@/lib/dummy-data"
export async function GET() {
  return NextResponse.json({ students })
}
