"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "@/lib/use-session"
import { Logo } from "@/components/logo"
import { useMemo, useCallback } from "react"

export function SiteNav() {
  const pathname = usePathname()
  const { session, logout } = useSession()
  const router = useRouter()

  const navLink = useCallback((href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={`relative px-3 py-2 rounded-md text-base transition-colors after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary/70 after:transition-transform hover:after:scale-x-100 ${
        pathname === href
          ? "bg-primary text-primary-foreground"
          : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
      }`}
    >
      {label}
    </Link>
  ), [pathname])

  const handleLogout = useCallback(async () => {
    await logout()
    router.push("/")
    router.refresh()
  }, [logout, router])

  const renderNavItems = useMemo(() => {
    if (!session) return null

    if (session.role === "student") {
      return (
        <nav className="hidden md:flex items-center gap-1">
          {navLink("/", "Home")}
          {navLink("/student", "Student")}
          {navLink("/reports", "Reports")}
        </nav>
      )
    }

    if (session.role === "admin") {
      return (
        <nav className="hidden md:flex items-center gap-1">
          {navLink("/", "Home")}
          {navLink("/admin", "Admin")}
          {navLink("/company", "Company")}
          {navLink("/reports", "Reports")}
        </nav>
      )
    }

    return null
  }, [session, navLink])

  const userInfo = useMemo(() => {
    if (!session) return null
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {session.role === "admin" ? "Admin" : "Student"} logged in
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="text-xs"
        >
          Logout
        </Button>
      </div>
    )
  }, [session, handleLogout])

  const loginButtons = useMemo(() => (
    <div className="flex items-center gap-2">
      <Link href="/student/login">
        <Button className="bg-primary hover:bg-primary/90 transition-transform hover:-translate-y-0.5 text-base">
          Student Login
        </Button>
      </Link>
      <Link href="/admin/login">
        <Button className="bg-primary hover:bg-primary/90 transition-transform hover:-translate-y-0.5 text-base">
          Faculty/Admin Login
        </Button>
      </Link>
    </div>
  ), [])

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-in slide-in-from-top-2 duration-500">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Logo variant="navbar" />

        {session ? (
          <>
            {renderNavItems}
            {userInfo}
          </>
        ) : (
          loginButtons
        )}
      </div>
    </header>
  )
}
