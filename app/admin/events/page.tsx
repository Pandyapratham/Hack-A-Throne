"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRGenerator } from "@/components/qr/qr-generator"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface EventForm {
  title: string
  description: string
  company_name: string
  event_date: string
  start_time: string
  location_latitude: number | null
  location_longitude: number | null
  valid_radius_meters: number
  qr_code_data: string
}

export default function EventsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [eventId, setEventId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  const [form, setForm] = useState<EventForm>({
    title: "",
    description: "",
    company_name: "",
    event_date: "",
    start_time: "",
    location_latitude: null,
    location_longitude: null,
    valid_radius_meters: 100, // Default 100 meters
    qr_code_data: ""
  })

  // Debug authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setDebugInfo(`Session: ${session ? 'Found' : 'Not found'}, User: ${session?.user?.id || 'None'}`)
    }
    checkAuth()
  }, [])

  const handleInputChange = (field: keyof EventForm, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            location_latitude: position.coords.latitude,
            location_longitude: position.coords.longitude
          }))
          setSuccess("Location captured successfully!")
        },
        (error) => {
          setError("Unable to get location. Please enter coordinates manually.")
        }
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      setError("Event title is required")
      return false
    }
    if (!form.company_name.trim()) {
      setError("Company name is required")
      return false
    }
    if (!form.event_date) {
      setError("Event date is required")
      return false
    }
    if (!form.start_time) {
      setError("Start time is required")
      return false
    }
    return true
  }

  const testSupabaseConnection = async () => {
    try {
      setDebugInfo("Testing connection...")
      const { data, error } = await supabase.from('events').select('count', { count: 'exact', head: true })

      if (error) {
        setDebugInfo(`Connection failed: ${error.message}`)
        setError(`Database connection error: ${error.message}`)
      } else {
        setDebugInfo(`Connection successful! Events count: ${data.length}`)
        setSuccess("Database connection is working!")
      }
    } catch (err) {
      console.error('Connection test error:', err)
      setDebugInfo(`Connection test failed: ${err}`)
    }
  }

  const generateQRCode = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Check authentication first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        throw new Error(`Authentication error: ${sessionError.message}`)
      }

      if (!session || !session.user) {
        throw new Error("User not authenticated. Please log in again.")
      }

      console.log('User authenticated:', session.user.id)

      // Generate QR code data
      const qrData = `event-${form.title.toLowerCase().replace(/\s+/g, "-").slice(0, 12)}-${Date.now()}`

      // Prepare event data for insertion
      const eventData = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        company_name: form.company_name.trim(),
        event_date: form.event_date,
        start_time: form.start_time,
        location_latitude: form.location_latitude,
        location_longitude: form.location_longitude,
        valid_radius_meters: form.valid_radius_meters,
        qr_code_data: qrData,
        created_by_admin_id: session.user.id
      }

      console.log('Attempting to insert event data:', eventData)

      // Insert into Supabase
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select('*')
        .single()

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Database error: ${error.message}`)
      }

      if (!data) {
        throw new Error("No data returned from database")
      }

      console.log('Event created successfully:', data)

      // Update local state
      setEventId(data.event_id)
      setForm(prev => ({ ...prev, qr_code_data: qrData }))
      setSuccess("Event created successfully!")

    } catch (err) {
      console.error('Full error object:', err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred. Check console for details.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToDashboard = () => {
    router.push('/admin/dashboard')
  }

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      company_name: "",
      event_date: "",
      start_time: "",
      location_latitude: null,
      location_longitude: null,
      valid_radius_meters: 100,
      qr_code_data: ""
    })
    setEventId(null)
    setError(null)
    setSuccess(null)
  }

  return (
    <AuthWrapper allowedRoles={["admin"]} redirectTo="/admin/login">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading text-2xl font-semibold">Event Creation & QR Code</h1>
          <Button
            variant="outline"
            onClick={navigateToDashboard}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Debug Information */}
        {debugInfo && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">Debug: {debugInfo}</AlertDescription>
          </Alert>
        )}

        {/* Alert Messages */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Create a New Event</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Basic Event Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Event Title *</label>
                <input
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Company Name *</label>
                <input
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter event description (optional)"
              />
            </div>

            {/* Date and Time */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Event Date *</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.event_date}
                  onChange={(e) => handleInputChange('event_date', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Start Time *</label>
                <input
                  type="time"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Event Location</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Get Current Location
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm text-muted-foreground">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={form.location_latitude || ''}
                    onChange={(e) => handleInputChange('location_latitude', parseFloat(e.target.value) || null)}
                    placeholder="e.g., 40.7128"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={form.location_longitude || ''}
                    onChange={(e) => handleInputChange('location_longitude', parseFloat(e.target.value) || null)}
                    placeholder="e.g., -74.0060"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Valid Radius (meters)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={form.valid_radius_meters}
                    onChange={(e) => handleInputChange('valid_radius_meters', parseInt(e.target.value) || 100)}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={generateQRCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  "Create Event & Generate QR"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
              >
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        {eventId && form.qr_code_data && (
          <Card>
            <CardHeader>
              <CardTitle>Generated QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Event created successfully!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Event ID: <strong>{eventId}</strong>
                </p>
                <p className="text-sm text-green-700">
                  Students can scan this QR code to register for the event.
                </p>
              </div>

              <div className="flex justify-center">
                <QRGenerator value={form.qr_code_data} />
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  QR Code Data: <code className="bg-gray-100 px-2 py-1 rounded">{form.qr_code_data}</code>
                </p>
                <Button
                  onClick={navigateToDashboard}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Go to Event Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <SiteFooter />
    </AuthWrapper>
  )
}