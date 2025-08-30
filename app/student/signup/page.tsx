"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function StudentSignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { signUp, session, user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (session && user && !authLoading) {
      console.log('User already authenticated, redirecting to student page')
      router.push('/student')
    }
  }, [session, user, authLoading, router])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    try {
      console.log('Attempting to sign up with:', email)
      const { data, error } = await signUp(email, password)

      if (error) {
        console.error('Sign up error:', error)
        setError(error.message)
      } else {
        console.log('Sign up successful:', data)
        if (data?.session) {
          // User is immediately signed in
          setMessage("Account created successfully! Redirecting...")
          setTimeout(() => {
            router.push('/student')
          }, 1500)
        } else if (data?.user && !data.session) {
          // Email confirmation required
          setMessage("Account created! Please check your email to confirm your account before signing in.")
        } else {
          setError('Signup failed. Please try again.')
        }
      }
    } catch (err: any) {
      console.error('Unexpected error during sign up:', err)
      setError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
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
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                {message}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="student-name">Full Name</Label>
              <Input
                id="student-name"
                name="fullName"
                type="text"
                placeholder="Alex Johnson"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="student-email">Email</Label>
              <Input
                id="student-email"
                name="email"
                type="email"
                placeholder="you@college.edu"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="student-password">Password</Label>
              <Input
                id="student-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
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