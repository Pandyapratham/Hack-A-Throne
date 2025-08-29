"use client"

import useSWR from "swr"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RatingsBar } from "@/components/charts/ratings-bar"
import { SentimentPie } from "@/components/charts/sentiment-pie"
import { WordCloud } from "@/components/charts/word-cloud"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AnalyticsPage() {
  const { data } = useSWR("/api/analytics", fetcher)

  const sentiments = data?.sentiments ? Object.entries(data.sentiments).map(([name, value]) => ({ name, value })) : []

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Feedback Analytics</h1>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Average Ratings by Event</CardTitle>
            </CardHeader>
            <CardContent>{data ? <RatingsBar data={data.byEvent} /> : "Loading…"}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>{data ? <SentimentPie data={sentiments} /> : "Loading…"}</CardContent>
          </Card>
        </section>
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Suggestions Word Cloud</CardTitle>
            </CardHeader>
            <CardContent>{data ? <WordCloud words={data.words} /> : "Loading…"}</CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
