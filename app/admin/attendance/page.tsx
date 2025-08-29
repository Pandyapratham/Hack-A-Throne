"use client"

import useSWR from "swr"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AttendanceReport() {
  const { data } = useSWR("/api/attendance", fetcher)

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Attendance Report</h1>
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Roll No.</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Location Verified</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.attendance?.map((a: any) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{a.studentId}</td>
                    <td className="py-2 pr-4">—</td>
                    <td className="py-2 pr-4">{a.time}</td>
                    <td className="py-2 pr-4">{a.locationVerified ? "Yes" : "No"}</td>
                    <td className="py-2 pr-4">{a.status}</td>
                  </tr>
                )) || (
                  <tr>
                    <td className="py-2 pr-4 text-muted-foreground">Loading…</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </>
  )
}
