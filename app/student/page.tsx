"use client";

import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import QRScanner from "../../components/QRScanner";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function StudentPortal() {
  const { data: events } = useSWR("/api/events", fetcher);
  function handleScan(data: string) {
    // For demonstration, we'll just log the data.
    // In a real app, you'd likely send this to a server to mark attendance.
    console.log("Scanned QR data:", data);
    alert("Scanned QR: " + data);
    // Example of sending data to the server:
    /*
    fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrData: data, studentId: 'some-student-id' })
    })
    .then(res => res.json())
    .then(result => {
      if(result.ok) {
        // show success message
      } else {
        // show error message
      }
    });
    */
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
              <p className="text-sm text-muted-foreground">
                Use the QR scanner to mark your attendance.
              </p>

              <QRScanner onScan={handleScan} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                {events?.events?.map((ev: any) => (
                  <li
                    key={ev.id}
                    className="flex items-center justify-between border rounded-md p-2"
                  >
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-muted-foreground">
                        {ev.company} • {ev.date} {ev.time}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {ev.location}
                    </span>
                  </li>
                )) || (
                  <li className="text-muted-foreground">Loading events…</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
