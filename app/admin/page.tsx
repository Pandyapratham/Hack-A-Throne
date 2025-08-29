"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminDashboard() {
  const { data: analytics } = useSWR("/api/analytics", fetcher)
  const { data: attendance } = useSWR("/api/attendance", fetcher)

  const present = attendance?.attendance?.filter((a: any) => a.status === "Present").length ?? 0
  const total = attendance?.attendance?.length ?? 0

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Admin Dashboard</h1>
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Overall Rating</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{analytics?.overallAverage ?? "—"}/5</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {present}/{total}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href="/admin/events">
                <Button className="bg-blue-600 hover:bg-blue-700">Create Event</Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline">Analytics</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Link href="/admin/attendance">
                <Button variant="outline">Attendance Report</Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline">Feedback Analytics</Button>
              </Link>
              <Link href="/admin/events">
                <Button variant="outline">Event Creation & QR</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use QR codes for quick check-ins, validate locations for authenticity, and encourage students to submit
              feedback right after sessions.
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
