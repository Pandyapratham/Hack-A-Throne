"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StudentSignupPage() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // TODO: integrate real signup. For now simulate and redirect to student dashboard.
    setTimeout(() => {
      setLoading(false)
      window.location.href = "/student"
    }, 800)
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
      <Card className="card">
        <CardHeader>
          <CardTitle className="heading">Student Signup</CardTitle>
          <CardDescription>Create your account to manage attendance and feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="student-name">Full Name</Label>
              <Input id="student-name" type="text" placeholder="Alex Johnson" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-email">Email</Label>
              <Input id="student-email" type="email" placeholder="you@college.edu" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-password">Password</Label>
              <Input id="student-password" type="password" placeholder="••••••••" required />
            </div>
            <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/student/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
