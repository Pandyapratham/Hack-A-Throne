"use client"
import { useEffect, useState, useCallback } from "react"

export function useSession() {
  const [session, setSession] = useState<{ role: string; id: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const readSession = useCallback(() => {
    try {
      const value = document.cookie
        .split('; ')
        .find((row) => row.startsWith('session='))
        ?.split('=')[1]
      
      console.log('Reading session cookie:', value) // Debug log
      
      if (value) {
        const sessionData = JSON.parse(decodeURIComponent(value))
        console.log('Parsed session data:', sessionData) // Debug log
        setSession(sessionData)
      } else {
        console.log('No session cookie found') // Debug log
        setSession(null)
      }
    } catch (error) {
      console.error('Error reading session:', error)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    readSession()
    
    // Only check for cookie changes every 5 seconds to reduce overhead
    const interval = setInterval(readSession, 5000)
    return () => clearInterval(interval)
  }, [readSession])

  const logout = useCallback(async () => {
    try {
      console.log('Logging out...') // Debug log
      await fetch("/api/auth/logout", { method: "POST" })
      setSession(null)
      console.log('Logout successful') // Debug log
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }, [])

  return { session, loading, logout }
}
