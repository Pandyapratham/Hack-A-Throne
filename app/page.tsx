import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle2, BarChart3, QrCode, MapPin } from "lucide-react"

export default function Page() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4">
        <section className="py-12 md:py-20 text-center animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
          <div className="mx-auto max-w-3xl">
            <h1 className="heading text-5xl md:text-6xl font-semibold text-balance">
              Smart Attendance & Feedback System
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              MARK-IT streamlines industrial visits and internships with QR-based attendance, GPS validation, and
              actionable analytics.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* <Link href="/student/login">
                <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto transition-transform hover:-translate-y-0.5 text-base md:text-lg">
                  Student Login
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent transition-transform hover:-translate-y-0.5 text-base md:text-lg"
                >
                  Faculty/Admin Login
                </Button>
              </Link>
              <Link href="/company">
                <Button className="bg-accent hover:bg-accent/90 w-full sm:w-auto transition-transform hover:-translate-y-0.5 text-base md:text-lg">
                  Company Login
                </Button>
              </Link> */}
            </div>
          </div>
          <div className="mt-10 animate-in fade-in-50 zoom-in-50 duration-700">
            <img
              src="/analytics-dashboard-preview-for-attendance-and-fee.png"
              alt="Analytics dashboard preview"
              className="mx-auto rounded-xl border animate-float-slow"
            />
          </div>
        </section>

        <section className="py-8 grid gap-4 md:grid-cols-4">
          <Card className="card transition-transform hover:-translate-y-1 hover:shadow-md animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <QrCode className="text-primary" />
                <div className="heading font-semibold">QR Attendance</div>
              </div>
              <p className="mt-2 text-base text-muted-foreground">
                Fast, accurate attendance using QR codes generated per event.
              </p>
            </CardContent>
          </Card>
          <Card className="card transition-transform hover:-translate-y-1 hover:shadow-md animate-in fade-in-50 slide-in-from-bottom-2 duration-700 [animation-delay:80ms]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-accent" />
                <div className="heading font-semibold">GPS Validation</div>
              </div>
              <p className="mt-2 text-base text-muted-foreground">Ensure students are on-site with location checks.</p>
            </CardContent>
          </Card>
          <Card className="card transition-transform hover:-translate-y-1 hover:shadow-md animate-in fade-in-50 slide-in-from-bottom-2 duration-700 [animation-delay:160ms]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary" />
                <div className="heading font-semibold">Smart Feedback</div>
              </div>
              <p className="mt-2 text-base text-muted-foreground">Structured ratings and comments after attendance.</p>
            </CardContent>
          </Card>
          <Card className="card transition-transform hover:-translate-y-1 hover:shadow-md animate-in fade-in-50 slide-in-from-bottom-2 duration-700 [animation-delay:240ms]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-accent" />
                <div className="heading font-semibold">Analytics Dashboard</div>
              </div>
              <p className="mt-2 text-base text-muted-foreground">Visualize attendance, satisfaction, and sentiment.</p>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
