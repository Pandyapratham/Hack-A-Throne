"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRGenerator } from "@/components/qr/qr-generator"

export default function EventSubmitPage() {
  const params = useSearchParams()
  const [event, setEvent] = useState<any>(null)
  const [qr, setQr] = useState(false)

  useEffect(() => {
    // Fetch event details from DB using eventId from params
    const eventId = params.get("eventId")
    if (eventId) {
      fetch(`/api/events?eventId=${eventId}`)
        .then((res) => res.json())
        .then((data) => setEvent(data))
    }
  }, [params])

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Event Details</h1>
        {event && (
          <Card>
            <CardHeader>
              <CardTitle>Submitted Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">Title: <strong>{event.title}</strong></div>
              <div className="text-sm">Company: <strong>{event.company}</strong></div>
              <div className="text-sm">Date: <strong>{event.date}</strong></div>
              <div className="text-sm">Time: <strong>{event.time}</strong></div>
              {!qr ? (
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setQr(true)}>
                  Generate QR Code
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">QR for event ID: <strong>{event.id}</strong></div>
                  <QRGenerator value={event.id} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
