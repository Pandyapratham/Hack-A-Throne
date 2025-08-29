"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { QRScanner } from "@/components/qr/qr-scanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { AuthWrapper } from "@/components/auth-wrapper"
import { CheckCircle2, MapPin } from "lucide-react"

export default function ScanPage() {
  const router = useRouter()
  const [eventId, setEventId] = useState<string | null>(null)
  const [gpsOK, setGpsOK] = useState(false)

  const handleResult = (value: string) => {
    setEventId(value)
    // Simulate GPS validation
    setTimeout(() => setGpsOK(true), 500)
  }

  const markAttendance = async () => {
    await fetch("/api/attendance", { method: "POST", body: JSON.stringify({ eventId, gpsOK }) })
    router.push(`/student/feedback?eventId=${eventId}`)
  }

  return (
    <AuthWrapper allowedRoles={["student"]} redirectTo="/student/login">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Scan QR Code</h1>
        <QRScanner onResult={handleResult} />
        {eventId && (
          <Card>
            <CardHeader>
              <CardTitle>Scan Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-blue-600" />
                <span className="text-sm">
                  Event detected: <strong>{eventId}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-teal-600" />
                <span className="text-sm">
                  {gpsOK ? "You are within 100m of event location." : "Validating location…"}
                </span>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={!gpsOK} onClick={markAttendance}>
                Mark Attendance
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <SiteFooter />
    </AuthWrapper>
  )
}
