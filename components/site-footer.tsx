import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="space-y-2">
          <div className="heading text-lg md:text-xl font-semibold">MARK-IT</div>
          <p className="text-base text-muted-foreground">
            Smart Attendance & Feedback System for Industrial Visits & Internships.
          </p>
        </div>

        <div>
          <div className="heading text-base md:text-lg font-semibold mb-2">Links</div>
          <ul className="space-y-1 text-base">
            <li>
              <Link
                href="/"
                className="relative hover:text-foreground after:absolute after:left-0 after:right-auto after:bottom-0 after:h-0.5 after:w-0 after:bg-primary/70 hover:after:w-full after:transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/student"
                className="relative hover:text-foreground after:absolute after:left-0 after:right-auto after:bottom-0 after:h-0.5 after:w-0 after:bg-primary/70 hover:after:w-full after:transition-all"
              >
                Student Portal
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="relative hover:text-foreground after:absolute after:left-0 after:right-auto after:bottom-0 after:h-0.5 after:w-0 after:bg-primary/70 hover:after:w-full after:transition-all"
              >
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/company"
                className="relative hover:text-foreground after:absolute after:left-0 after:right-auto after:bottom-0 after:h-0.5 after:w-0 after:bg-primary/70 hover:after:w-full after:transition-all"
              >
                Company View
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="heading text-base md:text-lg font-semibold mb-2">Contact</div>
          <p className="text-base text-muted-foreground">
            contact@mark-it.example
            <br />
            +1 (555) 123-4567
            <br />
            123 Campus Road, City
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 text-center py-5 text-sm text-muted-foreground">
        © {new Date().getFullYear()} MARK-IT. All rights reserved.
      </div>
    </footer>
  )
}
