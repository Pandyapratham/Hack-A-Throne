"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function StudentLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/student/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      window.location.href = "/student"
    } else {
      setError("Invalid credentials")
    }
    setLoading(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.type === "email" ? "email" : "password"]: e.target.value })
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
      <Card className="card">
        <CardHeader>
          <CardTitle className="heading">Student Login</CardTitle>
          <CardDescription>Access your dashboard to scan QR and submit feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="student-email">Email</Label>
              <Input id="student-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-password">Password</Label>
              <Input id="student-password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/student/signup" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
