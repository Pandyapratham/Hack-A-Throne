"use client"


import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { AdminEventForm } from "@/components/admin-event-form"


export default function EventsPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="heading text-2xl font-semibold mb-8">Events</h1>
        <AdminEventForm />
      </main>
      <SiteFooter />
    </>
  )
}
