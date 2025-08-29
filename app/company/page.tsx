"use client"

import useSWR from "swr"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RatingsBar } from "@/components/charts/ratings-bar"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CompanyView() {
  const { data } = useSWR("/api/analytics", fetcher)
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Company Feedback Summary</h1>
        <Card>
          <CardHeader>
            <CardTitle>Session Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? <RatingsBar data={data.byEvent} /> : "Loading…"}
            <p className="mt-4 text-sm text-muted-foreground">
              Anonymous summary of student feedback to help plan improvements.
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </>
  )
}
