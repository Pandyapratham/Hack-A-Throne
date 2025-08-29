"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AdminEventForm() {
  const [form, setForm] = useState({ title: "", company: "", date: "", time: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (data.id) {
      router.push(`/admin/events/submit?eventId=${data.id}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Event Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm">Event Title</label>
            <input
              name="title"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm">Company</label>
            <input
              name="company"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm">Date</label>
            <input
              name="date"
              type="date"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm">Time</label>
            <input
              name="time"
              type="time"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Event Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
