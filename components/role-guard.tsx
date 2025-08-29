"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/use-session"
import { LoadingSkeleton } from "./loading-skeleton"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export function RoleGuard({ children, allowedRoles, redirectTo = "/" }: RoleGuardProps) {
  const { session, loading } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Prevent multiple redirects
    if (isRedirecting) return

    if (!loading && !session) {
      setIsRedirecting(true)
      router.push(redirectTo)
      return
    }

    if (!loading && session && !allowedRoles.includes(session.role)) {
      setIsRedirecting(true)
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
  }, [session, loading, allowedRoles, redirectTo, router, isRedirecting])

  // Show loading while checking session
  if (loading) {
    return <LoadingSkeleton />
  }

  // Show loading while redirecting
  if (isRedirecting) {
    return <LoadingSkeleton />
  }

  // Show nothing if no session or wrong role
  if (!session || !allowedRoles.includes(session.role)) {
    return null
  }

  return <>{children}</>
}
