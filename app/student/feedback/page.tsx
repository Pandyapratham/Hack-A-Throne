"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const categories = ["Session Relevance", "Speaker Quality", "Content Depth"] as const

export default function FeedbackPage() {
  const router = useRouter()
  const params = useSearchParams()
  const eventId = params.get("eventId") || "e1"
  const [rating, setRating] = useState(5)
  const [category, setCategory] = useState<(typeof categories)[number]>("Session Relevance")
  const [comment, setComment] = useState("")

  const submit = async () => {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, rating, category, comment }),
    })
    router.push("/student/success")
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Feedback</h1>
        <Card>
          <CardHeader>
            <CardTitle>Rate your session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Star rating</label>
              <div className="mt-2 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setRating(v)}
                    aria-label={`${v} star`}
                    className={`h-8 w-8 rounded-full border flex items-center justify-center ${v <= rating ? "bg-yellow-400 text-black" : "bg-background text-muted-foreground"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Suggestions / Comments</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Your thoughts…"
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[100px]"
              />
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={submit}>
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </>
  )
}
