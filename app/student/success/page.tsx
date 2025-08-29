import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-xl px-4 py-16 text-center space-y-4">
        <CheckCircle2 className="mx-auto h-12 w-12 text-teal-600" />
        <h1 className="heading text-2xl font-semibold">Attendance & Feedback Submitted Successfully!</h1>
        <p className="text-muted-foreground">Thank you for your input.</p>
        <div className="mt-4">
          <Link href="/student">
            <Button variant="outline">Back to Portal</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
