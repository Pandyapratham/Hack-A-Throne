"use client"

import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { useSession } from "@/lib/use-session"
import { useMemo } from "react"
import QRScanner from "../../components/QRScanner";

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function StudentPortal() {
  const { session, loading } = useSession()
  const { data: events } = useSWR("/api/events", fetcher)
  
  const handleScan = useMemo(() => (data: string) => {
    // alert("Scanned QR: " + data);
  }, [])

  const eventsList = useMemo(() => {
    if (!events?.events) return <li className="text-muted-foreground">Loading events…</li>
    
    return events.events.map((ev: any) => (
      <li key={ev.id} className="flex items-center justify-between border rounded-md p-2">
        <div>
          <div className="font-medium">{ev.title}</div>
          <div className="text-muted-foreground">
            {ev.company} • {ev.date} {ev.time}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{ev.location}</span>
      </li>
    ))
  }, [events])

  // Simple authentication check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-4">You need to be logged in as a student to access this page.</p>
          <Link href="/student/login">
            <Button>Go to Student Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Student Portal</h1>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR to Mark Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Use the QR scanner to mark your attendance.</p>
              
              <QRScanner onScan={handleScan} />
              
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                {eventsList}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
