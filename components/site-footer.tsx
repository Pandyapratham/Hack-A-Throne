import Link from "next/link"
import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="space-y-4">
          <Logo variant="footer" />
          <p className="text-base text-muted-foreground">
            Smart Attendance & Feedback System for Industrial Visits & Internships.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Online
          </div>
        </div>

        <div>
          <div className="heading text-base md:text-lg font-semibold mb-3">Quick Links</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="relative hover:text-foreground transition-colors duration-200 after:absolute after:left-0 after:right-auto after:bottom-0 after:h-0.5 after:w-0 after:bg-primary/70 hover:after:w-full after:transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/student"
                className="relative hover:text-foreground transition-colors duration-200 after:absolute after:left-0 after:right-auto after:bottom-0 after:h-0.5 after:w-0 after:bg-primary/70 hover:after:w-full after:transition-all"
              >
                Student Portal
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="relative hover:text-foreground transition-colors duration-200 after:absolute after:left-0 after:right-auto after:bottom-0 after:h-0.5 after:w-0 after:bg-primary/70 hover:after:w-full after:transition-all"
              >
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/company"
                className="relative hover:text-foreground transition-colors duration-200 after:absolute after:left-0 after:right-auto after:bottom-0 after:h-0.5 after:w-0 after:bg-primary/70 hover:after:w-full after:transition-all"
              >
                Company View
              </Link>
            </li>
            <li>
              <Link
                href="/reports"
                className="relative hover:text-foreground transition-colors duration-200 after:absolute after:left-0 after:right-auto after:bottom-0 after:h-0.5 after:w-0 after:bg-primary/70 hover:after:w-full after:transition-all"
              >
                Reports
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="heading text-base md:text-lg font-semibold mb-3">Contact Info</div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              contact@mark-it.example
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              +1 (555) 123-4567
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              123 Campus Road, City
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 text-center py-5 text-sm text-muted-foreground">
        © {new Date().getFullYear()} MARK-IT. All rights reserved.
      </div>
    </footer>
  )
}
