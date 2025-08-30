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

export default function StudentLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, session, user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (session && user && !authLoading) {
      console.log('User already authenticated, redirecting to student page')
      router.push('/student')
    }
  }, [session, user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log('Attempting to sign in with:', email)

      // Basic validation
      if (!email || !password) {
        setError('Please enter both email and password')
        return
      }

      const { data, error } = await signIn(email, password)

      if (error) {
        console.error('Sign in error:', error)

        // Handle specific Supabase errors
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.')
        } else if (error.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a moment and try again.')
        } else {
          setError(error.message || 'Login failed. Please try again.')
        }
      } else {
        console.log('Sign in successful:', data)
        // The AuthContext will handle setting the session cookie
        // and the useEffect above will handle the redirect
        if (data?.session) {
          console.log('Session created, redirecting...')
          router.push('/student')
        } else {
          setError('Login failed. Please try again.')
        }
      }
    } catch (err: any) {
      console.error('Unexpected error during sign in:', err)

      // Handle network or configuration errors
      if (err.message?.includes('fetch')) {
        setError('Network error. Please check your connection and try again.')
      } else if (err.message?.includes('Supabase')) {
        setError('Authentication service error. Please check your configuration.')
      } else {
        setError(err.message || "Failed to sign in")
      }
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
          <CardTitle className="heading">Student Login</CardTitle>
          <CardDescription>Sign in to your account to access attendance and feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="student-email">Email</Label>
              <Input
                id="student-email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="student-password">Password</Label>
              <Input
                id="student-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link href="/student/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}