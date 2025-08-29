"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/use-session"
import { LoadingSkeleton } from "./loading-skeleton"

interface AuthWrapperProps {
  children: React.ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export function AuthWrapper({ children, allowedRoles, redirectTo = "/" }: AuthWrapperProps) {
  const { session, loading } = useSession()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only redirect once
    if (hasRedirected) return

    if (!loading) {
      if (!session) {
        setHasRedirected(true)
        router.push(redirectTo)
        return
      }

      if (!allowedRoles.includes(session.role)) {
        setHasRedirected(true)
        // Redirect to appropriate dashboard based on role
        if (session.role === "student") {
          router.push("/student")
        } else if (session.role === "admin") {
          router.push("/admin")
        } else {
          router.push(redirectTo)
        }
        return
      }
    }
  }, [session, loading, allowedRoles, redirectTo, router, hasRedirected])

  // Show loading while checking session
  if (loading) {
    return <LoadingSkeleton />
  }

  // Show loading while redirecting
  if (hasRedirected) {
    return <LoadingSkeleton />
  }

  // Show nothing if no session or wrong role
  if (!session || !allowedRoles.includes(session.role)) {
    return null
  }

  return <>{children}</>
}
