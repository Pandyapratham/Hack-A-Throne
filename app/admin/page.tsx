"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, QrCode, MapPin, Calendar, Clock, Building2 } from "lucide-react"
import { QRCodeSVG } from 'qrcode.react'

// Static event data from the provided images
const staticEvents = [
  {
    event_id: "33333333-3333-3333-3333-333333333333",
    title: "Industrial Visit: TechCorp",
    description: "A guided tour of TechCorp's manufacturing facility",
    company_name: "TechCorp",
    event_date: "2025-09-05",
    start_time: "09:00:00",
    location_latitude: 22.298284,
    location_longitude: 67.5806,
    longitude: 100,
    valid_radius_meters: 100,
    qr_code_data: "111111111111111111111111111",
    created_by_admin_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    created_at: "2025-08-29T10:13:35.177279+00:00",
    attendee: ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"]
  },
  {
    event_id: "44444444-4444-4444-4444-444444444444",
    title: "Internship Session: AutoMotive Ltd.",
    description: "Hands-on session with AutoMotive Ltd. exploring career opportunities",
    company_name: "AutoMotive Ltd.",
    event_date: "2025-09-12",
    start_time: "13:30:00",
    location_latitude: 22.298284,
    location_longitude: 67.5806,
    longitude: 150,
    valid_radius_meters: 44444444444444444,
    qr_code_data: "22222222222222222222222...",
    created_by_admin_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    created_at: "2025-08-29T10:13:35.177279+00:00",
    attendee: ["bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"]
  }
]

// Mock analytics data
const mockAnalytics = {
  overallAverage: 4.2,
  totalFeedbacks: 45,
  responseRate: "78%"
}

// Mock attendance data
const mockAttendance = {
  attendance: [
    { status: "Present" },
    { status: "Present" },
    { status: "Absent" },
    { status: "Present" },
    { status: "Present" }
  ]
}

export default function AdminDashboard() {
  const [selectedEvent, setSelectedEvent] = useState(staticEvents[0])
  const [showQR, setShowQR] = useState(false)

  const attendanceStats = useMemo(() => {
    const present = mockAttendance.attendance.filter(a => a.status === "Present").length
    const total = mockAttendance.attendance.length
    return { present, total }
  }, [])

  const handleDownloadPDF = () => {
    const pdfUrl = "https://drive.google.com/uc?export=download&id=1oT4Wtx6f_qlt8t2gCWQDmMANn7kz1fF5"
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${selectedEvent.title}_Analysis_Report.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleGenerateQR = () => {
    setShowQR(!showQR)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Analytics Overview */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Overall Rating</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold text-blue-600">
              {mockAnalytics.overallAverage}/5
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold text-green-600">
              {attendanceStats.present}/{attendanceStats.total}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Response Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold text-purple-600">
              {mockAnalytics.responseRate}
            </CardContent>
          </Card>
        </section>

        {/* Event Selection */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Events Management</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {staticEvents.map((event) => (
              <Card
                key={event.event_id}
                className={`cursor-pointer transition-all ${selectedEvent.event_id === event.event_id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                  }`}
                onClick={() => setSelectedEvent(event)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    {event.company_name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {event.event_date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {event.start_time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {event.location_latitude.toFixed(4)}, {event.location_longitude.toFixed(4)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Selected Event Details & Actions */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                <p className="text-gray-600 mt-1">{selectedEvent.description}</p>
              </div>
              <div className="space-y-2 text-sm">
                {/* Removed Event ID display to avoid exposing it */}
                <div><strong>Company:</strong> {selectedEvent.company_name}</div>
                <div><strong>Date & Time:</strong> {selectedEvent.event_date} at {selectedEvent.start_time}</div>
                <div><strong>Valid Radius:</strong> {selectedEvent.valid_radius_meters} meters</div>
                <div><strong>Attendees:</strong> {selectedEvent.attendee.length}</div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleGenerateQR} className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  {showQR ? 'Hide QR Code' : 'Generate QR Code'}
                </Button>
                <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showQR ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-48 h-48 border-2 border-gray-200 bg-white p-4 rounded-lg flex items-center justify-center">
                    <QRCodeSVG
                      value={selectedEvent.event_id} // Not shown in UI but encoded in QR
                      size={240}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Scan this code to check-in to the event</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Click "Generate QR Code" to display the event QR code</p>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold">Quick Actions:</h4>
                <div className="grid gap-2">
                  <Button variant="outline" size="sm">View Attendance</Button>
                  <Button variant="outline" size="sm">View Feedback</Button>
                  <Button variant="outline" size="sm">Send Notifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Navigation & Tips */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline">Attendance Report</Button>
              <Button variant="outline">Feedback Analytics</Button>
              <Button variant="outline">Event Creation</Button>
              <Button variant="outline">User Management</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Use QR codes for quick check-ins, validate locations for authenticity, and encourage students to submit
              feedback right after sessions. Download reports regularly to track engagement trends.
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-gray-600">
          <p>&copy; 2025 Event Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
