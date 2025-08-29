import { NextResponse } from "next/server"
import { feedback, events, getAverageRatingForAll, sentimentCounts, getWordFrequencies } from "@/lib/dummy-data"

export async function GET() {
  const byEvent = events.map((ev) => {
    const f = feedback.filter((x) => x.eventId === ev.id)
    const avg = f.length ? f.reduce((s, v) => s + v.rating, 0) / f.length : 0
    return { event: ev.title, avg: Math.round(avg * 10) / 10 }
  })

  const sentiments = sentimentCounts()
  const words = getWordFrequencies()

  return NextResponse.json({
    overallAverage: getAverageRatingForAll(),
    byEvent,
    sentiments,
    words,
  })
}
