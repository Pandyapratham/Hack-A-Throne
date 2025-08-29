"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      // Reduced timeout for faster redirect
      setTimeout(() => {
        router.push("/admin")
      }, 50)
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
          <CardTitle className="heading">Admin Login</CardTitle>
          <CardDescription>Manage events, attendance, and analytics.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@institute.edu" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
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
