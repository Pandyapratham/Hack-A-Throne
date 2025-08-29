"use client"

<<<<<<< HEAD
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { AuthWrapper } from "@/components/auth-wrapper"
import { AdminEventForm } from "@/components/admin-event-form"
=======
import { useState } from "react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRGenerator } from "@/components/qr/qr-generator"
>>>>>>> 0a73ca0ce88c1c405aebe036743ab00d7fea815f

export default function EventsPage() {
  const [eventId, setEventId] = useState("e1")
  const [form, setForm] = useState({ title: "", company: "", date: "", time: "" })

  const generate = () => {
    // simulate event creation by producing a dummy id from title
    if (form.title.trim().length) {
      setEventId(`e-${form.title.toLowerCase().replace(/\s+/g, "-").slice(0, 12)}`)
    }
  }

  return (
    <AuthWrapper allowedRoles={["admin"]} redirectTo="/admin/login">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Event Creation & QR Code</h1>
        <Card>
          <CardHeader>
            <CardTitle>Create a New Event</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm">Event Title</label>
              <input
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm">Company</label>
              <input
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm">Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm">Time</label>
              <input
                type="time"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={generate}>
                Generate QR
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Students scanning this QR will register for event ID: <strong>{eventId}</strong>
            </p>
            <QRGenerator value={eventId} />
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </AuthWrapper>
  )
}
