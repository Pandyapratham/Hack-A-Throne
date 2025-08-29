"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { useSession } from "@/lib/use-session"
import { useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminDashboard() {
  const { session, loading } = useSession()
  const { data: analytics } = useSWR("/api/analytics", fetcher)
  const { data: attendance } = useSWR("/api/attendance", fetcher)

  const attendanceStats = useMemo(() => {
    const present = attendance?.attendance?.filter((a: any) => a.status === "Present").length ?? 0
    const total = attendance?.attendance?.length ?? 0
    return { present, total }
  }, [attendance])

  const quickActions = useMemo(() => (
    <CardContent className="flex gap-2">
      <Link href="/admin/events">
        <Button className="bg-blue-600 hover:bg-blue-700">Create Event</Button>
      </Link>
      <Link href="/admin/analytics">
        <Button variant="outline">Analytics</Button>
      </Link>
    </CardContent>
  ), [])

  const navigationButtons = useMemo(() => (
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
  ), [])

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

  if (!session || session.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-4">You need to be logged in as an admin to access this page.</p>
          <Link href="/admin/login">
            <Button>Go to Admin Login</Button>
          </Link>
        </div>
      </div>
    )
  }

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
              {attendanceStats.present}/{attendanceStats.total}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            {quickActions}
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            {navigationButtons}
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
