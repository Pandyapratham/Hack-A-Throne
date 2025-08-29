"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function SiteNav() {
  const pathname = usePathname()
  const navLink = (href: string, label: string) => (
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
  )

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-in slide-in-from-top-2 duration-500">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" aria-label="MARK-IT Home" className="group flex items-center gap-3">
          {/* Symbol logo: circular checkbox */}
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-primary/20 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" role="img" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              <path
                d="M9.5 12.5l2 2.5 4-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* soft accent pulse */}
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-accent/20 animate-ping-slow" />
          </span>
          <span className="heading text-xl md:text-2xl font-semibold tracking-tight text-foreground transition-transform group-hover:translate-x-px">
            MARK-IT
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLink("/", "Home")}
          {navLink("/student", "Student")}
          {navLink("/admin", "Admin")}
          {navLink("/company", "Company")}
          {navLink("/reports", "Reports")}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/student/login">
            <Button className="bg-primary hover:bg-primary/90 transition-transform hover:-translate-y-0.5 text-base">
              Student Login
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" className="transition-transform hover:-translate-y-0.5 bg-transparent text-base">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
