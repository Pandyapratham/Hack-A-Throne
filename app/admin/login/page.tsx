"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // TODO: integrate real admin auth
    setTimeout(() => {
      setLoading(false)
      window.location.href = "/admin"
    }, 700)
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
      <Card className="card">
        <CardHeader>
          <CardTitle className="heading">Admin Login</CardTitle>
          <CardDescription>Manage events, attendance, and analytics.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" placeholder="admin@institute.edu" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" placeholder="••••••••" required />
            </div>
            <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Need an account?{" "}
            <Link href="/admin/signup" className="text-blue-600 hover:underline">
              Create admin account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
